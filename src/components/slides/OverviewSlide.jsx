import React from "react";
import { presentationData } from "../../data/mockData";

export default function OverviewSlide() {
  const { logo, goal, metrics } = presentationData;

  return (
    <div className="max-w-6xl mx-auto px-8 py-16 animate-in fade-in duration-500">
      <div className="flex flex-col items-center text-center space-y-12">
        {/* Company Logo - smaller */}
        <div className="h-12 flex items-center justify-center">
          <img
            src={logo}
            alt="Company Logo"
            className="h-full object-contain opacity-80"
          />
        </div>

        {/* Workshop Goal - wider for better readability */}
        <div className="max-w-4xl">
          <p className="text-4xl font-semibold tracking-tight text-[#1F2937] leading-tight">
            {goal}
          </p>
        </div>

        {/* Metrics Strip - 3 cards, no hover, no shadow, flat UI */}
        <div className="w-full grid grid-cols-3 gap-6 mt-8">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="bg-white border border-[#EEF0EA] rounded-[20px] p-8 flex flex-col items-center justify-center space-y-2"
            >
              <span className="text-3xl font-bold text-[#1F2937]">
                {m.value}
              </span>
              <span className="text-sm font-medium text-[#9CA3AF] uppercase tracking-wider">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
