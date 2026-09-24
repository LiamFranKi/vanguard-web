/** Ícono tipo aviso oficial (libro abierto). Color adaptable. */
export default function LibroReclamacionesIcon({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M8 14c8.5-4 16.5-4 24 0v38c-7.5-4-15.5-4-24 0V14z" fill="#B45309" />
      <path d="M56 14c-8.5-4-16.5-4-24 0v38c7.5-4 15.5-4 24 0V14z" fill="#D97706" />
      <path d="M32 14v38" stroke="#78350F" strokeWidth="1.6" />
      <path d="M14 22h12M14 29h12M14 36h10" stroke="#FDE68A" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M38 22h12M38 29h12M38 36h10" stroke="#FEF3C7" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
