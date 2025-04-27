
export type UserRole = "freelancer" | "client" | null;

export interface UserProfile {
  uid: string;
  username: string | null;
  role: UserRole;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  bio: string | null;
  skills: string[];
  portfolio: string[];
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  clientId: string;
  clientName: string;
  clientPhoto: string | null;
  status: "open" | "in-progress" | "completed" | "canceled";
  category: string[];
  requirements: string;
  deadline: Date | null;
  createdAt: Date;
  applicants?: string[];
  hiredFreelancer?: string | null;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderPhoto: string | null;
  recipientId: string;
  content: string;
  attachments: string[];
  read: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageDate: Date;
  unreadCount: number;
}
