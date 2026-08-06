import type { Metadata } from "next";
import { WuduhShell } from "@/components/site/WuduhShell";
import { HTML } from "./content";

export const metadata: Metadata = { title: "شروط الاستخدام | وضوح Wuduh" };

export default function Page() {
  return <WuduhShell html={HTML} />;
}
