'use client'
import { createLazyFileRoute } from '@tanstack/react-router'
import { agentRun } from 'mtmaiapi'
import { Button } from 'mtxuilib/ui/button'
import type { ChatCompletion } from 'openai/resources/chat/completions'
import { useState } from 'react'
import { useTenant } from '../../hooks/useAuth'

export const Route = createLazyFileRoute('/endpoint/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4">
      <TestApiGateway />
      <TestCompletion />
      <TestAgentRun />
    </div>
  )
}

const getApiGatewayUrl = () => {
  return '/api/mtm/space'
}

const getCompletionUrl = () => {
  return '/api/chat/completions'
}

const TestApiGateway = () => {
  const [responseText, setResponseText] = useState('')
  const handleClick = async () => {
    const response = await fetch(getApiGatewayUrl())
    const data = await response.text()
    setResponseText(data)
  }
  return (
    <div>
      <Button onClick={handleClick}>TestApiGateway</Button>
      <div>{responseText}</div>
    </div>
  )
}

const TestCompletion = () => {
  const [responseText, setResponseText] = useState('')
  const handleClick = async () => {
    const response = await fetch(getCompletionUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.1-70b',
        messages: [
          {
            role: 'user',
            content: '你好,用中文写一个很好笑的长篇小说,用markdown格式',
          },
        ],
        temperature: 0.7,
        max_tokens: 8000,
        stream: true,
      }),
    })
    const data = (await response.json()) as ChatCompletion
    setResponseText(
      data.choices?.[0]?.message?.content || JSON.stringify(data, null, 2),
    )
  }
  return (
    <div>
      <Button onClick={handleClick}>TestCompletion</Button>
      <div>{responseText}</div>
    </div>
  )
}

const TestAgentRun = () => {
  const [responseText, setResponseText] = useState('')
  const tenant = useTenant()
  const handleClick = async () => {
    const response = await agentRun({
      path: {
        tenant: tenant!.metadata.id,
      },
      body: {},
    })
    setResponseText(JSON.stringify(response.data))
  }
  return (
    <div>
      <Button onClick={handleClick}>TestAgentRun</Button>
      <div>{responseText}</div>
    </div>
  )
}
