import clsx from "clsx";

interface ProgressBarProps {
  maxValue: number;
  currentValue: number;
  frameClass: string;
  barClass: string;
}

export default function ProgressBar({
  maxValue,
  currentValue,
  frameClass,
  barClass,
}: ProgressBarProps) {
  const progressBarframeClass = clsx(
    "box-border flex flex-row justify-left",
    "rounded-full bg-bg-300",
    "overflow-hidden",
    frameClass
  );
  const progressBarClass = clsx(
    "h-full",
    "rounded-full bg-pr-yellow-100",
    "z-10",
    barClass
  );

  const progressPercentage = Math.min((currentValue / maxValue) * 100, 100);

  return (
    <div className={progressBarframeClass}>
      <div
        className={progressBarClass}
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
}
