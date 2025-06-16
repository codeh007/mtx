<<<<<<< HEAD
import * as React from "react"

import { cn } from "@mtmaiui/lib/utils"
=======

import { cn } from "../lib/utils"
>>>>>>> temp-branch

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
<<<<<<< HEAD
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
=======
        "bg-card text-card-foreground rounded-xl border shadow-sm",
>>>>>>> temp-branch
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
<<<<<<< HEAD
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
=======
      className={cn("flex flex-col gap-1.5 p-6", className)}
>>>>>>> temp-branch
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
<<<<<<< HEAD
      className={cn("leading-none font-semibold", className)}
=======
      className={cn("leading-none font-semibold tracking-tight", className)}
>>>>>>> temp-branch
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

<<<<<<< HEAD
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

=======
>>>>>>> temp-branch
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
<<<<<<< HEAD
      className={cn("px-6", className)}
=======
      className={cn("p-6 pt-0", className)}
>>>>>>> temp-branch
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
<<<<<<< HEAD
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
=======
      className={cn("flex items-center p-6 pt-0", className)}
>>>>>>> temp-branch
      {...props}
    />
  )
}

<<<<<<< HEAD
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
=======
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
>>>>>>> temp-branch
