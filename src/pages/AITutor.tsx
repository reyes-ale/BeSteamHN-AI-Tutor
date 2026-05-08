import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import {
  Bot,
  Send,
  Plus,
  MessageSquare,
  Lightbulb,
  HelpCircle,
  ClipboardCheck,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChatMessage } from '@/lib/mockData';

const aiResponses = [
  {
    en: "Great question! Let me break this down for you. The key concept here is to think about it step by step. First, understand the basics, then build on that knowledge gradually. Would you like me to give you an example?",
    es: "¡Gran pregunta! Déjame desglosarlo para ti. El concepto clave aquí es pensarlo paso a paso. Primero, entiende lo básico, luego construye sobre ese conocimiento gradualmente. ¿Te gustaría que te dé un ejemplo?",
  },
  {
    en: "That's a wonderful curiosity to have! Here's how I'd explain it: imagine you're building with LEGO blocks. Each concept is a block, and together they form something amazing. Let's start with the first block.",
    es: "¡Es una curiosidad maravillosa! Así es como lo explicaría: imagina que construyes con bloques LEGO. Cada concepto es un bloque, y juntos forman algo increíble. Comencemos con el primer bloque.",
  },
  {
    en: "You're on the right track! Let me add some clarity. This concept connects to what you learned before. Think of it as an extension of the previous lesson. The pattern is the same, just applied differently.",
    es: "¡Vas por buen camino! Déjame agregar algo de claridad. Este concepto se conecta con lo que aprendiste antes. Piénsalo como una extensión de la lección anterior. El patrón es el mismo, solo aplicado de forma diferente.",
  },
  {
    en: "Excellent progress! Here's a quiz for you: Can you explain in your own words what this concept means? Try to use an example from your daily life. I'll help if you get stuck!",
    es: "¡Excelente progreso! Aquí va un quiz: ¿Puedes explicar con tus propias palabras qué significa este concepto? Intenta usar un ejemplo de tu vida diaria. ¡Te ayudo si te atascas!",
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
      messages: [
        { id: '0', role: 'assistant', content: t.aiTutor.greeting, timestamp: new Date() },
      ],
    },
    {
      id: '2',
      title: locale === 'es' ? 'Bucles y Funciones' : 'Loops & Functions',
      date: '2026-05-07',
      messages: [
        { id: '0', role: 'assistant', content: t.aiTutor.greeting, timestamp: new Date() },
        { id: '1', role: 'user', content: locale === 'es' ? '¿Cómo funcionan los bucles for?' : 'How do for loops work?', timestamp: new Date() },
        { id: '2', role: 'assistant', content: aiResponses[0][locale], timestamp: new Date() },
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

  const sendMessage = () => {
    if (!input.trim() || !currentSession) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession ? { ...s, messages: [...s.messages, userMsg] } : s
      )
    );
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const resp = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: locale === 'es' ? resp.es : resp.en,
        timestamp: new Date(),
      };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSession ? { ...s, messages: [...s.messages, aiMsg] } : s
        )
      );
      setIsTyping(false);
    }, 1500);
  };

  const createSession = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      title: locale === 'es' ? 'Nueva Sesión' : 'New Session',
      date: new Date().toISOString().split('T')[0],
      messages: [
        { id: '0', role: 'assistant', content: t.aiTutor.greeting, timestamp: new Date() },
      ],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSession(newSession.id);
  };

  const handleQuickAction = (type: string) => {
    const prompts: Record<string, { en: string; es: string }> = {
      hint: { en: 'Can you give me a hint about my current lesson?', es: '¿Puedes darme una pista sobre mi lección actual?' },
      explain: { en: 'Can you explain the last concept in a simpler way?', es: '¿Puedes explicar el último concepto de forma más simple?' },
      quiz: { en: 'Quiz me on what I\'ve learned so far!', es: '¡Hazme un quiz sobre lo que he aprendido!' },
    };
    setInput(locale === 'es' ? prompts[type].es : prompts[type].en);
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-6">
      {/* Sessions Sidebar */}
      <div className="w-72 shrink-0 flex flex-col">
        <Card className="flex-1 flex flex-col border-border bg-card shadow-theme-sm overflow-hidden">
          <CardHeader className="pb-3 shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground">
                {t.aiTutor.sessions}
              </CardTitle>
              <button
                onClick={createSession}
                className="flex items-center gap-1 rounded-lg bg-gradient-accent px-2.5 py-1.5 text-[11px] font-semibold text-accent-foreground transition-base hover:opacity-90"
              >
                <Plus className="h-3 w-3" /> {t.aiTutor.newSession}
              </button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-1 overflow-y-auto pb-4">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setActiveSession(session.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-base ${
                  activeSession === session.id
                    ? 'bg-primary/5 border border-primary/10'
                    : 'hover:bg-muted'
                }`}
              >
                <MessageSquare className={`h-4 w-4 shrink-0 ${activeSession === session.id ? 'text-secondary' : 'text-muted-foreground'}`} />
                <div className="min-w-0">
                  <p className={`text-xs font-medium truncate ${activeSession === session.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {session.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{session.date}</p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col border-border bg-card shadow-theme-sm overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-accent">
            <Bot className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">{t.aiTutor.title}</h2>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-secondary" />
              {t.aiTutor.bilingual}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {currentSession?.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex gap-2.5 max-w-[75%]">
                {msg.role === 'assistant' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary/10 mt-0.5">
                    <Bot className="h-3.5 w-3.5 text-secondary" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md animate-slide-in-right'
                      : 'bg-muted text-foreground rounded-bl-md animate-slide-in-left'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary/10">
                <Bot className="h-3.5 w-3.5 text-secondary" />
              </div>
              <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                <div className="flex gap-1.5">
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
        <div className="flex gap-2 border-t border-border px-5 py-2.5 shrink-0">
          <button
            onClick={() => handleQuickAction('hint')}
            className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-base hover:bg-secondary/10 hover:text-secondary"
          >
            <Lightbulb className="h-3 w-3" /> {t.aiTutor.hint}
          </button>
          <button
            onClick={() => handleQuickAction('explain')}
            className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-base hover:bg-secondary/10 hover:text-secondary"
          >
            <HelpCircle className="h-3 w-3" /> {t.aiTutor.explain}
          </button>
          <button
            onClick={() => handleQuickAction('quiz')}
            className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-base hover:bg-secondary/10 hover:text-secondary"
          >
            <ClipboardCheck className="h-3 w-3" /> {t.aiTutor.quiz}
          </button>
        </div>

        {/* Input */}
        <div className="flex items-center gap-3 border-t border-border px-5 py-3 shrink-0">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={t.aiTutor.placeholder}
            className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-accent text-accent-foreground transition-base hover:opacity-90 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </Card>
    </div>
  );
}
