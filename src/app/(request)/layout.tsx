"use client";

import { usePathname } from "next/navigation";
import {
  QuoteProgressProvider,
  useQuoteProgress,
} from "@/context/QuoteProgressContext";
import ProgressBarMovingRequest from "@/components/common/progress-bar/ProgressBarMovingRequest";

function ProgressBar() {
  const { step } = useQuoteProgress();
  return <ProgressBarMovingRequest maxValue={3} currentValue={step} />;
}

export default function QuoteRequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QuoteProgressProvider>
      {/* ProgressBar 영역 */}
      <div className="flex flex-col max-w-[1400px] font-semibold px-5 py-8 mx-auto gap-6 sticky">
        견적 요청
        <ProgressBar />
      </div>

      {/* 전체 배경색이 적용되는 영역 */}
      <div className="bg-bg-200 min-h-screen w-full">
        <div className="max-w-[1400px] px-5 mx-auto">{children}</div>
      </div>
    </QuoteProgressProvider>
  );
}
