"use client";

import { useState, useMemo } from "react";
import Container from "@/components/Container";
import BranchesMap from "@/components/BranchesMap";
import { mockBranches, Branch } from "@/data/branchesData";

export default function BranchesPage() {
  const [branches] = useState<Branch[]>(mockBranches);
  const [activeRegion, setActiveRegion] = useState<"all" | "ulaanbaatar" | "aimag">("all");
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // Шүүлтүүр
  const filteredBranches = useMemo(() => {
    if (activeRegion === "ulaanbaatar") {
      return branches.filter((b) => b.province_name === "Улаанбаатар" || b.region_name === "Улаанбаатар");
    } else if (activeRegion === "aimag") {
      return branches.filter((b) => b.province_name !== "Улаанбаатар" && b.region_name !== "Улаанбаатар");
    }
    return branches;
  }, [activeRegion, branches]);

  return (
    <main className="min-h-screen bg-white">
      <Container>
        <div className="py-6 md:py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Салбарын байршил</h1>

          {/* Шүүлтүүр */}
          <div className="flex items-center gap-1 mb-8 border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => {
                setActiveRegion("all");
                setSelectedBranch(null);
              }}
              className={`px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px whitespace-nowrap ${activeRegion === "all"
                ? "text-teal-600 border-teal-600"
                : "text-gray-500 border-transparent hover:text-gray-900"
                }`}
            >
              Бүгд
            </button>
            <button
              onClick={() => {
                setActiveRegion("ulaanbaatar");
                setSelectedBranch(null);
              }}
              className={`px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px whitespace-nowrap ${activeRegion === "ulaanbaatar"
                ? "text-teal-600 border-teal-600"
                : "text-gray-500 border-transparent hover:text-gray-900"
                }`}
            >
              Улаанбаатар
            </button>
            <button
              onClick={() => {
                setActiveRegion("aimag");
                setSelectedBranch(null);
              }}
              className={`px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px whitespace-nowrap ${activeRegion === "aimag"
                ? "text-teal-600 border-teal-600"
                : "text-gray-500 border-transparent hover:text-gray-900"
                }`}
            >
              Орон нутаг
            </button>
          </div>

          {/* Loading / Error States */}
          {/* Контент */}
          <div className="space-y-6">
            {/* Google Map */}
            <div className="h-[300px] md:h-[400px] bg-gray-100 rounded-2xl overflow-hidden relative shadow-inner">
              <BranchesMap
                branches={filteredBranches}
                selectedBranch={selectedBranch}
                onSelect={setSelectedBranch}
              />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
