"use client";

import * as React from "react";
import { MessageSquare, Send, X, Bot, User, Loader2 } from "lucide-react";
import { getOrCreateConversation, getChatMessages, sendChatMessage } from "@/app/actions/catalog-chat";

interface Message {
  id: string;
  senderType: "CLIENT" | "AGENT" | "SYSTEM";
  senderName: string;
  text: string;
  type: string;
  isRead: boolean;
  time: string;
  timestamp: string | null;
}

interface SupportChatProps {
  tenantCode: string | null;
  clientName?: string;
  clientId?: string;
  agentName?: string;
  agentTitle?: string;
}

export function SupportChat({ tenantCode, clientName = "Cliente", clientId, agentName = "Ing. Carlos Mendoza (Soporte Técnico)", agentTitle = "Director de Ingeniería" }: SupportChatProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [conversationId, setConversationId] = React.useState<string | null>(null);
  const [unread, setUnread] = React.useState(0);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Load conversation on first open
  React.useEffect(() => {
    if (isOpen && !conversationId) {
      loadConversation();
    }
  }, [isOpen, conversationId, tenantCode, clientId]);

  // Scroll to bottom on new messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversation = async () => {
    setLoading(true);
    try {
      const conv = await getOrCreateConversation(tenantCode, clientId);
      setConversationId(conv.id);
      const msgs = await getChatMessages(conv.id, tenantCode);
      setMessages(msgs as Message[]);
      setUnread(0);
    } catch (err) {
      console.error("Error loading chat:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const text = newMessage.trim();
    if (!text || sending || !conversationId) return;
    setSending(true);
    setNewMessage("");

    // Optimistic UI: add user message immediately
    const userMsg: Message = {
      id: `temp-${Date.now()}`,
      senderType: "CLIENT",
      senderName: clientName,
      text,
      type: "TEXT",
      isRead: false,
      time: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      // Send message - agent response is generated server-side
      const sent = await sendChatMessage(tenantCode, conversationId, "CLIENT", clientName, text);
      setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, id: (sent as Record<string, unknown>).id as string } : m));

      // Reload to get agent response
      const msgs = await getChatMessages(conversationId, tenantCode);
      setMessages(msgs as Message[]);
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
        style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
      >
        {isOpen ? (
          <><X className="w-4 h-4" /> Cerrar</>
        ) : (
          <><MessageSquare className="w-4 h-4" /> {unread > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unread}</span>} Soporte Técnico</>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col" style={{ height: "540px" }}>
          {/* Header */}
          <div className="px-4 py-3 border-b border-border bg-accent/30 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{agentName}</p>
              <p className="text-[10px] text-muted-foreground">{agentTitle}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="w-10 h-10 text-muted-foreground/20 mb-3" />
                <p className="text-xs text-muted-foreground">Inicia una conversación con nuestro equipo de soporte técnico.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.senderType === "CLIENT" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.senderType === "CLIENT"
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-accent border border-border"
                  }`}>
                    {msg.senderType === "CLIENT"
                      ? <User className="w-3.5 h-3.5 text-primary" />
                      : <Bot className="w-3.5 h-3.5 text-muted-foreground" />
                    }
                  </div>
                  <div className={`max-w-[75%] ${msg.senderType === "CLIENT" ? "text-right" : ""}`}>
                    <div className={`inline-block rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.senderType === "CLIENT"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-accent text-foreground rounded-tl-none"
                    }`}>
                      {msg.text}
                    </div>
                    <p className={`text-[9px] text-muted-foreground/60 mt-1 ${msg.senderType === "CLIENT" ? "text-right" : ""}`}>{msg.time}</p>
                  </div>
                </div>
              ))
            )}

            {sending && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none px-3.5 py-2.5 text-xs">
                  {newMessage}
                  <span className="inline-block w-1.5 h-3 bg-primary-foreground/60 rounded-sm ml-0.5 animate-pulse" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-border bg-card">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe tu consulta..."
                disabled={sending || loading}
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending || loading}
                className="w-9 h-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[8px] text-muted-foreground/40 mt-1.5 text-center font-mono">Entregas · Facturación · Archivos CAD · Pruebas · Garantías · Cotizaciones</p>
          </div>
        </div>
      )}
    </>
  );
}