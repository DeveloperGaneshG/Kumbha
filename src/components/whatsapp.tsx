import { store } from "@/config/store";
import { ChatIcon } from "./icons";

export function whatsappLink(message: string) {
  return `https://wa.me/${store.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function WhatsAppFloat() {
  if (!store.features.whatsappOrdering) return null;
  return (
    <a
      href={whatsappLink(`Hi ${store.name}! I have a question.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-20 right-4 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-[#1fae53] p-3.5 text-white shadow-lg transition hover:scale-105 md:bottom-6 md:right-6"
    >
      <ChatIcon size={24} />
    </a>
  );
}
