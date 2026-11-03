"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calculator, Layers, Ruler, Target } from "@/components/common/icons";
import { Reveal, SectionHeader } from "@/components/common/Primitives";
import { cn } from "@/lib/utils";

function ToolCard({ icon: Icon, title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-panel card-lift overflow-hidden rounded-2xl">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-4 p-5 text-left">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-gradient text-[#0a0805]">
          <Icon className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <h4 className="font-display text-lg font-bold text-[#f2f0eb]">{title}</h4>
          <div className="text-[11px] uppercase tracking-widest text-[#a19c8f]">
            {open ? "Collapse" : "Open Calculator"}
          </div>
        </div>
        <ArrowRight className={cn("h-5 w-5 text-[#f5c451] transition", open && "rotate-90")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[rgba(212,175,55,0.18)]"
          >
            <div className="p-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[#a19c8f]">
        {label}
      </span>
      <input
        inputMode="decimal"
        className="w-full rounded-lg border border-[rgba(212,175,55,0.25)] bg-[rgba(10,8,5,0.6)] px-3 py-2 text-sm text-[#f2f0eb] outline-none focus:border-[#f5c451]"
        {...props}
      />
    </label>
  );
}

function Result({ label, value }) {
  return (
    <div className="glass-panel rounded-lg px-3 py-2">
      <div className="text-[10px] uppercase tracking-widest text-[#a19c8f]">{label}</div>
      <div className="font-display text-base font-bold text-gold-gradient">{value}</div>
    </div>
  );
}

function PositionCalc() {
  const [cap, setCap] = useState("100000");
  const [risk, setRisk] = useState("1");
  const [entry, setEntry] = useState("100");
  const [stop, setStop] = useState("98");
  const capN = +cap || 0;
  const riskN = +risk || 0;
  const perShare = Math.abs((+entry || 0) - (+stop || 0));
  const riskAmt = (capN * riskN) / 100;
  const qty = perShare ? Math.floor(riskAmt / perShare) : 0;
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <Field label="Capital (₹)" value={cap} onChange={(e) => setCap(e.target.value)} />
      <Field label="Risk %" value={risk} onChange={(e) => setRisk(e.target.value)} />
      <Field label="Entry" value={entry} onChange={(e) => setEntry(e.target.value)} />
      <Field label="Stop Loss" value={stop} onChange={(e) => setStop(e.target.value)} />
      <Result label="Risk Amount" value={`₹${riskAmt.toLocaleString("en-IN")}`} />
      <Result label="Position Size" value={`${qty.toLocaleString("en-IN")} qty`} />
    </div>
  );
}

function RRCalc() {
  const [entry, setEntry] = useState("100");
  const [stop, setStop] = useState("98");
  const [target, setTarget] = useState("106");
  const risk = Math.abs((+entry || 0) - (+stop || 0));
  const reward = Math.abs((+target || 0) - (+entry || 0));
  const rr = risk ? (reward / risk).toFixed(2) : "0";
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <Field label="Entry" value={entry} onChange={(e) => setEntry(e.target.value)} />
      <Field label="Stop Loss" value={stop} onChange={(e) => setStop(e.target.value)} />
      <Field label="Target" value={target} onChange={(e) => setTarget(e.target.value)} />
      <Result label="Risk / Reward" value={`1 : ${rr}`} />
    </div>
  );
}

function PivotCalc() {
  const [h, setH] = useState("110");
  const [l, setL] = useState("100");
  const [c, setC] = useState("105");
  const H = +h || 0;
  const L = +l || 0;
  const C = +c || 0;
  const P = (H + L + C) / 3;
  const R1 = 2 * P - L;
  const S1 = 2 * P - H;
  const R2 = P + (H - L);
  const S2 = P - (H - L);
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <Field label="High" value={h} onChange={(e) => setH(e.target.value)} />
      <Field label="Low" value={l} onChange={(e) => setL(e.target.value)} />
      <Field label="Close" value={c} onChange={(e) => setC(e.target.value)} />
      <Result label="Pivot" value={P.toFixed(2)} />
      <Result label="R1 / R2" value={`${R1.toFixed(2)} / ${R2.toFixed(2)}`} />
      <Result label="S1 / S2" value={`${S1.toFixed(2)} / ${S2.toFixed(2)}`} />
    </div>
  );
}

function LotCalc() {
  const [cap, setCap] = useState("100000");
  const [price, setPrice] = useState("24800");
  const [lot, setLot] = useState("25");
  const margin = (+price || 0) * (+lot || 0) * 0.2; // rough intraday margin
  const lots = margin ? Math.floor((+cap || 0) / margin) : 0;
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <Field label="Capital (₹)" value={cap} onChange={(e) => setCap(e.target.value)} />
      <Field label="Instrument Price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <Field label="Lot Size" value={lot} onChange={(e) => setLot(e.target.value)} />
      <Result label="Est. Margin / Lot" value={`₹${margin.toLocaleString("en-IN")}`} />
      <Result label="Max Lots (Intraday)" value={`${lots}`} />
    </div>
  );
}

export default function Tools({ section }) {
  return (
    <section className="relative py-24">
      <SectionHeader eyebrow={section.eyebrow} title={section.title} gold={section.subtitle} />
      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-2">
        <Reveal>
          <ToolCard icon={Calculator} title="Position Size Calculator">
            <PositionCalc />
          </ToolCard>
        </Reveal>
        <Reveal delay={0.08}>
          <ToolCard icon={Target} title="Risk / Reward Calculator">
            <RRCalc />
          </ToolCard>
        </Reveal>
        <Reveal delay={0.16}>
          <ToolCard icon={Layers} title="Pivot Points Calculator">
            <PivotCalc />
          </ToolCard>
        </Reveal>
        <Reveal delay={0.24}>
          <ToolCard icon={Ruler} title="Lot Size Calculator">
            <LotCalc />
          </ToolCard>
        </Reveal>
      </div>
    </section>
  );
}
