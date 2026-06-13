import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Browse ANKUSH Playways products with real catalogue images, featured categories, popular products, and WhatsApp enquiries.",
};

export default function Home() {
  return <LandingPage />;
}
