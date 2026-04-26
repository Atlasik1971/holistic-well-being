interface InitialsAvatarProps {
  name: string;
  size?: number;
  className?: string;
}

const PALETTE = [
  { bg: "hsl(95 22% 78%)", fg: "hsl(95 28% 22%)" },
  { bg: "hsl(40 30% 80%)", fg: "hsl(30 25% 25%)" },
  { bg: "hsl(200 18% 78%)", fg: "hsl(210 20% 22%)" },
  { bg: "hsl(20 30% 82%)", fg: "hsl(15 25% 28%)" },
  { bg: "hsl(140 18% 78%)", fg: "hsl(150 22% 22%)" },
];

const getInitials = (name: string) => {
  const cleaned = name.replace(/,.*$/, "").trim();
  const parts = cleaned.split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const pickColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
};

const InitialsAvatar = ({ name, size = 40, className }: InitialsAvatarProps) => {
  const initials = getInitials(name);
  const { bg, fg } = pickColor(name);
  return (
    <div
      role="img"
      aria-label={name}
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "9999px",
        background: bg,
        color: fg,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: Math.round(size * 0.42),
        letterSpacing: "0.02em",
        userSelect: "none",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
};

export default InitialsAvatar;
