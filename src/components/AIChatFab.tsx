import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { Bot, X, Send, Lightbulb, HelpCircle, ClipboardCheck, Sparkles } from 'lucide-react';
import type { ChatMessage } from '@/lib/mockData';

const aiResponses: Record<string, { en: string; es: string }[]> = {
  default: [
    {
      en: "That's a great question! Let me help you understand this concept. The key idea is to break it down into smaller parts and tackle each one step by step.",
      es: "¡Excelente pregunta! Déjame ayudarte a entender este concepto. La idea clave es dividirlo en partes más pequeñas y abordar cada una paso a paso.",
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
    { id: '0', role: 'assistant', content: t.aiTutor.greeting, timestamp: new Date() },
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
      hint:    { en: 'Can you give me a hint about my current lesson?',     es: '¿Puedes darme una pista sobre mi lección actual?' },
      explain: { en: 'Can you explain this concept in a simpler way?',       es: '¿Puedes explicar este concepto de forma más simple?' },
      quiz:    { en: "Quiz me on what I've learned so far!",                  es: '¡Hazme un quiz sobre lo que he aprendido!' },
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
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-xl shadow-violet-300/60 transition-all duration-300 hover:scale-110 animate-pulse-glow"
        >
          <Bot className="h-6 w-6 text-white" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-3xl shadow-2xl shadow-violet-200/50 animate-fade-in-up border border-white/50">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-violet-500 via-indigo-500 to-indigo-600 px-4 py-3.5 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm shadow-sm">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">{t.aiTutor.title}</h3>
                <p className="text-[10px] text-white/70 flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5" />
                  {t.aiTutor.bilingual}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white/80 transition-all hover:bg-white/20 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 bg-gradient-to-b from-violet-50/60 to-white/80 backdrop-blur-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 shadow-sm mr-2 mt-0.5">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-br-sm animate-slide-in-right'
                      : 'bg-white/90 text-gray-800 rounded-bl-sm border border-white/60 backdrop-blur-sm animate-slide-in-left'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 shadow-sm mr-2">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="rounded-2xl rounded-bl-sm bg-white/90 border border-white/60 px-4 py-3 backdrop-blur-sm">
                  <div className="flex gap-1.5 items-center">
                    <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-1.5 px-4 py-2 border-t border-white/40 bg-white/70 backdrop-blur-sm">
            {[
              { key: 'hint',    icon: Lightbulb,     label: t.aiTutor.hint,    style: 'bg-amber-100 text-amber-700 hover:bg-amber-200'     },
              { key: 'explain', icon: HelpCircle,     label: t.aiTutor.explain, style: 'bg-blue-100 text-blue-700 hover:bg-blue-200'         },
              { key: 'quiz',    icon: ClipboardCheck, label: t.aiTutor.quiz,    style: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
            ].map((chip) => (
              <button
                key={chip.key}
                onClick={() => handleQuickAction(chip.key)}
                className={`flex items-center gap-1 rounded-full ${chip.style} px-2.5 py-1 text-[11px] font-semibold transition-all hover:scale-105`}
              >
                <chip.icon className="h-3 w-3" />
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-white/40 bg-white/80 backdrop-blur-sm shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={t.aiTutor.placeholder}
              className="flex-1 rounded-xl border border-white/60 bg-white/70 px-3.5 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 backdrop-blur-sm transition-base"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-200/60 transition-all hover:opacity-90 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
