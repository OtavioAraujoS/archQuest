export function ArchColonnade() {
  return (
    <svg
      viewBox="0 0 440 320"
      aria-hidden="true"
      preserveAspectRatio="xMidYMax meet"
      className="h-full w-full"
    >
      <path d="M0 320V120a80 80 0 0 1 160 0v200z" className="fill-primary" />
      <path d="M184 320V176a56 56 0 0 1 112 0v144z" className="fill-foreground" />
      <path d="M320 320V236a44 44 0 0 1 88 0v84z" className="fill-ring" />
      <circle cx="80" cy="120" r="22" className="fill-background" />
      <circle cx="80" cy="120" r="10" className="fill-primary" />
      <path d="M240 64l18 18-18 18-18-18z" className="fill-muted-foreground" />
      <circle cx="364" cy="236" r="15" className="fill-background" />
      <circle cx="364" cy="236" r="7" strokeWidth="5" className="fill-background stroke-ring" />
    </svg>
  )
}
