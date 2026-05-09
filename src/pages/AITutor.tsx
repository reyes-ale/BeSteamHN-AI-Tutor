import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { Bot, Send, Plus, MessageSquare, Lightbulb, HelpCircle, ClipboardCheck, Sparkles } from 'lucide-react';
import type { ChatMessage } from '@/lib/mockData';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const fallbackResponses = [
  {
    en: "Great question! Let me break this down for you. Think about it step by step — start with the basics and build from there. Would you like an example?",
    es: "¡Gran pregunta! Pensemos paso a paso — empieza con lo básico y construye desde ahí. ¿Te gustaría un ejemplo?",
  },
  {
    en: "You're on the right track! This connects to what you've already learned. The pattern is the same, just applied a bit differently.",
    es: "¡Vas por buen camino! Esto se conecta con lo que ya aprendiste. El patrón es el mismo, solo aplicado de forma diferente.",
  },
];

interface Session {
  id: string;
  title: string;
  date: string;
  messages: ChatMessage[];
}

export default function AITutor() {
  const { t, locale } = useI18n();
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      title: locale === 'es' ? 'Variables en Python' : 'Python Variables',
      date: '2026-05-08',
      messages: [{ id: '0', role: 'assistant', content: t.aiTutor.greeting, timestamp: new Date() }],
    },
    {
      id: '2',
      title: locale === 'es' ? 'Bucles y Funciones' : 'Loops & Functions',
      date: '2026-05-07',
      messages: [
        { id: '0', role: 'assistant', content: t.aiTutor.greeting, timestamp: new Date() },
        { id: '1', role: 'user', content: locale === 'es' ? '¿Cómo funcionan los bucles for?' : 'How do for loops work?', timestamp: new Date() },
        { id: '2', role: 'assistant', content: fallbackResponses[0][locale], timestamp: new Date() },
      ],
    },
  ]);
  const [activeSession, setActiveSession] = useState('1');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentSession = sessions.find((s) => s.id === activeSession);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  const sendMessage = async () => {
    if (!input.trim() || !currentSession) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    const updatedMessages = [...currentSession.messages, userMsg];
    setSessions((prev) =>
    prev.map((s) => s.id === activeSession ? { ...s, messages: [...s.messages, userMsg] } : s)

    );
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-tutor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          locale,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
      };
      setSessions((prev) =>
        prev.map((s) => (s.id === activeSession ? { ...s, messages: [...s.messages, aiMsg] } : s))
      );
    } catch {
      const resp = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: locale === 'es' ? resp.es : resp.en,
        timestamp: new Date(),
      };
      setSessions((prev) =>
      prev.map((s) => s.id === activeSession ? { ...s, messages: [...s.messages, aiMsg] } : s)

      );
    } finally {
      setIsTyping(false);
    }
  };

  const createSession = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      title: locale === 'es' ? 'Nueva Sesión' : 'New Session',
      date: new Date().toISOString().split('T')[0],
      messages: [{ id: '0', role: 'assistant', content: t.aiTutor.greeting, timestamp: new Date() }],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSession(newSession.id);
  };

  const handleQuickAction = (type: string) => {
    const prompts: Record<string, { en: string; es: string }> = {
      hint:    { en: 'Can you give me a hint about my current lesson?',         es: '¿Puedes darme una pista sobre mi lección actual?' },
      explain: { en: 'Can you explain the last concept in a simpler way?',       es: '¿Puedes explicar el último concepto de forma más simple?' },
      quiz:    { en: "Quiz me on what I've learned so far!",                      es: '¡Hazme un quiz sobre lo que he aprendido!' },
    };
    setInput(locale === 'es' ? prompts[type].es : prompts[type].en);
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-5">
      {/* Sessions Sidebar */}
      <div className="w-64 shrink-0 flex flex-col glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/40">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-violet-500" />
            {t.aiTutor.sessions}
          </h2>
          <button
            onClick={createSession}
            className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm shadow-violet-200/60 transition-all hover:opacity-90 hover:scale-105"
          >
            <Plus className="h-3 w-3" /> {t.aiTutor.newSession}
          </button>
        </div>
        <div className="flex-1 space-y-1.5 overflow-y-auto p-3">
          {sessions.map((session) => {
            const isActive = activeSession === session.id;
            return (
              <button
                key={session.id}
                onClick={() => setActiveSession(session.id)}
                className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 shadow-sm'
                    : 'hover:bg-white/60'
                }`}
              >
                <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                  isActive ? 'bg-gradient-to-br from-violet-500 to-indigo-600' : 'bg-gray-100'
                }`}>
                  <MessageSquare className={`h-3 w-3 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-semibold truncate ${isActive ? 'text-violet-700' : 'text-gray-600'}`}>
                    {session.title}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{session.date}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col glass-card rounded-2xl overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/40 bg-gradient-to-r from-violet-50 to-indigo-50">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-200">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">{t.aiTutor.title}</h2>
            <p className="text-[10px] text-violet-600 font-medium flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {t.aiTutor.bilingual}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {currentSession?.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex gap-2.5 max-w-[78%]">
                {msg.role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 shadow-sm mt-0.5">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-br-sm animate-slide-in-right'
                      : 'bg-white/80 text-gray-800 rounded-bl-sm border border-white/60 backdrop-blur-sm animate-slide-in-left'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2.5 justify-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 shadow-sm">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="rounded-2xl rounded-bl-sm bg-white/80 border border-white/60 px-4 py-3 backdrop-blur-sm">
                <div className="flex gap-1.5 items-center h-4">
                  <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Chips */}
        <div className="flex gap-2 px-5 py-2.5 border-t border-white/40 bg-white/30 flex-wrap">
          {[
            { key: 'hint', icon: Lightbulb, label: t.aiTutor.hint, color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
            { key: 'explain', icon: HelpCircle, label: t.aiTutor.explain, color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
            { key: 'quiz', icon: ClipboardCheck, label: t.aiTutor.quiz, color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
          ].map((chip) => (
            <button
              key={chip.key}
              onClick={() => handleQuickAction(chip.key)}
              className={`flex items-center gap-1.5 rounded-full ${chip.color} px-3 py-1.5 text-[11px] font-semibold transition-all duration-200 hover:scale-105`}
            >
              <chip.icon className="h-3 w-3" />
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-t border-white/40 bg-white/30">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={t.aiTutor.placeholder}
            className="flex-1 rounded-xl border border-white/60 bg-white/70 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 backdrop-blur-sm transition-base"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-200/60 transition-all duration-200 hover:opacity-90 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
