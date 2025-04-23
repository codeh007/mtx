# LLM Agent

LlmAgent（通常简称为Agent）是ADK中的核心组件，作为应用程序的"思考"部分。它利用大型语言模型（LLM）的力量进行推理、理解自然语言、做出决策、生成响应以及与工具交互。

与遵循预定义执行路径的确定性工作流代理不同，LlmAgent的行为是非确定性的。它使用LLM来解释指令和上下文，动态决定如何继续、使用哪些工具（如果有的话），或者是否将控制权转移给另一个代理。

构建一个有效的LlmAgent需要定义其身份，通过指令明确指导其行为，并为其配备必要的工具和能力。

## 定义代理的身份和目的

首先，你需要确定代理是什么以及它的用途。

name（必需）：每个代理都需要一个唯一的字符串标识符。这个名称对内部操作至关重要，特别是在多代理系统中，代理需要相互引用或委派任务。选择一个描述性的名称来反映代理的功能（例如，customer_support_router、billing_inquiry_agent）。避免使用保留名称如user。

description（可选，多代理系统推荐）：提供代理能力的简明摘要。这个描述主要被其他LLM代理用来决定是否应该将任务路由到这个代理。使其足够具体以区别于其他代理（例如，"处理当前账单查询"，而不仅仅是"账单代理"）。

model（必需）：指定为这个代理提供推理能力的底层LLM。这是一个字符串标识符，如"gemini-2.0-flash"。模型的选择会影响代理的能力、成本和性能。有关可用选项和注意事项，请参见Models页面。

```python
# 示例：定义基本身份
capital_agent = LlmAgent(
    model="gemini-2.0-flash",
    name="capital_agent",
    description="回答用户关于给定国家首都的问题。"
    # 接下来将添加instruction和tools
)
```

## 指导代理：指令（instruction）

instruction参数可以说是塑造LlmAgent行为最关键的部分。它是一个字符串（或返回字符串的函数），告诉代理：

- 其核心任务或目标
- 其个性或角色（例如，"你是一个乐于助人的助手"，"你是一个机智的海盗"）
- 其行为的约束（例如，"只回答关于X的问题"，"永远不要透露Y"）
- 如何以及何时使用其工具。你应该解释每个工具的用途和应该调用的环境，补充工具本身的任何描述
- 其输出的期望格式（例如，"以JSON格式响应"，"提供项目符号列表"）

有效指令的技巧：

- 清晰具体：避免歧义。明确说明期望的行动和结果
- 使用Markdown：使用标题、列表等提高复杂指令的可读性
- 提供示例（Few-Shot）：对于复杂任务或特定输出格式，直接在指令中包含示例
- 指导工具使用：不要只是列出工具；解释代理何时以及为什么应该使用它们

```python
# 示例：添加指令
capital_agent = LlmAgent(
    model="gemini-2.0-flash",
    name="capital_agent",
    description="回答用户关于给定国家首都的问题。",
    instruction="""你是一个提供国家首都的代理。
当用户询问一个国家的首都时：
1. 从用户的查询中识别国家名称。
2. 使用`get_capital_city`工具查找首都。
3. 清晰地回应用户，说明首都城市。
示例查询："法国的首都是什么？"
示例响应："法国的首都是巴黎。"
""",
    # 接下来将添加tools
)
```

（注意：对于适用于系统中所有代理的指令，考虑在根代理上使用global_instruction，详见多代理部分。）

## 装备代理：工具（tools）

工具使你的LlmAgent具有超越LLM内置知识或推理的能力。它们允许代理与外部世界交互、执行计算、获取实时数据或执行特定操作。

tools（可选）：提供代理可以使用的工具列表。列表中的每个项目可以是：
- Python函数（自动包装为FunctionTool）
- 继承自BaseTool的类的实例
- 另一个代理的实例（AgentTool，实现代理间委派 - 参见多代理）

LLM使用函数/工具名称、描述（来自文档字符串或description字段）和参数模式来决定基于对话和其指令调用哪个工具。

```python
# 定义工具函数
def get_capital_city(country: str) -> str:
  """检索给定国家的首都城市。"""
  # 替换为实际逻辑（例如，API调用，数据库查找）
  capitals = {"france": "Paris", "japan": "Tokyo", "canada": "Ottawa"}
  return capitals.get(country.lower(), f"抱歉，我不知道{country}的首都。")

# 将工具添加到代理
capital_agent = LlmAgent(
    model="gemini-2.0-flash",
    name="capital_agent",
    description="回答用户关于给定国家首都的问题。",
    instruction="""你是一个提供国家首都的代理...（之前的指令文本）""",
    tools=[get_capital_city] # 直接提供函数
)
```

在工具部分了解更多关于工具的信息。

## 高级配置和控制

除了核心参数外，LlmAgent还提供了几个选项用于更精细的控制：

