import { useEffect, useState } from "react";
import type AnthropicNS from "@anthropic-ai/sdk";
import type { TaskPriority } from "../types";

/**
 * The "brain": turn a free-form spoken brain-dump into clean, structured tasks
 * via Claude Haiku 4.5.
 *
 * Key handling (MVP / personal testing): the Anthropic API key is entered in
 * Settings and stored in this browser's localStorage; the call goes directly
 * from the browser to Anthropic (dangerouslyAllowBrowser). That's fine for
 * testing on yourself and a few people (each enters their own key). For a
 * public launch this MUST move behind a backend proxy so the key isn't exposed
 * — everything here is written behind parseTasksFromSpeech() so that swap is
 * a one-file change. The SDK is imported lazily so it stays out of the initial
 * bundle and only loads when a parse actually happens.
 */

const KEY_STORAGE = "daybreak.anthropic_key";
const listeners = new Set<() => void>();

export function getApiKey(): string {
  if (typeof localStorage === "undefined") return "";
  return localStorage.getItem(KEY_STORAGE) ?? "";
}

export function setApiKey(key: string): void {
  if (typeof localStorage === "undefined") return;
  const trimmed = key.trim();
  if (trimmed) localStorage.setItem(KEY_STORAGE, trimmed);
  else localStorage.removeItem(KEY_STORAGE);
  listeners.forEach((l) => l());
}

/** React hook so the UI reacts when the key is saved/cleared. */
export function useApiKey() {
  const [key, setKey] = useState(getApiKey);
  useEffect(() => {
    const fn = () => setKey(getApiKey());
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);
  return { key, hasKey: key.trim().length > 0, save: setApiKey };
}

export interface ParsedTask {
  text: string;
  priority: TaskPriority;
}

const SYSTEM = `You turn a person's spoken brain-dump into a clean list of tasks for their day.
- Split the input into distinct, actionable tasks.
- Rewrite each as a short, clear title in the SAME language the person spoke.
- Strip filler ("um", "then", "I need to", "надо", "напомни") — keep titles tight.
- Infer priority from urgency/importance cues; default to "none".
- Never invent tasks that weren't said. Preserve the person's intent.
Return the result by calling the save_tasks tool.`;

const TOOL: AnthropicNS.Tool = {
  name: "save_tasks",
  description: "Save the cleaned list of tasks extracted from the user's speech.",
  input_schema: {
    type: "object",
    properties: {
      tasks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            text: { type: "string", description: "Short task title, in the user's language" },
            priority: { type: "string", enum: ["none", "low", "medium", "high"] },
          },
          required: ["text", "priority"],
        },
      },
    },
    required: ["tasks"],
  },
};

const PRIORITIES: TaskPriority[] = ["none", "low", "medium", "high"];

export async function parseTasksFromSpeech(transcript: string): Promise<ParsedTask[]> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("no-api-key");

  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const res = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: SYSTEM,
    tools: [TOOL],
    tool_choice: { type: "tool", name: "save_tasks" },
    messages: [{ role: "user", content: transcript }],
  });

  const block = res.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") return [];
  const input = block.input as { tasks?: { text?: string; priority?: string }[] };

  return (input.tasks ?? [])
    .map((t) => ({
      text: String(t.text ?? "").trim(),
      priority: PRIORITIES.includes(t.priority as TaskPriority)
        ? (t.priority as TaskPriority)
        : "none",
    }))
    .filter((t) => t.text.length > 0);
}
