"use client";
import { useEffect } from "react";
import "./wuduh-shared.css";

// Renders a ported design page (nav + content + footer) and wires the shared
// interactive behaviours: reveal-on-scroll, mobile menu, pricing toggle,
// FAQ accordion, and the contact form (posts to /api/contact).
export function WuduhShell({ html }: { html: string }) {
  useEffect(() => {
    const w = window;

    const nav = document.querySelector(".mnav");
    const onScroll = () => nav && nav.classList.toggle("scrolled", w.scrollY > 16);
    w.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.14 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    const burger = document.querySelector(".burger");
    const onBurger = () => {
      const links = document.querySelector(".mnav-links") as HTMLElement | null;
      if (!links) return;
      const open = links.style.display === "flex";
      links.style.cssText = open
        ? ""
        : "display:flex;position:absolute;top:70px;right:0;left:0;flex-direction:column;background:#12244C;padding:16px 22px;gap:14px;z-index:60";
    };
    if (burger) burger.addEventListener("click", onBurger);

    // Pricing monthly/annual toggle
    const sw = document.getElementById("sw");
    const lblM = document.getElementById("lblM");
    const lblY = document.getElementById("lblY");
    const onSw = () => {
      const a = sw!.classList.toggle("annual");
      lblM?.classList.toggle("on", !a);
      lblY?.classList.toggle("on", a);
      document.querySelectorAll<HTMLElement>(".price span[data-m]").forEach((s) => {
        s.textContent = a ? (s.dataset.y ?? "") : (s.dataset.m ?? "");
      });
    };
    if (sw) sw.addEventListener("click", onSw);

    // FAQ accordion
    const faqHandlers: Array<[Element, () => void]> = [];
    document.querySelectorAll(".qa .q").forEach((q) => {
      const h = () => q.parentElement?.classList.toggle("open");
      q.addEventListener("click", h);
      faqHandlers.push([q, h]);
    });

    // Contact form (only present on the contact page — guarded by a textarea)
    const submitBtn = document.querySelector("button.btn-primary");
    const textarea = document.querySelector<HTMLTextAreaElement>(".textarea");
    const onSubmit = async (ev: Event) => {
      ev.preventDefault();
      const inputs = document.querySelectorAll<HTMLInputElement>(".input");
      const sel = document.querySelector<HTMLSelectElement>(".select");
      const body = {
        full_name: inputs[0]?.value ?? "",
        email: inputs[1]?.value ?? "",
        company: inputs[2]?.value ?? "",
        subject: sel?.value ?? "",
        message: textarea?.value ?? "",
      };
      if (!body.full_name || !body.email || !body.message) {
        window.alert("يرجى تعبئة الاسم والبريد والرسالة");
        return;
      }
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error();
        if (submitBtn) submitBtn.textContent = "تم الإرسال ✓";
        inputs.forEach((i) => (i.value = ""));
        if (sel) sel.value = "";
        if (textarea) textarea.value = "";
      } catch {
        window.alert("تعذّر الإرسال، حاول لاحقاً");
      }
    };
    if (submitBtn && textarea) submitBtn.addEventListener("click", onSubmit);

    return () => {
      w.removeEventListener("scroll", onScroll);
      io.disconnect();
      if (burger) burger.removeEventListener("click", onBurger);
      if (sw) sw.removeEventListener("click", onSw);
      faqHandlers.forEach(([q, h]) => q.removeEventListener("click", h));
      if (submitBtn && textarea) submitBtn.removeEventListener("click", onSubmit);
    };
  }, []);

  return <div className="wuduh-page" dangerouslySetInnerHTML={{ __html: html }} />;
}
