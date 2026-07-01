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
      <circle cx="12" cy="12.2" r="3" fill="#fff" />
      <g stroke="#fff" strokeWidth="1.4" strokeLinecap="round">
        <line x1="12" y1="4.7" x2="12" y2="6.2" />
        <line x1="12" y1="18.2" x2="12" y2="19.7" />
        <line x1="4.7" y1="12.2" x2="6.2" y2="12.2" />
        <line x1="17.8" y1="12.2" x2="19.3" y2="12.2" />
        <line x1="7" y1="7.2" x2="8.1" y2="8.3" />
        <line x1="15.9" y1="16.1" x2="17" y2="17.2" />
        <line x1="17" y1="7.2" x2="15.9" y2="8.3" />
        <line x1="8.1" y1="16.1" x2="7" y2="17.2" />
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

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" {...stroke} strokeWidth={1.8} {...props}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

export function FlameIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" {...props}>
      <path
        fill="#f1913d"
        d="M13 2.5c.5 2.4-.6 3.8-1.9 5.1C9.5 9.1 8 10.6 8 13.2 8 16.9 9.9 19.6 12 19.6s4-2.7 4-6.4c0-1.4-.4-2.7-1.1-3.8-.4.9-1 1.5-1.7 1.7.8-3.1-.2-6.2-2.2-8.6z"
      />
      <path
        fill="#ffb454"
        d="M12 20c-1.7 0-3-1.4-3-3.2 0-1.5 1-2.5 1.6-3.3.3.9.8 1.3 1.4 1.5-.3-1.6.5-2.8 1.1-3.5.5 1.8 1.9 2.6 1.9 4.8C16 18.6 14.7 20 12 20z"
      />
    </svg>
  );
}
