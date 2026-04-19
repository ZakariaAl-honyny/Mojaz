"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SovereignJourneyOverlay } from "./SovereignJourneyOverlay";
import { Activity, ClipboardCheck, ArrowUpRight } from "lucide-react";
import { AnimatePresence } from "framer-motion";

interface JourneySimulatorTriggerProps {
  applicationId: string;
}

export function JourneySimulatorTrigger({ applicationId }: JourneySimulatorTriggerProps) {
  const [activeSimulator, setActiveSimulator] = useState<"medical" | "theory" | null>(null);

  return (
    <div className="flex gap-4">
      <Button 
        onClick={() => setActiveSimulator("medical")}
        className="h-14 px-8 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 hover:border-white/20 transition-all gap-3 uppercase tracking-widest text-xs"
      >
        <Activity className="w-4 h-4 text-primary-400" />
        Launch Medical
        <ArrowUpRight className="w-4 h-4 opacity-40" />
      </Button>

      <Button 
        onClick={() => setActiveSimulator("theory")}
        className="h-14 px-8 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 hover:border-white/20 transition-all gap-3 uppercase tracking-widest text-xs"
      >
        <ClipboardCheck className="w-4 h-4 text-primary-400" />
        Launch Theory
        <ArrowUpRight className="w-4 h-4 opacity-40" />
      </Button>

      <AnimatePresence>
        {activeSimulator && (
          <SovereignJourneyOverlay 
            type={activeSimulator}
            applicationId={applicationId}
            onClose={() => setActiveSimulator(null)}
            onSuccess={() => {
              alert("Sovereign Validation Complete");
              setActiveSimulator(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
