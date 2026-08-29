export type CalloutTone = "tip" | "warn" | "honest" | "lead";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; id: string; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; tone: CalloutTone; title: string; text: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "qa"; q: string; a: string }
  | { type: "checklist"; items: string[] };

export interface DocLink {
  title: string;
  url: string;
  note?: string;
}

export interface Article {
  id: string;
  title: string;
  group: string;
  summary: string;
  readMinutes: number;
  tags: string[];
  related: string[];
  practiceTopic?: string;
  suggestedQuestions: string[];
  docs?: DocLink[];
  blocks: Block[];
}

export interface ArticleGroup {
  id: string;
  title: string;
  articleIds: string[];
}

export interface ChatTurn {
  id: string;
  role: "user" | "trainer";
  text: string;
  articleId?: string;
  citations?: { articleId: string; title: string; heading?: string }[];
  suggestions?: string[];
  createdAt: number;
}

export interface TrainerReply {
  text: string;
  citations: { articleId: string; title: string; heading?: string }[];
  suggestions: string[];
}