### 微调LLM生成（generate_content_config）

你可以使用generate_content_config调整底层LLM生成响应的方式。

generate_content_config（可选）：传递google.genai.types.GenerateContentConfig的实例来控制temperature（随机性）、max_output_tokens（响应长度）、top_p、top_k和安全设置等参数。

```python
from google.genai import types

agent = LlmAgent(
    # ... 其他参数
    generate_content_config=types.GenerateContentConfig(
        temperature=0.2, # 更确定性的输出
        max_output_tokens=250
    )
)
```

### 结构化数据（input_schema, output_schema, output_key）

对于需要结构化数据交换的场景，你可以使用Pydantic模型。

input_schema（可选）：定义一个Pydantic BaseModel类，表示预期的输入结构。如果设置，传递给这个代理的用户消息内容必须是一个符合此模式的JSON字符串。你的指令应该相应地指导用户或前置代理。

output_schema（可选）：定义一个Pydantic BaseModel类，表示期望的输出结构。如果设置，代理的最终响应必须是一个符合此模式的JSON字符串。

约束：使用output_schema可以在LLM中启用受控生成，但会禁用代理使用工具或将控制权转移给其他代理的能力。你的指令必须指导LLM直接生成符合模式的JSON。

output_key（可选）：提供一个字符串键。如果设置，代理最终响应的文本内容将自动保存到会话的状态字典中（例如，session.state[output_key] = agent_response_text）。这对于在代理之间或工作流步骤之间传递结果很有用。

```python
from pydantic import BaseModel, Field

class CapitalOutput(BaseModel):
    capital: str = Field(description="国家的首都。")

structured_capital_agent = LlmAgent(
    # ... name, model, description
    instruction="""你是一个首都信息代理。给定一个国家，仅用包含首都的JSON对象响应。格式：{"capital": "capital_name"}""",
    output_schema=CapitalOutput, # 强制JSON输出
    output_key="found_capital"  # 将结果存储在state['found_capital']中
    # 这里不能有效使用tools=[get_capital_city]
)
```

### 管理上下文（include_contents）

控制代理是否接收先前的对话历史。

include_contents（可选，默认：'default'）：决定是否将内容（历史）发送给LLM。

- 'default'：代理接收相关的对话历史。
- 'none'：代理不接收任何先前的内容。它仅基于其当前指令和当前轮次中提供的任何输入进行操作（适用于无状态任务或强制执行特定上下文）。

```python
stateless_agent = LlmAgent(
    # ... 其他参数
    include_contents='none'
)
```

### 规划和代码执行

对于涉及多个步骤或执行代码的更复杂推理：

planner（可选）：分配一个BasePlanner实例以在执行前启用多步推理和规划。（参见多代理模式）。

code_executor（可选）：提供一个BaseCodeExecutor实例，允许代理执行在LLM响应中找到的代码块（例如，Python）。（参见工具/内置工具）。

## 完整示例

