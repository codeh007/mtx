'use client'

import { useRouter } from "next/navigation"
import { Button } from "../ui/button"

export const NotFoundGoBack = () => {
  const router = useRouter()
  return (<div className="container flex flex-col">
    <div className="mx-auto p-8">
      not found
    </div>

    <Button
      className="mx-auto p-8"
      onClick={() => {
        router.back()
      }}>Go back</Button>
  </div>)
}
