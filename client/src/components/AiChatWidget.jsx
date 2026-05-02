import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bot,
  Loader,
  Maximize2,
  MessageCircle,
  Minimize2,
  Send,
  X,
} from "lucide-react";
import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import PropertyCard from "./property/PropertyCard";
import { MemoizedMarkdown } from "./memoized-markdown";

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5173";

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: `${apiBaseUrl}/api/ai/chat`,
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });

  // Auto-scroll to bottom whenever messages change or status changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  // Also scroll when widget opens (if there are messages)
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
      }, 50);
    }
  }, [isOpen]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    if (status === "streaming") stop();
    sendMessage({ text });
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
  };

  const formatSearchMeta = (search) => {
    if (!search) return null;
    const items = [];
    if (search.query) items.push(`"${search.query}"`);
    if (search.city) items.push(search.city);
    if (search.purpose) items.push(search.purpose);
    if (search.type) items.push(search.type);
    if (search.priceMin != null)
      items.push(`from NPR ${Number(search.priceMin).toLocaleString()}`);
    if (search.priceMax != null)
      items.push(`up to NPR ${Number(search.priceMax).toLocaleString()}`);
    if (search.bedrooms != null) items.push(`${search.bedrooms} bed`);
    if (search.bathrooms != null) items.push(`${search.bathrooms} bath`);
    return items.length ? items.join(" · ") : null;
  };

  const isStreaming = status === "submitted" || status === "streaming";

  return (
    <div className="fixed bottom-5 right-5 z-[1200]">
      {isOpen ? (
        <div
          className={`flex flex-col rounded-2xl border overflow-hidden transition-all duration-200
            bg-white border-neutral-200
            dark:bg-neutral-900 dark:border-neutral-700/60
            ${isMaximized ? "w-[90vw] max-w-[48rem] h-[82vh]" : "w-[30rem] h-[34rem]"}`}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b
              bg-white border-neutral-100
              dark:bg-neutral-900 dark:border-neutral-700/60"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center
                  bg-primary/10 dark:bg-neutral-800"
              >
                <Bot size={15} className="text-primary" />
              </div>
              <p
                className="text-sm font-semibold leading-tight
                  text-neutral-800 dark:text-neutral-100"
              >
                AI chat
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsMaximized((prev) => !prev)}
                className="p-1.5 rounded-lg transition-colors
                  text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100
                  dark:text-neutral-500 dark:hover:text-neutral-200 dark:hover:bg-neutral-800"
                title={isMaximized ? "Minimize" : "Maximize"}
              >
                {isMaximized ? (
                  <Minimize2 size={15} />
                ) : (
                  <Maximize2 size={15} />
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsMaximized(false);
                }}
                className="p-1.5 rounded-lg transition-colors
                  text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100
                  dark:text-neutral-500 dark:hover:text-neutral-200 dark:hover:bg-neutral-800"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth
              bg-neutral-50 dark:bg-neutral-950"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-3 px-4">
                <div>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    How can I help you today?
                  </p>
                  <p className="text-xs mt-1 text-neutral-400 dark:text-neutral-500">
                    Ask about properties or brokers.
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full mt-1">
                  {[
                    "Find verified brokers in Kathmandu",
                    "3-bedroom houses under 2 crore in Lalitpur",
                    "Apartments for rent in Pokhara",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => sendMessage({ text: suggestion })}
                      className="cursor-pointer text-left text-xs px-3 py-2 rounded-lg border transition-colors
                        border-neutral-200 bg-white text-neutral-600 hover:border-primary/40 hover:bg-primary/5
                        dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300
                        dark:hover:border-primary/50 dark:hover:bg-neutral-700"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="space-y-1.5">
                  <p
                    className={`text-[10px] font-semibold uppercase tracking-widest ${
                      message.role === "user"
                        ? "text-right text-primary/70 dark:text-primary/60"
                        : "text-neutral-400 dark:text-neutral-600"
                    }`}
                  >
                    {message.role === "user" ? "You" : "Assistant"}
                  </p>

                  <div
                    className={`space-y-2 ${message.role === "user" ? "flex flex-col items-end" : ""}`}
                  >
                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        return (
                          <div
                            key={`${message.id}-text`}
                            className={`text-sm leading-relaxed ${
                              message.role === "user"
                                ? "bg-primary text-white rounded-2xl rounded-tr-sm px-3.5 py-2.5 max-w-[85%] inline-block text-left"
                                : "text-neutral-700 dark:text-neutral-300"
                            }`}
                          >
                            {message.role === "user" ? (
                              <p>{part.text}</p>
                            ) : (
                              <MemoizedMarkdown
                                id={message.id}
                                content={part.text}
                              />
                            )}
                          </div>
                        );
                      }

                      if (part.type === "tool-searchBrokers") {
                        if (part.state === "output-available") {
                          const brokersOutput = part.output?.brokers || [];
                          const meta = formatSearchMeta(part.output?.search);
                          return (
                            <div
                              key={part.toolCallId}
                              className="rounded-xl border p-3
                                bg-white border-neutral-200
                                dark:bg-neutral-800 dark:border-neutral-700/60"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <p
                                  className="text-[10px] font-bold uppercase tracking-widest
                                    text-neutral-400 dark:text-neutral-500"
                                >
                                  Brokers
                                </p>
                                {brokersOutput.length > 0 && (
                                  <span className="text-[10px] text-neutral-400 dark:text-neutral-600">
                                    {brokersOutput.length} found
                                  </span>
                                )}
                              </div>
                              {meta && (
                                <p className="text-xs mb-2 text-neutral-500 dark:text-neutral-500">
                                  {meta}
                                </p>
                              )}
                              {brokersOutput.length === 0 ? (
                                <p className="text-sm text-neutral-500 dark:text-neutral-500">
                                  No brokers found.
                                </p>
                              ) : (
                                <div className="space-y-2">
                                  {brokersOutput.map((broker) => (
                                    <div
                                      key={broker.id}
                                      className="flex items-center justify-between py-1.5 border-b last:border-0
                                        border-neutral-100 dark:border-neutral-700/60"
                                    >
                                      <div>
                                        <p
                                          className="text-sm font-semibold
                                            text-neutral-800 dark:text-neutral-100"
                                        >
                                          {broker.name}
                                        </p>
                                        <p className="text-xs text-neutral-400 dark:text-neutral-500">
                                          {broker.company || "Independent"} ·{" "}
                                          {broker.city || "N/A"}
                                        </p>
                                      </div>
                                      <Link
                                        to={broker.profileUrl}
                                        className="text-xs text-primary font-medium hover:underline"
                                      >
                                        View
                                      </Link>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        }
                        if (part.state === "output-error") {
                          return (
                            <p
                              key={part.toolCallId}
                              className="text-sm text-red-500"
                            >
                              {part.errorText || "Unable to fetch brokers."}
                            </p>
                          );
                        }
                        return (
                          <div
                            key={part.toolCallId}
                            className="flex items-center gap-2 text-xs
                              text-neutral-400 dark:text-neutral-500"
                          >
                            <Loader size={12} className="animate-spin" />
                            Searching brokers…
                          </div>
                        );
                      }

                      if (part.type === "tool-searchProperties") {
                        if (part.state === "output-available") {
                          const propertiesOutput =
                            part.output?.properties || [];
                          const meta = formatSearchMeta(part.output?.search);
                          return (
                            <div
                              key={part.toolCallId}
                              className="rounded-xl border p-3
                                bg-white border-neutral-200
                                dark:bg-neutral-800 dark:border-neutral-700/60"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <p
                                  className="text-[10px] font-bold uppercase tracking-widest
                                    text-neutral-400 dark:text-neutral-500"
                                >
                                  Properties
                                </p>
                                {propertiesOutput.length > 0 && (
                                  <span className="text-[10px] text-neutral-400 dark:text-neutral-600">
                                    {propertiesOutput.length} found
                                  </span>
                                )}
                              </div>
                              {meta && (
                                <p className="text-xs mb-2 text-neutral-500 dark:text-neutral-500">
                                  {meta}
                                </p>
                              )}
                              {propertiesOutput.length === 0 ? (
                                <p className="text-sm text-neutral-500 dark:text-neutral-500">
                                  No properties found.
                                </p>
                              ) : (
                                <div className="mt-2 space-y-3">
                                  {propertiesOutput.map((property) => (
                                    <div key={property._id} className="w-full">
                                      <PropertyCard property={property} />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        }
                        if (part.state === "output-error") {
                          return (
                            <p
                              key={part.toolCallId}
                              className="text-sm text-red-500"
                            >
                              {part.errorText || "Unable to fetch properties."}
                            </p>
                          );
                        }
                        return (
                          <div
                            key={part.toolCallId}
                            className="flex items-center gap-2 text-xs
                              text-neutral-400 dark:text-neutral-500"
                          >
                            <Loader size={12} className="animate-spin" />
                            Searching properties…
                          </div>
                        );
                      }

                      if (part.type === "step-start") {
                        return (
                          <hr
                            key={`${message.id}-step-${index}`}
                            className="border-neutral-100 dark:border-neutral-700/40"
                          />
                        );
                      }

                      return null;
                    })}
                  </div>
                </div>
              ))
            )}

            {/* Typing dots */}
            {status === "submitted" && (
              <div className="flex items-center gap-1 pl-0.5">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-bounce bg-neutral-300 dark:bg-neutral-600"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full animate-bounce bg-neutral-300 dark:bg-neutral-600"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full animate-bounce bg-neutral-300 dark:bg-neutral-600"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className="border-t px-3 py-3
              bg-white border-neutral-100
              dark:bg-neutral-900 dark:border-neutral-700/60"
          >
            {isStreaming && (
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={() => stop()}
                  className="text-xs transition-colors text-red-400 hover:text-red-500 dark:hover:text-red-300"
                >
                  Stop generating ✕
                </button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about properties or brokers…"
                className="flex-1 rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:ring-2 transition-all
                  bg-neutral-50 border-neutral-200 text-neutral-900 placeholder:text-neutral-400
                  focus:border-primary/50 focus:bg-white focus:ring-primary/10
                  dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 dark:placeholder:text-neutral-600
                  dark:focus:border-primary/50 dark:focus:bg-neutral-800 dark:focus:ring-primary/10"
              />
              <button
                type="submit"
                disabled={!input.trim() || status !== "ready"}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white
                  hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="cursor-pointer flex items-center gap-2 rounded-full bg-primary px-4 py-3
            text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
        >
          <MessageCircle size={18} />
          Ask AI
        </button>
      )}
    </div>
  );
}
