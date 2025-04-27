
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import { 
  collection, 
  doc, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile, Message, Conversation } from "@/types";

const Messages = () => {
  const { recipientId } = useParams<{ recipientId: string }>();
  const { currentUser, userProfile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [recipient, setRecipient] = useState<UserProfile | null>(null);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    // Fetch user's conversations
    const fetchConversations = async () => {
      try {
        const q = query(
          collection(db, "conversations"),
          where("participants", "array-contains", currentUser.uid),
          orderBy("lastMessageDate", "desc")
        );
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const conversationsData: Conversation[] = [];
          snapshot.forEach((doc) => {
            conversationsData.push({ id: doc.id, ...doc.data() } as Conversation);
          });
          setConversations(conversationsData);
          setLoading(false);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching conversations:", error);
        toast({
          title: "Error",
          description: "Failed to load conversations",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    const unsubscribe = fetchConversations();
    return () => {
      unsubscribe?.then(unsub => unsub());
    };
  }, [currentUser, navigate, toast]);

  useEffect(() => {
    if (!recipientId || !currentUser) return;
    
    const fetchRecipient = async () => {
      try {
        const recipientRef = doc(db, "users", recipientId);
        const recipientSnap = await getDoc(recipientRef);
        
        if (!recipientSnap.exists()) {
          toast({
            title: "Error",
            description: "User not found",
            variant: "destructive",
          });
          return;
        }
        
        setRecipient(recipientSnap.data() as UserProfile);
        
        // Check if conversation exists
        const conversationId = [currentUser.uid, recipientId].sort().join('_');
        
        const messagesQuery = query(
          collection(db, "messages"),
          where("conversationId", "==", conversationId),
          orderBy("createdAt", "asc"),
          limit(50)
        );
        
        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
          const messagesData: Message[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            messagesData.push({
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate() || new Date()
            } as Message);
          });
          
          setMessages(messagesData);
          
          // Scroll to bottom after messages load
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching recipient:", error);
        toast({
          title: "Error",
          description: "Failed to load conversation",
          variant: "destructive",
        });
      }
    };
    
    const unsubscribe = fetchRecipient();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [recipientId, currentUser, toast]);

  const sendMessage = async () => {
    if (!messageText.trim() || !currentUser || !recipient) return;
    
    try {
      const conversationId = [currentUser.uid, recipient.uid].sort().join('_');
      
      // Create message
      await addDoc(collection(db, "messages"), {
        conversationId,
        content: messageText,
        senderId: currentUser.uid,
        senderName: userProfile?.displayName || userProfile?.username || "User",
        senderPhoto: userProfile?.photoURL,
        recipientId: recipient.uid,
        read: false,
        createdAt: serverTimestamp(),
        attachments: []
      });
      
      // Update or create conversation document
      const conversationRef = doc(db, "conversations", conversationId);
      const conversationSnap = await getDoc(conversationRef);
      
      if (conversationSnap.exists()) {
        await conversationSnap.ref.update({
          lastMessage: messageText,
          lastMessageDate: serverTimestamp(),
          participants: [currentUser.uid, recipient.uid]
        });
      } else {
        await conversationRef.set({
          id: conversationId,
          participants: [currentUser.uid, recipient.uid],
          lastMessage: messageText,
          lastMessageDate: serverTimestamp(),
          unreadCount: 1
        });
      }
      
      // Clear input
      setMessageText("");
      
      // Scroll to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const selectConversation = (conversation: Conversation) => {
    const otherUserId = conversation.participants.find(id => id !== currentUser?.uid);
    if (otherUserId) {
      navigate(`/messages/${otherUserId}`);
    }
  };

  return (
    <div className="container max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg p-4 md:col-span-1">
          <h2 className="font-medium mb-4">Conversations</h2>
          
          <div className="space-y-2">
            {loading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <div className="w-10 h-10 bg-muted rounded-full"></div>
                    <div className="space-y-1 flex-1">
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length > 0 ? (
              conversations.map((conversation) => {
                const otherUserId = conversation.participants.find(id => id !== currentUser?.uid);
                const isActive = otherUserId === recipientId;
                
                return (
                  <div 
                    key={conversation.id} 
                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}`}
                    onClick={() => selectConversation(conversation)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>??</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">User</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No conversations yet</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-card rounded-lg md:col-span-2 flex flex-col h-[600px]">
          {recipient ? (
            <>
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={recipient.photoURL || undefined} />
                    <AvatarFallback>{getInitials(recipient.displayName || recipient.username)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{recipient.displayName || recipient.username || "User"}</p>
                    <p className="text-xs text-muted-foreground">
                      {recipient.role === "freelancer" ? "Animator" : "Client"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length > 0 ? (
                  messages.map((message) => {
                    const isOwnMessage = message.senderId === currentUser?.uid;
                    
                    return (
                      <div 
                        key={message.id} 
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-2 max-w-[80%] ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                          {!isOwnMessage && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={message.senderPhoto || undefined} />
                              <AvatarFallback>{getInitials(message.senderName)}</AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div>
                            <div 
                              className={`rounded-lg px-4 py-2 ${
                                isOwnMessage 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted text-foreground'
                              }`}
                            >
                              <p>{message.content}</p>
                            </div>
                            <p className={`text-xs text-muted-foreground mt-1 ${isOwnMessage ? 'text-right' : ''}`}>
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No messages yet. Send a message to start the conversation.</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 border-t border-border">
                <form 
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                >
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-muted-foreground">Select a conversation or start a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
