"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import MessageBubble, { Message } from "./MessageBubble";

type GeminiPart = { text: string };
type GeminiHistoryItem = { role: "user" | "model"; parts: GeminiPart[] };

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4 gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
        <svg
          className="w-4 h-4 text-blue-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      </div>
      <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-5">
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16">
      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
        <svg
          className="w-9 h-9 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 14l9-5-9-5-9 5 9 5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">
        Welcome to Study Abroad Assistant
      </h2>
      <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
        Ask me anything about studying abroad — universities, scholarships,
        applications, visas, and more. I specialise in Germany, UK, Canada,
        Australia, and USA.
      </p>
      <p className="text-slate-400 text-xs mt-4">
        Select a question from the sidebar or type your own below.
      </p>
    </div>
  );
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const buildGeminiHistory = (msgs: Message[]): GeminiHistoryItem[] => {
    return msgs.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));
  };

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);
      setError(null);

      const history = buildGeminiHistory(messages);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, history }),
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || "Failed to get a response.");
        }

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Something went wrong.";
        setError(msg);
      } finally {
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [isLoading, messages]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
    setInput("");
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar — always visible on lg, drawer on mobile */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-30 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar
          onSelectQuestion={(q) => {
            setIsSidebarOpen(false);
            sendMessage(q);
          }}
          onClearChat={handleClearChat}
          messageCount={messages.length}
        />
      </div>

      {/* Main chat area */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        {/* Top bar */}
        <header className="flex-shrink-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <button
            className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Study Abroad Assistant
            </h2>
            <p className="text-xs text-slate-400">Powered by OpenRouter</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-xs text-slate-400">Online</span>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 && !isLoading ? (
            <WelcomeScreen />
          ) : (
            <div className="max-w-3xl mx-auto">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {isLoading && <TypingIndicator />}
              {error && (
                <div className="flex justify-center mb-4">
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm max-w-md">
                    <span className="font-medium">Error: </span>
                    {error}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="flex-shrink-0 bg-white border-t border-slate-200 px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 items-end bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask about universities, scholarships, visas..."
                disabled={isLoading}
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 resize-none outline-none leading-relaxed max-h-32 disabled:opacity-60"
                style={{ height: "24px" }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={isLoading || !input.trim()}
                className="flex-shrink-0 w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl flex items-center justify-center transition-colors duration-150"
                aria-label="Send message"
              >
                {isLoading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-center text-xs text-slate-400 mt-2">
              Press <kbd className="bg-slate-100 px-1 rounded">Enter</kbd> to send,{" "}
              <kbd className="bg-slate-100 px-1 rounded">Shift+Enter</kbd> for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
