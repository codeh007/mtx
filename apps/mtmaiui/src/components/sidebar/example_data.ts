import { ArchiveX, Clock, Inbox, Send } from "lucide-react";

export const example_data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Runs",
      url: "/workflow-runs",
      icon: Inbox,
      isActive: true,
    },
    {
      title: "Components",
      url: "/coms",
      icon: Send,
      isActive: false,
    },
    {
      title: "workflows",
      url: "/workflows",
      icon: ArchiveX,
      isActive: false,
    },
    {
      title: "recurring",
      url: "/recurring",
      icon: Clock,
      isActive: false,
    },
    {
      title: "scheduled",
      url: "/scheduled-runs",
      icon: Clock,
      isActive: false,
    },
  ],
  mails: [
    {
      name: "William Smith",
      email: "williamsmith@example.com",
      subject: "Meeting Tomorrow",
      date: "09:34 AM",
      teaser:
        "Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.",
    },
    {
      name: "Alice Smith",
      email: "alicesmith@example.com",
      subject: "Re: Project Update",
      date: "Yesterday",
      teaser:
        "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
    },
  ],
};
