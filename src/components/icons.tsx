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
    <svg width={19} height={19} viewBox="0 0 24 24" {...props}>
      <path
        fill="#ef7f2e"
        d="M12.7 1.8c.7 3.1-1 4.9-2.7 6.6C8.1 10.1 6.3 12 6.3 14.8 6.3 18.6 9 21.4 12 21.4s5.7-2.8 5.7-6.6c0-2-.8-3.8-1.9-5.2-.4 1.4-1.3 2.2-2.3 2.5 1.1-3.5-.3-7-1.8-10.3z"
      />
      <path
        fill="#ffc062"
        d="M12 21.4c-2.2 0-4.1-1.8-4.1-4.1 0-2 1.3-3.2 2.1-4.3.4 1.1 1 1.7 1.8 1.9-.4-2 .6-3.6 1.4-4.5.7 2.3 2.4 3.3 2.4 6 0 3-1.5 5-3.6 5z"
      />
    </svg>
  );
}
