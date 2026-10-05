import React from "react";
import { District } from "@/data/districts";

interface DistrictPathProps {
  district: District;
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  onHover: (district: District, e: React.MouseEvent<SVGPathElement>) => void;
  onMove: (e: React.MouseEvent<SVGPathElement>) => void;
  onLeave: () => void;
  onClick: (district: District) => void;
}

// Division specific colors when selected
const DIVISION_COLORS: Record<string, { fill: string; stroke: string; glow: string }> = {
  Dhaka: { fill: "#10B981", stroke: "#059669", glow: "rgba(16, 185, 129, 0.4)" }, // Emerald
  Chattogram: { fill: "#3B82F6", stroke: "#2563EB", glow: "rgba(59, 130, 246, 0.4)" }, // Blue
  Rajshahi: { fill: "#F59E0B", stroke: "#D97706", glow: "rgba(245, 158, 11, 0.4)" }, // Amber
  Khulna: { fill: "#EC4899", stroke: "#DB2777", glow: "rgba(236, 72, 153, 0.4)" }, // Pink
  Barishal: { fill: "#06B6D4", stroke: "#0891B2", glow: "rgba(6, 182, 212, 0.4)" }, // Cyan
  Sylhet: { fill: "#84CC16", stroke: "#65A30D", glow: "rgba(132, 204, 22, 0.4)" }, // Lime
  Rangpur: { fill: "#8B5CF6", stroke: "#7C3AED", glow: "rgba(139, 92, 246, 0.4)" }, // Purple
  Mymensingh: { fill: "#F97316", stroke: "#EA580C", glow: "rgba(249, 115, 22, 0.4)" }, // Orange
};

export default function DistrictPath({
  district,
  isSelected,
  isHovered,
  isDimmed,
  onHover,
  onMove,
  onLeave,
  onClick,
}: DistrictPathProps) {
  const divisionStyle = DIVISION_COLORS[district.divisionEn] || DIVISION_COLORS.Dhaka;

  let fillColor = "#1E293B"; // Default slate dark
  let strokeColor = "#334155";
  let strokeWidth = 1.0;
  let opacity = 1.0;

  if (isSelected) {
    fillColor = divisionStyle.fill;
    strokeColor = "#F8FAFC";
    strokeWidth = 1.5;
  }

  if (isHovered) {
    fillColor = isSelected ? divisionStyle.stroke : "#334155";
    strokeColor = "#FCD34D"; // Amber highlight
    strokeWidth = 2.0;
  }

  if (isDimmed) {
    opacity = 0.35;
  }

  return (
    <path
      id={district.id}
      d={district.path}
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      opacity={opacity}
      className="cursor-pointer transition-all duration-150 ease-out hover:filter hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] active:scale-[0.99] origin-center outline-none focus:outline-none focus:ring-0 focus-visible:outline-none select-none"
      style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
      onMouseEnter={(e) => {
        if (
          typeof window !== "undefined" &&
          (window.innerWidth < 768 ||
            (window.matchMedia && !window.matchMedia("(hover: hover) and (pointer: fine)").matches))
        ) {
          return;
        }
        onHover(district, e);
      }}
      onMouseMove={(e) => {
        if (
          typeof window !== "undefined" &&
          (window.innerWidth < 768 ||
            (window.matchMedia && !window.matchMedia("(hover: hover) and (pointer: fine)").matches))
        ) {
          return;
        }
        onMove(e);
      }}
      onMouseLeave={onLeave}
      onClick={() => onClick(district)}
      role="button"
      aria-label={`${district.nameBn} জেলা`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(district);
        }
      }}
    />
  );
}
