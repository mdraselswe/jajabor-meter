import React from "react";
import CompareSkeleton from "@/components/skeletons/CompareSkeleton";

export default function CompareLoading() {
  return (
    <div className="min-h-screen py-10 px-4">
      <CompareSkeleton />
    </div>
  );
}
