import type { SVGProps } from "react";

/** Line/solid SVG icons — no emoji in production UI. Color follows currentColor. */

const stroke = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function MicIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={30} height={30} viewBox="0 0 24 24" {...stroke} strokeWidth={1.8} {...props}>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <line x1="12" y1="18" x2="12" y2="21" />
      <line x1="8.5" y1="21" x2="15.5" y2="21" />
    </svg>
  );
}

export function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={28} height={28} viewBox="0 0 24 24" {...stroke} strokeWidth={1.9} {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function BrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" {...props}>
      <defs>
        <linearGradient id="brand-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFB66D" />
          <stop offset="1" stopColor="#FF8D68" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#brand-grad)" />
      <circle cx="12" cy="12" r="3.4" fill="#fff" />
      <g stroke="#fff" strokeWidth="1.8" strokeLinecap="round">
        <line x1="12" y1="4.2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="19.8" />
        <line x1="4.2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="19.8" y2="12" />
        <line x1="6.6" y1="6.6" x2="7.9" y2="7.9" />
        <line x1="16.1" y1="16.1" x2="17.4" y2="17.4" />
        <line x1="17.4" y1="6.6" x2="16.1" y2="7.9" />
        <line x1="7.9" y1="16.1" x2="6.6" y2="17.4" />
      </g>
    </svg>
  );
}

export function KeyboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={19} height={19} viewBox="0 0 24 24" {...stroke} strokeWidth={1.6} {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="2.6" />
      <line x1="6" y1="10" x2="6" y2="10" />
      <line x1="9" y1="10" x2="9" y2="10" />
      <line x1="12" y1="10" x2="12" y2="10" />
      <line x1="15" y1="10" x2="15" y2="10" />
      <line x1="18" y1="10" x2="18" y2="10" />
      <line x1="8" y1="14" x2="16" y2="14" />
    </svg>
  );
}

export function SunriseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={28} height={28} viewBox="0 0 24 24" {...stroke} strokeWidth={1.6} {...props}>
      <path d="M3 18h18" />
      <path d="M7 18a5 5 0 0 1 10 0" />
      <line x1="12" y1="4.5" x2="12" y2="7" />
      <line x1="5" y1="8.2" x2="6.4" y2="9.5" />
      <line x1="19" y1="8.2" x2="17.6" y2="9.5" />
      <line x1="2.5" y1="14" x2="4" y2="14" />
      <line x1="20" y1="14" x2="21.5" y2="14" />
    </svg>
  );
}

export function SunIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" {...stroke} {...props}>
      <circle cx="12" cy="12" r="4.1" />
      <line x1="12" y1="2.6" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="21.4" />
      <line x1="2.6" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="21.4" y2="12" />
      <line x1="5.4" y1="5.4" x2="7.1" y2="7.1" />
      <line x1="16.9" y1="16.9" x2="18.6" y2="18.6" />
      <line x1="18.6" y1="5.4" x2="16.9" y2="7.1" />
      <line x1="7.1" y1="16.9" x2="5.4" y2="18.6" />
    </svg>
  );
}

export function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" {...stroke} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.4 12.3l2.4 2.4 4.8-5" />
    </svg>
  );
}

export function MoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M20 14.6A8 8 0 0 1 9.4 4 7 7 0 1 0 20 14.6z" />
    </svg>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" {...stroke} strokeWidth={2.6} {...props}>
      <path d="M5 12.5l4 4 10-10.5" />
    </svg>
  );
}

export function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M8 5.4v13.2a1 1 0 0 0 1.5.86l11-6.6a1 1 0 0 0 0-1.72l-11-6.6A1 1 0 0 0 8 5.4z" />
    </svg>
  );
}

export function PauseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="7" y="5.5" width="3.4" height="13" rx="1.1" />
      <rect x="13.6" y="5.5" width="3.4" height="13" rx="1.1" />
    </svg>
  );
}

export function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" {...stroke} strokeWidth={1.7} {...props}>
      <path d="M4 7h16" />
      <path d="M9 7V5.6A1.6 1.6 0 0 1 10.6 4h2.8A1.6 1.6 0 0 1 15 5.6V7" />
      <path d="M6.5 7l.9 11.5A2 2 0 0 0 9.4 20.4h5.2a2 2 0 0 0 2-1.9L17.5 7" />
    </svg>
  );
}

export function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" {...stroke} strokeWidth={1.8} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.6V12l3 1.8" />
    </svg>
  );
}

export function GripIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" {...stroke} strokeWidth={1.8} {...props}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

export function GearIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" {...stroke} {...props}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 12.9a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V19a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H5a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H11a1.6 1.6 0 0 0 1-1.5V5a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V11a1.6 1.6 0 0 0 1.5 1H19a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" />
    </svg>
  );
}

export function FlameIcon(props: SVGProps<SVGSVGElement>) {
  // Single-tone minimal flame (not the two-tone emoji look) — matches the
  // premium line-icon system. Colour comes from currentColor.
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.1 2.1c.5 2.7-1 4.4-2.6 5.9-1.7 1.6-3.5 3.5-3.5 6.3 0 3.4 2.5 6 5.4 6s5.3-2.5 5.3-5.9c0-1.9-.7-3.6-1.9-5.1-.4 1.3-1.2 2.2-2.3 2.5 1.2-3.5-.2-7-1.4-9.7zm-1 15.9c-1.5 0-2.6-1.2-2.6-2.7 0-1.3.8-2.2 1.5-3.1.4 1 .9 1.4 1.6 1.6-.4-1.8.6-3 1.2-3.8.5 1.8 1.9 2.6 1.9 4.7 0 1.8-1.4 3.3-3.6 3.3z" />
    </svg>
  );
}
