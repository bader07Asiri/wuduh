import type { Metadata } from "next";
import { WuduhShell } from "@/components/site/WuduhShell";
import { HTML } from "./content";

export const metadata: Metadata = { title: "تواصل معنا | وضوح Wuduh" };

export default function Page() {
  return <WuduhShell html={HTML} />;
}
