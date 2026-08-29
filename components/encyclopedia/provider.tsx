"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { askTrainer, greetingFor } from "@/lib/encyclopedia/agent";
import { getArticle } from "@/lib/encyclopedia/catalog";
import type { ChatTurn } from "@/lib/encyclopedia/types";

interface EncyclopediaContextValue {
  articleId: string;
  setArticleId: (id: string) => void;
  chat: ChatTurn[];
  sendChat: (text: string) => Promise<void>;
  pending: boolean;
  openChat: boolean;
  setOpenChat: (v: boolean) => void;
  askAbout: (question: string) => void;
}

const Ctx = createContext<EncyclopediaContextValue | null>(null);

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function turn(role: ChatTurn["role"], text: string, extra?: Partial<ChatTurn>): ChatTurn {
  return { id: uid(), role, text, createdAt: Date.now(), ...extra };
}

export function EncyclopediaProvider({ children }: { children: React.ReactNode }) {
  const [articleId, setArticleIdState] = useState("home");
  const [chat, setChat] = useState<ChatTurn[]>([]);
  const [pending, setPending] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  useEffect(() => {
    const fromHash = window.location.hash.replace(/^#\/?/, "");
    if (fromHash && getArticle(fromHash).id === fromHash) {
      setArticleIdState(fromHash);
    }
  }, []);

  const greet = useCallback((id: string) => {
    const g = greetingFor(id);
    setChat([turn("trainer", g.text, { articleId: id, citations: g.citations, suggestions: g.suggestions })]);
  }, []);

  useEffect(() => {
    greet(articleId);
  }, [articleId, greet]);

  const setArticleId = useCallback((id: string) => {
    setArticleIdState(id);
    window.location.hash = id;
  }, []);

  const sendChat = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q) return;
      const user = turn("user", q, { articleId });
      setChat((prev) => [...prev, user]);
      setPending(true);
      try {
        const reply = askTrainer({ question: q, articleId });
        setChat((prev) => [
          ...prev,
          turn("trainer", reply.text, {
            articleId,
            citations: reply.citations,
            suggestions: reply.suggestions,
          }),
        ]);
      } catch {
        setChat((prev) => [
          ...prev,
          turn("trainer", "The trainer could not answer that. Read the article and try a heading from it."),
        ]);
      } finally {
        setPending(false);
      }
    },
    [articleId]
  );

  const askAbout = useCallback(
    (question: string) => {
      setOpenChat(true);
      void sendChat(question);
    },
    [sendChat]
  );

  const value = useMemo(
    () => ({ articleId, setArticleId, chat, sendChat, pending, openChat, setOpenChat, askAbout }),
    [articleId, setArticleId, chat, sendChat, pending, openChat, askAbout]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEncyclopedia() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEncyclopedia must be used within EncyclopediaProvider");
  return ctx;
}
