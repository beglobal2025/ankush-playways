import type { Product } from "@/lib/catalogue";
import { getWhatsAppUrl } from "@/lib/catalogue";

interface WhatsAppButtonProps {
  product?: Pick<Product, "code" | "name">;
  children?: string;
  floating?: boolean;
  className?: string;
}

export default function WhatsAppButton({
  product,
  children = "Enquire on WhatsApp",
  floating = false,
  className = "",
}: WhatsAppButtonProps) {
  const label = product ? `Enquire about ${product.code} on WhatsApp` : "Chat on WhatsApp";

  if (floating) {
    return (
      <a
        href={getWhatsAppUrl(product)}
        aria-label={label}
        className={`fixed bottom-6 right-5 z-50 grid size-16 place-items-center rounded-2xl bg-[#25d366] text-white shadow-2xl shadow-green-300 transition hover:-translate-y-1 ${className}`}
      >
        <WhatsAppIcon />
      </a>
    );
  }

  return (
    <a
      href={getWhatsAppUrl(product)}
      aria-label={label}
      className={`inline-flex items-center justify-center rounded-full bg-[#25d366] px-5 py-3 text-sm font-black text-white shadow-lg shadow-green-200 transition hover:-translate-y-0.5 hover:bg-[#1fbd5b] ${className}`}
    >
      {children}
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="size-9 fill-current">
      <path d="M16.04 3.2A12.68 12.68 0 0 0 5.18 22.4L3.6 28.8l6.55-1.52A12.72 12.72 0 1 0 16.04 3.2Zm0 2.42a10.3 10.3 0 0 1 8.7 15.82 10.34 10.34 0 0 1-12.94 3.6l-.45-.23-3.9.9.93-3.78-.28-.48a10.26 10.26 0 0 1 7.94-15.83Zm-4.5 5.47c-.22 0-.58.08-.88.42-.3.33-1.16 1.13-1.16 2.76s1.19 3.2 1.36 3.43c.17.22 2.3 3.68 5.67 5.02 2.8 1.1 3.37.88 3.98.82.6-.06 1.96-.8 2.24-1.57.27-.77.27-1.43.19-1.57-.08-.14-.3-.22-.63-.39-.33-.16-1.96-.96-2.26-1.07-.3-.11-.52-.16-.74.17-.22.33-.85 1.07-1.04 1.29-.2.22-.39.25-.72.08-.33-.16-1.4-.52-2.67-1.65-.99-.88-1.65-1.97-1.84-2.3-.2-.33-.02-.51.15-.67.15-.15.33-.39.5-.58.16-.2.22-.33.33-.55.11-.22.06-.41-.03-.58-.08-.16-.74-1.78-1.02-2.44-.27-.64-.54-.55-.74-.56h-.66Z" />
    </svg>
  );
}
