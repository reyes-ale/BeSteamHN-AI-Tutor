import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { Bot, X, Send, Lightbulb, HelpCircle, ClipboardCheck } from 'lucide-react';
import type { ChatMessage } from '@/lib/mockData';

const aiResponses: Record<string, { en: string; es: string }[]> = {
  default: [
    {
      en: "That's a great question! Let me help you understand this concept. The key idea is to break it down into smaller parts and tackle each one step by step.",
      es: "¡Excelente pregunta! Déjame ayudarte a entender este concepto. La idea clave es dividirlo en partes m��s pequeñas y abordar cada una paso a paso.",
    },
    {
      en: "I'd love to help! Think of it this way: every complex topic starts with simple building blocks. Let's start from the basics and build up.",
      es: "¡Me encantaría ayudar! Piénsalo así: todo tema complejo comienza con bloques simples. Empecemos desde lo básico.",
    },
    {
      en: "Great curiosity! 🌟 That's exactly how great learners think. Here's how I'd approach this: first, let's identify what you already know, then fill in the gaps.",
      es: "¡Gran curiosidad! 🌟 Así es exactamente como piensan los grandes aprendices. Mi enfoque sería: primero identifiquemos lo que ya sabes, luego llenemos los vacíos.",
    },
  ],
};

export default function AIChatFab() {
  const { t, locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: t.aiTutor.greeting,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responses = aiResponses.default;
      const resp = responses[Math.floor(Math.random() * responses.length)];
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: locale === 'es' ? resp.es : resp.en,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickAction = (action: string) => {
    const prompts: Record<string, { en: string; es: string }> = {
      hint: { en: 'Can you give me a hint about my current lesson?', es: '¿Puedes darme una pista sobre mi lección actual?' },
      explain: { en: 'Can you explain this concept in a simpler way?', es: '¿Puedes explicar este concepto de forma más simple?' },
      quiz: { en: 'Quiz me on what I\'ve learned so far!', es: '¡Hazme un quiz sobre lo que he aprendido!' },
    };
    const prompt = locale === 'es' ? prompts[action].es : prompts[action].en;
    setInput(prompt);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-accent shadow-theme-lg transition-base hover:scale-105 animate-pulse-glow"
        >
          <Bot className="h-6 w-6 text-accent-foreground" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-theme-xl animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-hero px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                <Bot className="h-4 w-4 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-primary-foreground">{t.aiTutor.title}</h3>
                <p className="text-[10px] text-primary-foreground/60">{t.aiTutor.bilingual}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-primary-foreground/70 transition-base hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md animate-slide-in-right'
                      : 'bg-muted text-foreground rounded-bl-md animate-slide-in-left'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 border-t border-border px-4 py-2">
            <button
              onClick={() => handleQuickAction('hint')}
              className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-base hover:bg-secondary hover:text-secondary-foreground"
            >
              <Lightbulb className="h-3 w-3" />
              {t.aiTutor.hint}
            </button>
            <button
              onClick={() => handleQuickAction('explain')}
              className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-base hover:bg-secondary hover:text-secondary-foreground"
            >
              <HelpCircle className="h-3 w-3" />
              {t.aiTutor.explain}
            </button>
            <button
              onClick={() => handleQuickAction('quiz')}
              className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-base hover:bg-secondary hover:text-secondary-foreground"
            >
              <ClipboardCheck className="h-3 w-3" />
              {t.aiTutor.quiz}
            </button>
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-border px-4 py-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={t.aiTutor.placeholder}
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-accent text-accent-foreground transition-base hover:opacity-90 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