```python
# 完整的首都代理示例代码
# --- 完整示例代码展示带工具的LlmAgent与输出模式 ---
import json # 需要用于美化打印字典

from google.adk.agents import LlmAgent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from pydantic import BaseModel, Field

# --- 1. 定义常量 ---
APP_NAME = "agent_comparison_app"
USER_ID = "test_user_456"
SESSION_ID_TOOL_AGENT = "session_tool_agent_xyz"
SESSION_ID_SCHEMA_AGENT = "session_schema_agent_xyz"
MODEL_NAME = "gemini-2.0-flash"

# --- 2. 定义模式 ---

# 两个代理使用的输入模式
class CountryInput(BaseModel):
    country: str = Field(description="要获取信息的国家。")

# 仅第二个代理使用的输出模式
class CapitalInfoOutput(BaseModel):
    capital: str = Field(description="国家的首都城市。")
    # 注意：人口是示例性的；LLM将推断或估计这个
    # 因为当设置output_schema时不能使用工具
    population_estimate: str = Field(description="首都城市的估计人口。")

# --- 3. 定义工具（仅用于第一个代理） ---
def get_capital_city(country: str) -> str:
    """检索给定国家的首都城市。"""
    print(f"\n-- 工具调用：get_capital_city(country='{country}') --")
    country_capitals = {
        "united states": "Washington, D.C.",
        "canada": "Ottawa",
        "france": "Paris",
        "japan": "Tokyo",
    }
    result = country_capitals.get(country.lower(), f"抱歉，我找不到{country}的首都。")
    print(f"-- 工具结果：'{result}' --")
    return result

# --- 4. 配置代理 ---

# 代理1：使用工具和output_key
capital_agent_with_tool = LlmAgent(
    model=MODEL_NAME,
    name="capital_agent_tool",
    description="使用特定工具检索首都城市。",
    instruction="""你是一个使用工具提供国家首都的助手代理。
用户将以JSON格式提供国家名称，如{"country": "country_name"}。
1. 提取国家名称。
2. 使用`get_capital_city`工具查找首都。
3. 清晰地回应用户，说明工具找到的首都城市。
""",
    tools=[get_capital_city],
    input_schema=CountryInput,
    output_key="capital_tool_result", # 存储最终文本响应
)

# 代理2：使用output_schema（不能使用工具）
structured_info_agent_schema = LlmAgent(
    model=MODEL_NAME,
    name="structured_info_agent_schema",
    description="以特定JSON格式提供首都和估计人口。",
    instruction=f"""你是一个提供国家信息的代理。
用户将以JSON格式提供国家名称，如{{"country": "country_name"}}。
仅用符合此确切模式的JSON对象响应：
{json.dumps(CapitalInfoOutput.model_json_schema(), indent=2)}
使用你的知识确定首都和估计人口。不要使用任何工具。
""",
    # *** 这里没有tools参数 - 使用output_schema会阻止工具使用 ***
    input_schema=CountryInput,
    output_schema=CapitalInfoOutput, # 强制JSON输出结构
    output_key="structured_info_result", # 存储最终JSON响应
)

# --- 5. 设置会话管理和运行器 ---
session_service = InMemorySessionService()

# 为清晰起见创建单独的会话，虽然如果上下文得到管理，这不是严格必要的
session_service.create_session(app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID_TOOL_AGENT)
session_service.create_session(app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID_SCHEMA_AGENT)

# 为每个代理创建一个运行器
capital_runner = Runner(
    agent=capital_agent_with_tool,
    app_name=APP_NAME,
    session_service=session_service
)
structured_runner = Runner(
    agent=structured_info_agent_schema,
    app_name=APP_NAME,
    session_service=session_service
)

# --- 6. 定义代理交互逻辑 ---
async def call_agent_and_print(
    runner_instance: Runner,
    agent_instance: LlmAgent,
    session_id: str,
    query_json: str
):
    """向指定的代理/运行器发送查询并打印结果。"""
    print(f"\n>>> 调用代理：'{agent_instance.name}' | 查询：{query_json}")

    user_content = types.Content(role='user', parts=[types.Part(text=query_json)])

    final_response_content = "未收到最终响应。"
    async for event in runner_instance.run_async(user_id=USER_ID, session_id=session_id, new_message=user_content):
        # print(f"事件：{event.type}, 作者：{event.author}") # 取消注释以获取详细日志
        if event.is_final_response() and event.content and event.content.parts:
            # 对于output_schema，内容是JSON字符串本身
            final_response_content = event.content.parts[0].text

    print(f"<<< 代理'{agent_instance.name}'响应：{final_response_content}")

    current_session = session_service.get_session(app_name=APP_NAME,
                                                  user_id=USER_ID,
                                                  session_id=session_id)
    stored_output = current_session.state.get(agent_instance.output_key)

    # 如果存储的输出看起来像JSON（可能来自output_schema），则美化打印
    print(f"--- 会话状态['{agent_instance.output_key}']：", end="")
    try:
        # 尝试解析并美化打印如果是JSON
        parsed_output = json.loads(stored_output)
        print(json.dumps(parsed_output, indent=2))
    except (json.JSONDecodeError, TypeError):
         # 否则，作为字符串打印
        print(stored_output)
    print("-" * 30)


# --- 7. 运行交互 ---
async def main():
    print("--- 测试带工具的代理 ---")
    await call_agent_and_print(capital_runner, capital_agent_with_tool, SESSION_ID_TOOL_AGENT, '{"country": "France"}')
    await call_agent_and_print(capital_runner, capital_agent_with_tool, SESSION_ID_TOOL_AGENT, '{"country": "Canada"}')

    print("\n\n--- 测试带输出模式的代理（不使用工具） ---")
    await call_agent_and_print(structured_runner, structured_info_agent_schema, SESSION_ID_SCHEMA_AGENT, '{"country": "France"}')
    await call_agent_and_print(structured_runner, structured_info_agent_schema, SESSION_ID_SCHEMA_AGENT, '{"country": "Japan"}')

if __name__ == "__main__":
    await main()
```

（这个示例展示了核心概念。更复杂的代理可能包含模式、上下文控制、规划等。）

## 相关概念（延迟主题）

虽然本页涵盖了LlmAgent的核心配置，但几个相关概念提供了更高级的控制，并在其他地方详细说明：

回调：使用before_model_callback、after_model_callback等拦截执行点（模型调用前/后，工具调用前/后）。参见回调。

多代理控制：代理交互的高级策略，包括规划（planner）、控制代理转移（disallow_transfer_to_parent、disallow_transfer_to_peers）和系统范围的指令（global_instruction）。参见多代理。 