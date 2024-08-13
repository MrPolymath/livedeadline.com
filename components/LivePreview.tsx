"use client";

import React, { useEffect, useState } from "react";

export default function LivePreview({
  backgroundColor,
  daysColor,
  decimalsColor,
  daysTextColor,
  deadlineTextColor,
}: {
  backgroundColor: string;
  daysColor: string;
  decimalsColor: string;
  daysTextColor: string;
  deadlineTextColor: string;
}) {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [percentageString, setPercentageString] = useState("0000000");

  useEffect(() => {
    const now = new Date();
    const nextFriday = new Date();
    nextFriday.setDate(now.getDate() + ((12 - now.getDay()) % 7));
    nextFriday.setHours(24, 0, 0, 0);

    const countdownEndTime = nextFriday.getTime();

    const calculatePercentage = () => {
      const now = new Date().getTime();
      const remainingTime = countdownEndTime - now;

      if (remainingTime <= 0) {
        return "0000000";
      }

      const remainingTimeInCurrentDay = remainingTime % 86400000;
      const percentageOfDay = remainingTimeInCurrentDay / 86400000;
      const percentageRounded = (percentageOfDay * 10000000).toFixed(0);

      return percentageRounded.padStart(7, "0");
    };

    setPercentageString(calculatePercentage());

    const interval = setInterval(() => {
      setPercentageString(calculatePercentage());
    }, 100);

    const calculateDaysLeft = () => {
      const daysLeftCalculated = Math.floor(
        (countdownEndTime - Date.now()) / 1000 / 60 / 60 / 24
      );
      setDaysLeft(daysLeftCalculated);
    };

    calculateDaysLeft();

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex md:min-h-[50%] flex-col items-center justify-center p-6 relative min-h-[300px]"
      style={{ backgroundColor }}
    >
      <div className="absolute top-4 left-4 text-sm">Custom preview</div>
      {daysLeft !== null && (
        <>
          <div className="flex items-center justify-center">
            <div className="font-bold text-6xl" style={{ color: daysColor }}>
              {daysLeft}
            </div>
            <div className="flex flex-col">
              <div
                className="text-xl font-semibold font-mono"
                style={{ color: decimalsColor }}
              >
                <span>.</span>
                <span>{percentageString}</span>
              </div>
              <div className="text-xl pl-2" style={{ color: daysTextColor }}>
                days
              </div>
            </div>
          </div>
          <div className="text-xl mt-3" style={{ color: deadlineTextColor }}>
            until next Friday
          </div>
        </>
      )}
    </div>
  );
}
