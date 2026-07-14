import Link from "next/link";

const footerLinks = [
  ["About", "/#about"],
  ["Catalogue", "/products"],
  ["Categories", "/#products"],
  ["Offers", "/#offer"],
  ["Contact", "/contact"],
];

export default function SiteFooter() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-white pt-20">
      <div className="wave-footer bg-[var(--sun-sky-dark)] px-5 pb-10 pt-28 text-white sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
          <div>
            <h3 className="text-3xl font-black">We Promise</h3>
            <p className="mt-6 max-w-md text-sm font-medium leading-8 text-white/90">
              We never compromise on the quality of our toy range and work to deliver durable, colourful,
              child-friendly products on time.
            </p>
          </div>
          <div>
            <h3 className="text-3xl font-black">Useful Links</h3>
            <div className="mt-6 grid gap-3 text-sm font-bold text-white/90">
              {footerLinks.map(([label, href]) => (
                <Link key={label} href={href} className="transition hover:text-[var(--sun-yellow-soft)]">
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black">Contact Us</h3>
            <div className="mt-6 grid gap-4 text-sm font-semibold leading-7 text-white/90">
              <p>Phone: +91-9811148225</p>
              <p>Email: contact@gmail.com</p>
              <p>Address: Sector 3, Bawana Industrial Area, Delhi 110039, India.</p>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-7xl border-t border-[#7ecae1]/40 pt-7 text-center text-sm font-semibold text-white/90">
          &copy; 2026 ANKUSH Playways. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
