import type { Metadata } from "next";
import ContactEnquiryForm from "@/components/ContactEnquiryForm";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Ankush Playways for indoor and outdoor play equipment, school furniture, toys, bulk orders, and catalogue enquiries.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--sun-yellow-pale)]">
      <SiteHeader />

      <section className="relative overflow-hidden bg-[var(--sun-sky-soft)] px-5 pb-20 pt-36 sm:px-8 sm:pt-40">
        <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle,rgba(255,255,255,0.9)_0_3px,transparent_4px)] [background-size:82px_82px]" />
        <div className="absolute -right-20 top-24 size-72 rounded-full bg-[var(--sun-yellow)]/25 blur-2xl" />
        <div className="absolute -left-16 bottom-0 size-64 rounded-full bg-[var(--sun-coral)]/25 blur-2xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-sm font-black text-[var(--sun-coral-strong)]">We are here to help</p>
          <h1 className="mt-4 text-5xl font-black leading-tight text-[var(--sun-sky-dark)] sm:text-6xl">Contact Ankush Playways</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-8 text-slate-700 sm:text-lg">
            Planning a school, play zone, retail order, or outdoor playground? Share your requirement and our team will help you find the right products.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="tel:+917814511770" className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-black text-[var(--sun-sky-dark)] shadow-lg ring-1 ring-[var(--sun-line)] transition hover:-translate-y-0.5">
              Call 7814511770
            </a>
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 pt-16 sm:px-8 sm:pt-20">
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="rounded-[32px] bg-[var(--sun-sky-dark)] p-8 text-white shadow-[0_24px_70px_rgba(40,141,176,0.24)] sm:p-10">
            <p className="text-sm font-black text-[var(--sun-yellow-soft)]">Business enquiries</p>
            <h2 className="mt-4 text-3xl font-black sm:text-4xl">Let’s create a joyful play space</h2>
            <p className="mt-5 text-sm font-semibold leading-8 text-white/85">
              We help schools, dealers, retailers, play zones, and institutions choose durable products for their space and budget.
            </p>
            <div className="mt-8 grid gap-4 text-sm font-bold text-white/90">
              <p>✓ Product catalogue assistance</p>
              <p>✓ Bulk order enquiries</p>
              <p>✓ Indoor and outdoor solutions</p>
              <p>✓ Delivery and availability support</p>
            </div>
          </div>
          <ContactEnquiryForm />
        </div>
      </section>

      <SiteFooter />
      <WhatsAppButton floating />
    </main>
  );
}
