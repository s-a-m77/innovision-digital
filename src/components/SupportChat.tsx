import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Sparkles } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

const STORAGE_KEY = "nexora-support-chat-v1";

function loadMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : [];
  } catch {
    return [];
  }
}

export function SupportChat() {
  const [open, setOpen] = useState(false);
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setInitialMessages(loadMessages());
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <button
        type="button"
        aria-label="Open support chat"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow transition-smooth hover:scale-105"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <ChatWidget open={open} setOpen={setOpen} initialMessages={initialMessages} />
  );
}

function ChatWidget({
  open,
  setOpen,
  initialMessages,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
  initialMessages: UIMessage[];
}) {
  const transportRef = useRef(new DefaultChatTransport({ api: "/api/chat" }));
  const { messages, sendMessage, status, setMessages } = useChat({
    id: "nexora-support",
    messages: initialMessages,
    transport: transportRef.current,
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore quota errors
    }
  }, [messages]);

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = (message: PromptInputMessage) => {
    const text = message.text?.trim();
    if (!text || isLoading) return;
    sendMessage({ text });
  };

  const handleReset = () => {
    setMessages([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        aria-label={open ? "Close support chat" : "Open support chat"}
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow transition-smooth hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[70vh] max-h-[600px] w-[calc(100vw-2.5rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-border bg-gradient-hero px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur">
                <span className="font-bold text-primary-glow" style={{ fontFamily: "Orbitron, sans-serif" }}>
                  N
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold">Nexora Support</div>
                <div className="flex items-center gap-1.5 text-xs text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Online · replies in seconds
                </div>
              </div>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-white/70 hover:text-white transition-smooth"
              >
                Reset
              </button>
            )}
          </header>

          {/* Conversation */}
          <Conversation className="flex-1 bg-background">
            <ConversationContent className="px-3 py-4">
              {messages.length === 0 ? (
                <ConversationEmptyState
                  icon={<Sparkles className="h-6 w-6 text-primary" />}
                  title="Hi there 👋"
                  description="Ask me about Nexora's services, process, or how we can help your project."
                />
              ) : (
                messages.map((m) => (
                  <Message from={m.role} key={m.id}>
                    <MessageContent variant={m.role === "user" ? "contained" : "flat"}>
                      {m.parts.map((part, i) => {
                        if (part.type === "text") {
                          return m.role === "assistant" ? (
                            <MessageResponse key={i}>{part.text}</MessageResponse>
                          ) : (
                            <span key={i}>{part.text}</span>
                          );
                        }
                        return null;
                      })}
                    </MessageContent>
                  </Message>
                ))
              )}
              {status === "submitted" && (
                <div className="px-2 py-2">
                  <Shimmer>Thinking…</Shimmer>
                </div>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          {/* Composer */}
          <div className="border-t border-border bg-card p-3">
            <PromptInput onSubmit={handleSubmit}>
              <PromptInputTextarea placeholder="Ask about services, pricing, timelines…" />
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit status={status} disabled={isLoading} />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      )}
    </>
  );
}
