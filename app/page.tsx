"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Datepicker from "react-tailwindcss-datepicker";

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
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: null,
  });

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center md:p-24 p-8 text-slate-800 bg-slate-100">
      <h1 className="text-4xl font-bold mb-12 text-center">
        Create your own shareable url
      </h1>
      {/* <p className="text-xl mt-4">
        {errorMessage ??
          "Please provide both `d` and `t` query parameters in the URL."}
      </p> */}
      <p className="text-xl mt-4">1. Select a date:</p>
      <div className="max-w-64 mt-2">
        <Datepicker
          asSingle={true}
          value={value}
          onChange={handleValueChange}
        />
      </div>
      <p className="text-xl mt-8">2. Select a specific time:</p>
      <p className="text-md">(optional, if not, defaults to midnight):</p>
      <input
        type="time"
        className="border border-gray-300 rounded-md p-2 mt-2"
      />
      <p className="text-xl mt-8">3. Add a description:</p>
      <input
        type="text"
        placeholder="e.g. My birthday"
        className="border border-gray-300 rounded-md p-2 mt-2"
      />
      <button className="bg-blue-500 text-white rounded-md p-2 mt-4">
        Create and copy URL
      </button>
    </main>
  );
}
