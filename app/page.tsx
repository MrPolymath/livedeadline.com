"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();

  const d = searchParams.get("d"); // Get the 'd' query parameter
  // validate that d is in base36, decode and check that it's a valid date
  // if not, render an error message
  const isValidDate = d && !isNaN(parseInt(d, 36));
  const t = searchParams.get("t"); // Get the 't' query parameter

  // If the query parameters are missing, render a different UI
  if (!d || !t) {
    if (!isValidDate) {
      return <AlternateUI errorMessage="Invalid date string" />;
    }
    return <AlternateUI />;
  }

  // Decode the 'd' parameter from base36
  const decodedTime = parseInt(d, 36);

  // Use the decoded time and query text as the initial states
  const [countdownEndTime] = useState(decodedTime);
  const [countdownText] = useState(decodeURIComponent(t));

  const calculatePercentage = () => {
    const now = new Date().getTime();
    const remainingTime = countdownEndTime - now;
    const percentageOfDay = remainingTime / 86400000; // 86,400,000 ms = 1 day

    if (remainingTime <= 0) {
      return "0000000";
    }

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

  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const calculateDaysLeft = () => {
      const daysLeftCalculated = Math.floor(
        (countdownEndTime - Date.now()) / 1000 / 60 / 60 / 24
      );
      setDaysLeft(daysLeftCalculated);
    };

    calculateDaysLeft();
  }, [countdownEndTime]);

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

function AlternateUI({ errorMessage }: { errorMessage?: string }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-slate-800 bg-slate-100">
      <h1 className="text-4xl font-bold">Missing Parameters</h1>
      <p className="text-xl mt-4">
        {errorMessage ??
          "Please provide both `d` and `t` query parameters in the URL."}
      </p>
    </main>
  );
}
