"use client";
import React, { useEffect, useState } from "react";

export default function Home() {
  // Use useState to ensure countdownEndTime and countdownText are set only once
  const [countdownEndTime] = useState(Date.now() + 10000); // 60 seconds from now
  const [countdownText] = useState("My test text but in a longer version");

  const calculatePercentage = () => {
    const now = new Date().getTime();
    const remainingTime = countdownEndTime - now;
    const percentageOfDay = remainingTime / 86400000; // 86,400,000 ms = 1 day

    // If the remaining time is zero or negative (countdown finished)
    if (remainingTime <= 0) {
      return "0000000";
    }

    // Ensure consistent rounding and string length
    const percentageRounded = (percentageOfDay * 10000000).toFixed(0);
    return percentageRounded.padStart(7, "0");
  };

  const [percentageString, setPercentageString] = useState(
    calculatePercentage()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPercentageString(calculatePercentage());
    }, 100);

    return () => clearInterval(interval);
  }, [countdownEndTime]);

  const [daysLeft, setDaysLeft] = useState(null);

  useEffect(() => {
    const calculateDaysLeft = () => {
      const daysLeftCalculated = Math.floor(
        (countdownEndTime - Date.now()) / 1000 / 60 / 60 / 24
      );
      setDaysLeft(daysLeftCalculated);
    };

    calculateDaysLeft();
  }, [countdownEndTime]);

  // Avoid rendering anything until daysLeft is calculated
  if (daysLeft === null) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-slate-800 bg-slate-100">
      <div>
        <div className="flex items-center justify-center">
          <div className="font-bold text-8xl">{daysLeft}</div>
          <div className="flex flex-col">
            <div className="text-3xl font-semibold font-mono">
              <span>.</span>
              <span>{percentageString}</span>
            </div>
            <div className="text-3xl text-slate-600 pl-4">days</div>
          </div>
        </div>
        <div className="text-3xl mt-5">{countdownText}</div>
      </div>
    </main>
  );
}
