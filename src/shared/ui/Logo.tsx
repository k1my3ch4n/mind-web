interface LogoProps {
  size?: number;
  className?: string;
}

function Logo({ size = 20, className }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      className={`text-brand-600 ${className ?? ''}`}
    >
      <g stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
        <line x1={7} y1={7} x2={16} y2={17} />
        <line x1={25} y1={8} x2={16} y2={17} />
        <line x1={16} y1={28} x2={16} y2={17} />
      </g>
      <circle cx={16} cy={17} r={5} fill="currentColor" />
      <circle cx={7} cy={7} r={3} fill="currentColor" />
      <circle cx={25} cy={8} r={3} fill="currentColor" />
      <circle cx={16} cy={28} r={2.5} fill="currentColor" />
    </svg>
  );
}

export default Logo;
