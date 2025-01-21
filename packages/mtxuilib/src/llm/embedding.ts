import { HfInference } from '@huggingface/inference';

const hf = new HfInference('your access token')
/**
 * 用原始的 fetch 方式调用 huggingface 上的embedding 模型
 *
 * 相关参考： 参考文档： https://github.com/huggingface/text-embeddings-inference
 * 常用模型参考：
 *  jinaai/jina-embeddings-v2-base-zh //维度 768
 *  mixedbread-ai/mxbai-embed-large-v1 //维度1024
 *  @cf/baai/bge-large-en-v1.5 //
 * infgrad/stella-large-zh-v2
 */

export const callHfEmbeddingInference = async (
  modelName: string,
  inputs: string[],
): Promise<number[][]> => {
  const model = modelName || "mixedbread-ai/mxbai-embed-large-v1";
  // FIXME: 首次访问会出错，因为huggingface 会在首次调用时处于 loading model状态，大概10秒后再请求，就正常。
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${model}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACEHUB_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",

      body: JSON.stringify({
        model: modelName,
        embedding_type: "float",
        inputs: inputs,
      }),
    },
  );
  return (await response.json()) as number[][];
};

/**
 * 将 number[][] embedding 格式，转换为OpenAIEmbedding 响应格式。
 * @param embeddinds
 * @param modelName
 * @returns
 */
export const convertToOpenAIEmbeddingResponse = (
  embeddinds: number[][],
  modelName?: string,
) => {
  return {
    object: "list",
    model: modelName,
    data: embeddinds.map((x, i) => {
      return {
        object: "embedding",
        index: i,
        embedding: x,
      };
    }),
    usage: {
      prompt_tokens: 0,
      total_tokens: 0,
    },
  };
};

export interface EmbeddingReq {
  inputs: string[];
}
export const embeddingDefault = async (req: EmbeddingReq) => {
  try {
    const result = await callHfEmbeddingInference("", req.inputs);
    return result;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (e: any) {
    return {
      error: e.toString(),
    };
  }
};
