export function WhatsAppFab({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      /* The white ring keeps it separate from whatever band it floats over.
         Dark ink on the green, not white: white on #25D366 is 1.98:1. */
      className="fixed bottom-3 right-3 z-40 grid size-12 place-items-center rounded-full bg-wa text-wa-ink shadow-[0_0_0_2px_#fff,0_8px_20px_-6px_rgba(11,15,20,.28)] transition-transform hover:scale-105 sm:bottom-5 sm:right-5 sm:size-14"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="size-7 fill-current">
        <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.2 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.2-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l.9 2.2c.1.2.1.4 0 .6l-.4.6-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2 1.3 2.3 1.4.3.1.4.1.6-.1l.9-1c.2-.2.4-.2.6-.1l2.1 1c.3.1.4.2.5.3.1.2.1.7-.1 1.3Z" />
      </svg>
    </a>
  );
}
