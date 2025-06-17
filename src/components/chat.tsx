"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Send, MessageCircle } from "lucide-react";
import { Tables } from "@/types/supabase";

type Message = Tables<"messages"> & {
  sender: Tables<"users"> | null;
};

type ChatRoom = Tables<"chat_rooms">;

interface ChatProps {
  tripId: string;
  currentUserId: string;
  isParticipant: boolean;
}

export default function Chat({
  tripId,
  currentUserId,
  isParticipant,
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isParticipant) return;

    const fetchChatRoom = async () => {
      try {
        // Check if chat room exists for this trip
        const { data: existingRoom } = await supabase
          .from("chat_rooms")
          .select("*")
          .eq("trip_id", tripId)
          .single();

        if (existingRoom) {
          setChatRoom(existingRoom);
          await loadMessages(existingRoom.id);
        }
      } catch (error) {
        console.error("Error fetching chat room:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatRoom();
  }, [tripId, isParticipant]);

  const loadMessages = async (chatRoomId: string) => {
    try {
      const { data: messagesData, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          sender:users(*)
        `,
        )
        .eq("chat_room_id", chatRoomId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages((messagesData as Message[]) || []);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  useEffect(() => {
    if (!chatRoom || !isParticipant) return;

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat-room-${chatRoom.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_room_id=eq.${chatRoom.id}`,
        },
        async (payload) => {
          // Fetch the complete message with sender info
          const { data: newMessage } = await supabase
            .from("messages")
            .select(
              `
              *,
              sender:users(*)
            `,
            )
            .eq("id", payload.new.id)
            .single();

          if (newMessage) {
            setMessages((prev) => [...prev, newMessage as Message]);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatRoom, isParticipant]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatRoom || isSending) return;

    setIsSending(true);
    try {
      const { error } = await supabase.from("messages").insert({
        chat_room_id: chatRoom.id,
        sender_id: currentUserId,
        content: newMessage.trim(),
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (!isParticipant) {
    return (
      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Trip Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Chat is available once you're approved for this trip
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Trip Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading chat...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!chatRoom) {
    return (
      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Trip Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Chat room will be created once participants are approved
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Trip Chat
          <Badge variant="secondary" className="ml-auto">
            {messages.length} messages
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Messages Container */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => {
                const showDateSeparator =
                  index === 0 ||
                  formatDate(message.created_at || "") !==
                    formatDate(messages[index - 1].created_at || "");
                const isCurrentUser = message.sender_id === currentUserId;

                return (
                  <div key={message.id}>
                    {showDateSeparator && (
                      <div className="flex items-center gap-4 my-4">
                        <Separator className="flex-1" />
                        <Badge variant="outline" className="text-xs">
                          {formatDate(message.created_at || "")}
                        </Badge>
                        <Separator className="flex-1" />
                      </div>
                    )}
                    <div
                      className={`flex gap-3 ${
                        isCurrentUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isCurrentUser && (
                        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground text-sm font-medium flex-shrink-0">
                          {(message.sender?.full_name ||
                            message.sender?.name ||
                            "U")[0].toUpperCase()}
                        </div>
                      )}
                      <div
                        className={`max-w-[70%] ${
                          isCurrentUser ? "order-first" : ""
                        }`}
                      >
                        <div
                          className={`rounded-lg px-3 py-2 ${
                            isCurrentUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {!isCurrentUser && (
                            <p className="text-xs font-medium mb-1">
                              {message.sender?.full_name ||
                                message.sender?.name ||
                                "Unknown"}
                            </p>
                          )}
                          <p className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                        <p
                          className={`text-xs text-muted-foreground mt-1 ${
                            isCurrentUser ? "text-right" : "text-left"
                          }`}
                        >
                          {formatTime(message.created_at || "")}
                        </p>
                      </div>
                      {isCurrentUser && (
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium flex-shrink-0">
                          {(message.sender?.full_name ||
                            message.sender?.name ||
                            "U")[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <Separator />

        {/* Message Input */}
        <form onSubmit={sendMessage} className="p-4">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isSending}
              className="flex-1"
              maxLength={1000}
            />
            <Button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
