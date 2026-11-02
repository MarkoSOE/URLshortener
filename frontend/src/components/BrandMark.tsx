export const BrandMark = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true">
    <rect width="28" height="28" rx="7" fill="var(--accent)" />
    <path
      d="M9 15.5l3.5-3.5M12 19l-2 2a3 3 0 01-4.2-4.2l2-2M16 9l2-2a3 3 0 014.2 4.2l-2 2M15.5 12.5L19 9"
      stroke="#fff"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);
