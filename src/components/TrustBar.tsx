"use client";

import { User, MapPin, FileCheck2, Clock3 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const trustItems = [
  { icon: User, label: "Direct operator studio", detail: "One person, start to finish" },
  { icon: MapPin, label: "Based in Cincinnati, Ohio", detail: "US-based, direct access" },
  { icon: FileCheck2, label: "Written scope before any payment", detail: "No vague handoff" },
  { icon: Clock3, label: "Fit review within 1 business day", detail: "Fast, honest response" },
];

export default function TrustBar() {
  return (
    <section className="py-10 sm:py-14">
      <div className="section-shell">
        <ScrollReveal direction="blur">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {trustItems.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="flex flex-col gap-2">
                  <Icon size={20} className="text-[color:var(--accent)]" />
                  <p className="text-sm font-medium text-stone-200">{item.label}</p>
                  <p className="muted-copy text-xs">{item.detail}</p>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
