/** Build a wa.me link with a prefilled message. Pure and client-safe, unlike data.ts. */
export function waLink(whatsapp: string, text: string) {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
}
