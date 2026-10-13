const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999";

export function whatsappLink(message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink("Hi! I have a question about your products.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-2xl text-white shadow-lg hover:scale-105 transition"
    >
      💬
    </a>
  );
}
