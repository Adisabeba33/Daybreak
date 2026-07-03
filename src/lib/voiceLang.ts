import { useEffect, useState } from "react";

/**
 * Which language the speech recognizer listens in. This is the transcription
 * language (Web Speech API `lang`), not the UI language — it must match the
 * language the person actually speaks, or the transcript comes out as garbage.
 * Claude then reads that transcript and replies in the same language, so getting
 * this right is what makes "говори по-русски" actually work.
 */

export interface VoiceLang {
  code: string;
  label: string;
}

/** A small curated list of common languages, native names. */
export const VOICE_LANGS: VoiceLang[] = [
  { code: "ru-RU", label: "Русский" },
  { code: "en-US", label: "English" },
  { code: "uk-UA", label: "Українська" },
  { code: "es-ES", label: "Español" },
  { code: "de-DE", label: "Deutsch" },
  { code: "fr-FR", label: "Français" },
  { code: "it-IT", label: "Italiano" },
  { code: "pt-BR", label: "Português" },
  { code: "tr-TR", label: "Türkçe" },
  { code: "pl-PL", label: "Polski" },
  { code: "ar-SA", label: "العربية" },
  { code: "zh-CN", label: "中文" },
];

const KEY = "daybreak.voice_lang";
const listeners = new Set<() => void>();

/** Best full BCP-47 tag for the device locale, mapped onto our known list. */
function deviceDefault(): string {
  const nav = typeof navigator !== "undefined" ? navigator.language : "en-US";
  const primary = nav.toLowerCase().split("-")[0];
  const hit = VOICE_LANGS.find((l) => l.code.toLowerCase().startsWith(primary + "-"));
  return hit ? hit.code : nav || "en-US";
}

export function getVoiceLang(): string {
  if (typeof localStorage === "undefined") return deviceDefault();
  return localStorage.getItem(KEY) || deviceDefault();
}

export function setVoiceLang(code: string): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, code);
  listeners.forEach((l) => l());
}

/** Reactive hook so the mic picks up a language change immediately. */
export function useVoiceLang() {
  const [lang, setLang] = useState(getVoiceLang);
  useEffect(() => {
    const fn = () => setLang(getVoiceLang());
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);
  return { lang, setLang: setVoiceLang };
}
