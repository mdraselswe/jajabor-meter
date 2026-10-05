import React from "react";
import { DIVISIONS } from "@/data/districts";
import { Layers, Compass } from "lucide-react";

interface DivisionFilterProps {
  activeDivision: string;
  onSelectDivision: (divEn: string) => void;
}

export default function DivisionFilter({
  activeDivision,
  onSelectDivision,
}: DivisionFilterProps) {
  return (
    <div className="w-full mb-4 overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 text-slate-400 text-xs font-semibold mr-1">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>বিভাগ:</span>
        </div>

        {DIVISIONS.map((div) => {
          const isActive = activeDivision === div.nameEn || (div.id === "all" && activeDivision === "All");

          return (
            <button
              key={div.id}
              onClick={() => onSelectDivision(div.nameEn)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 active:scale-95 ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-semibold"
                  : "bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800 hover:border-slate-700"
              }`}
            >
              {div.id === "all" && <Compass className="w-3 h-3 text-emerald-300" />}
              <span>{div.nameBn}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
