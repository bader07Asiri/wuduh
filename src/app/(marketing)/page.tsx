import type { Metadata } from "next";
import { WuduhHome } from "@/components/landing/WuduhHome";

export const metadata: Metadata = {
  title: "وضوح | إدارة مشاريع باحترافية PMP",
  description:
    "وضوح يحوّل فكرة مشروعك — من الغموض إلى خطة واضحة — إلى حزمة مستندات احترافية وفق معايير PMI، بالعربية، خلال دقائق.",
};

export default function LandingPage() {
  return <WuduhHome />;
}
