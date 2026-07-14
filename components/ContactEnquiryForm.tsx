"use client";

import { useState, type FormEvent } from "react";

export default function ContactEnquiryForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const email = String(form.get("email") || "").trim();
    const requirement = String(form.get("requirement") || "").trim();
    const message = String(form.get("message") || "").trim();
    const enquiry = [
      "Hello Ankush Playways, I would like to make an enquiry.",
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : "",
      `Requirement: ${requirement}`,
      `Message: ${message}`,
    ]
      .filter(Boolean)
      .join("\n");

    setSubmitted(true);
    window.open(`https://wa.me/919811148225?text=${encodeURIComponent(enquiry)}`, "_blank", "noopener,noreferrer");
  };

  const inputClass =
    "w-full rounded-2xl border border-[var(--sun-line)] bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[var(--sun-sky-dark)] focus:ring-4 focus:ring-[var(--sun-sky-soft)]";

  return (
    <form onSubmit={handleSubmit} className="rounded-[32px] border border-[var(--sun-line)] bg-white p-6 shadow-[0_24px_70px_rgba(126,202,225,0.22)] sm:p-9">
      <p className="text-sm font-black text-[var(--sun-coral-strong)]">Quick enquiry</p>
      <h2 className="mt-3 text-3xl font-black text-[var(--sun-ink)] sm:text-4xl">Tell us what you need</h2>
      <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
        Complete the form and continue your enquiry securely on WhatsApp.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-black text-slate-700">
          Your name
          <input className={inputClass} name="name" type="text" autoComplete="name" placeholder="Enter your name" required />
        </label>
        <label className="grid gap-2 text-sm font-black text-slate-700">
          Phone number
          <input className={inputClass} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="Enter your phone number" required />
        </label>
        <label className="grid gap-2 text-sm font-black text-slate-700">
          Email address <span className="font-semibold text-slate-400">(optional)</span>
          <input className={inputClass} name="email" type="email" autoComplete="email" placeholder="you@example.com" />
        </label>
        <label className="grid gap-2 text-sm font-black text-slate-700">
          Product requirement
          <select className={inputClass} name="requirement" defaultValue="" required>
            <option value="" disabled>Select a requirement</option>
            <option>Indoor play equipment</option>
            <option>Outdoor playground equipment</option>
            <option>School furniture</option>
            <option>Toys and learning products</option>
            <option>Bulk or dealership enquiry</option>
            <option>Other</option>
          </select>
        </label>
      </div>

      <label className="mt-5 grid gap-2 text-sm font-black text-slate-700">
        Your message
        <textarea className={`${inputClass} min-h-32 resize-y`} name="message" placeholder="Tell us about the products, quantity, or project you have in mind" required />
      </label>

      <button type="submit" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#25d366] px-7 py-4 text-sm font-black text-white shadow-xl shadow-[#25d366]/20 transition hover:-translate-y-0.5 hover:bg-[#1fbd5b] sm:w-auto">
        Continue on WhatsApp
      </button>
      {submitted ? <p className="mt-4 text-sm font-bold text-[#16835f]">Your WhatsApp enquiry has been prepared.</p> : null}
    </form>
  );
}
