interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  accent?: string;
  align?: "left" | "center";
  description?: string;
}

export default function SectionHeading({
  title,
  accent,
  align = "center",
  description,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div className={`${isCenter ? "mx-auto text-center" : ""} mb-8 max-w-3xl`}>
      <h2 className="text-4xl font-black leading-tight text-[var(--sun-sky-dark)] sm:text-5xl">
        {title} {accent ? <span className="text-[var(--sun-coral-strong)]">{accent}</span> : null}
      </h2>
      {description ? <p className="mt-5 text-base font-medium leading-7 text-slate-600">{description}</p> : null}
      <div
        className={`mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-[var(--sun-coral)] via-[var(--sun-yellow)] to-[var(--sun-mint)] ${
          isCenter ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}
