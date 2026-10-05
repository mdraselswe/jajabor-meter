"use client";

import React, { useState, useMemo, useRef } from "react";
import { DISTRICTS, District, DIVISIONS } from "@/data/districts";
import { DISTRICT_CENTERS } from "@/data/districtCenters";
import { matchesDistrictSearch } from "@/utils/districtSearch";
import DistrictPath from "./DistrictPath";
import DistrictTooltip from "./DistrictTooltip";
import DivisionFilter from "./DivisionFilter";
import { toBn } from "@/utils/bengaliDigits";
import { 
  RotateCcw, 
  Search, 
  MapPin, 
  Sparkles,
  Compass,
  CheckCircle2,
  LayoutGrid,
  Map as MapIcon,
  Utensils
} from "lucide-react";

interface BangladeshMapProps {
  selectedDistrictIds: string[];
  onToggleDistrict: (district: District) => void;
  onResetDistricts: () => void;
}

export default function BangladeshMap({
  selectedDistrictIds,
  onToggleDistrict,
  onResetDistricts,
}: BangladeshMapProps) {
  const [viewMode, setViewMode] = useState<"map" | "grid">("map");
  const [activeDivision, setActiveDivision] = useState<string>("All");
  const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showDistrictNames, setShowDistrictNames] = useState<boolean>(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Filter districts based on division and search (supports English & Bangla)
  const filteredDistricts = useMemo(() => {
    return DISTRICTS.filter((d) => {
      const matchesDivision =
        activeDivision === "All" || d.divisionEn === activeDivision;
      const matchesSearch = matchesDistrictSearch(d, searchQuery);
      return matchesDivision && matchesSearch;
    });
  }, [activeDivision, searchQuery]);

  const isTouchDevice = () => {
    if (typeof window === "undefined") return false;
    return (
      window.innerWidth < 768 ||
      (window.matchMedia && !window.matchMedia("(hover: hover) and (pointer: fine)").matches)
    );
  };

  const handleHover = (district: District, e: React.MouseEvent<SVGPathElement>) => {
    if (isTouchDevice()) return;
    setHoveredDistrict(district);
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  const handleMove = (e: React.MouseEvent<SVGPathElement>) => {
    if (isTouchDevice()) return;
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  const handleLeave = () => {
    setHoveredDistrict(null);
    setTooltipPos(null);
  };

  const selectedCount = selectedDistrictIds.length;
  const percentage = Math.round((selectedCount / 64) * 100);

  return (
    <div
      ref={mapContainerRef}
      className="w-full flex flex-col bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl relative"
    >
      {/* Top Controls Header */}
      <div className="flex flex-col gap-3.5 mb-4">
        {/* Division Filter Bar */}
        <DivisionFilter
          activeDivision={activeDivision}
          onSelectDivision={setActiveDivision}
        />

        {/* View Switcher & Search Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Quick Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="জেলা খুঁজুন (যেমন: Sylhet, বগুড়া, Chittagong)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Mode Switcher: Map vs Grid */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setViewMode("map")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  viewMode === "map"
                    ? "bg-emerald-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>ম্যাপ ভিউ</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  viewMode === "grid"
                    ? "bg-emerald-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
                title="ম্যাপ না চিনলে সরাসরি জেলা তালিকা থেকে সিলেক্ট করুন"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>জেলা তালিকা</span>
              </button>
            </div>

            {/* District names visibility toggle */}
            {viewMode === "map" && (
              <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white cursor-pointer select-none transition">
                <input
                  type="checkbox"
                  checked={showDistrictNames}
                  onChange={(e) => setShowDistrictNames(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
                />
                <span className="hidden sm:inline">জেলার নাম</span>
              </label>
            )}

            {/* Counter */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                <strong className="text-white font-extrabold">{toBn(selectedCount)}</strong> / ৬৪
              </span>
              <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">
                {toBn(percentage)}%
              </span>
            </div>

            {selectedCount > 0 && (
              <button
                onClick={onResetDistricts}
                title="ম্যাপ রিসেট করুন"
                className="inline-flex items-center gap-1 p-2 sm:px-3 sm:py-2 rounded-2xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 border border-slate-700 text-xs text-slate-300 transition active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">রিসেট</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Instant Search Results Chips if typing */}
      {searchQuery.trim() !== "" && (
        <div className="mb-3 p-3 bg-slate-950/90 rounded-2xl border border-emerald-500/30 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">অনুসন্ধান ফলাফল:</span>
          {filteredDistricts.length === 0 ? (
            <span className="text-xs text-rose-400">কোনো জেলা পাওয়া যায়নি!</span>
          ) : (
            filteredDistricts.slice(0, 8).map((d) => {
              const isSelected = selectedDistrictIds.includes(d.id);
              return (
                <button
                  key={d.id}
                  onClick={() => onToggleDistrict(d)}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition active:scale-95 ${
                    isSelected
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"
                  }`}
                >
                  <span>{d.nameBn}</span>
                  {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                </button>
              );
            })
          )}
        </div>
      )}

      {/* VIEW MODE 1: Interactive SVG Map */}
      {viewMode === "map" && (
        <div className="relative w-full aspect-[600/740] max-h-[700px] flex items-center justify-center overflow-hidden rounded-2xl bg-slate-950/60 border border-slate-800/80 p-2">
          <svg
            viewBox="0 0 600 760"
            className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)] outline-none focus:outline-none select-none"
            style={{ outline: "none" }}
            preserveAspectRatio="xMidYMid meet"
          >
            <g id="bangladesh-districts">
              {DISTRICTS.map((district) => {
                const isSelected = selectedDistrictIds.includes(district.id);
                const isHovered = hoveredDistrict?.id === district.id;
                const isDimmed =
                  (activeDivision !== "All" && district.divisionEn !== activeDivision) ||
                  !matchesDistrictSearch(district, searchQuery);

                return (
                  <DistrictPath
                    key={district.id}
                    district={district}
                    isSelected={isSelected}
                    isHovered={isHovered}
                    isDimmed={isDimmed}
                    onHover={handleHover}
                    onMove={handleMove}
                    onLeave={handleLeave}
                    onClick={onToggleDistrict}
                  />
                );
              })}
            </g>

            {/* Selected District Labels & Pins on the Map */}
            <g id="selected-district-labels" className="pointer-events-none select-none">
              {selectedDistrictIds.map((id) => {
                const center = DISTRICT_CENTERS[id];
                if (!center) return null;
                const district = DISTRICTS.find((d) => d.id === id);
                const displayNameBn = district?.nameBn || center.nameBn;

                return (
                  <g key={`map-label-${id}`}>
                    <circle
                      cx={center.x}
                      cy={center.y - (showDistrictNames ? 6 : 0)}
                      r={showDistrictNames ? "3.5" : "3"}
                      fill="#F59E0B"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                    {showDistrictNames && (
                      <text
                        x={center.x}
                        y={center.y + 7}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#FFFFFF"
                        stroke="#022c22"
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                        paintOrder="stroke fill"
                        fontSize="11"
                        fontWeight="900"
                      >
                        {displayNameBn}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Floating Mini Compass Watermark */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-medium pointer-events-none">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>সোনার বাংলা ম্যাপ (ক্লিক করে সিলেক্ট করুন)</span>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: District List Grid (For users unfamiliar with map) */}
      {viewMode === "grid" && (
        <div className="w-full max-h-[640px] overflow-y-auto pr-1 rounded-2xl bg-slate-950/50 p-3 border border-slate-800">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {filteredDistricts.map((d) => {
              const isSelected = selectedDistrictIds.includes(d.id);

              return (
                <div
                  key={d.id}
                  onClick={() => onToggleDistrict(d)}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all duration-150 active:scale-[0.97] select-none flex flex-col justify-between ${
                    isSelected
                      ? "bg-emerald-950/60 border-emerald-500/80 text-emerald-100 shadow-md"
                      : "bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-850"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-extrabold text-sm text-white">
                      {d.nameBn}
                    </span>
                    <span
                      className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                        isSelected
                          ? "bg-emerald-500 border-emerald-500 text-slate-950 font-black"
                          : "border-slate-700 bg-slate-800"
                      }`}
                    >
                      {isSelected && "✓"}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 font-medium">
                    বিভাগ: {d.divisionBn}
                  </span>

                  <div className="text-[11px] text-amber-300/90 font-medium mt-1 truncate flex items-center gap-1">
                    <Utensils className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{d.food}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Tooltip (Map View) */}
      {viewMode === "map" && (
        <DistrictTooltip
          district={hoveredDistrict}
          isSelected={hoveredDistrict ? selectedDistrictIds.includes(hoveredDistrict.id) : false}
          position={tooltipPos}
        />
      )}
    </div>
  );
}
