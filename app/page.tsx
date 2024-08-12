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
    return <AlternateUI />;
  }
  if (d && !isValidDate) {
    return (
      <AlternateUI errorMessage="Invalid URL parameters. Please create a new url" />
    );
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
  const [dateValue, setDateValue] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [time, setTime] = useState<string>("00:00");
  const [description, setDescription] = useState<string>("");

  const handleDateChange = (newValue: {
    startDate: string | null;
    endDate: string | null;
  }) => {
    setDateValue(newValue);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTime(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleCreateUrl = () => {
    if (!dateValue.startDate) {
      alert("Please select a valid date.");
      return;
    }

    // Parse the selected date string into a Date object
    const selectedDate = new Date(dateValue.startDate);
    if (isNaN(selectedDate.getTime())) {
      alert("Invalid date selected.");
      return;
    }

    // Combine date and time
    const [hours, minutes] = time.split(":").map(Number);
    selectedDate.setHours(hours);
    selectedDate.setMinutes(minutes);
    selectedDate.setSeconds(0);
    selectedDate.setMilliseconds(0);

    // Encode date to base36
    const base36Date = selectedDate.getTime().toString(36);

    // URL encode the description
    const encodedDescription = encodeURIComponent(description || "");

    // Generate the URL
    const url = `${window.location.origin}/?d=${base36Date}&t=${encodedDescription}`;

    // Copy to clipboard
    navigator.clipboard
      .writeText(url)
      .then(() => alert("URL copied to clipboard!"))
      .catch(() => alert("Failed to copy URL."));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-slate-800 bg-slate-100">
      <h1 className="text-4xl font-bold">Create your own shareable URL</h1>
      {errorMessage && (
        <p className="text-xl mt-4 text-red-500">{errorMessage}</p>
      )}
      <p className="text-xl mt-4">1. Select a date:</p>
      <div className="max-w-64 mt-2">
        <Datepicker
          asSingle={true}
          useRange={false}
          value={dateValue}
          onChange={handleDateChange}
        />
      </div>
      <p className="text-xl mt-4">2. Select a specific time:</p>
      <p className="text-md">(optional, defaults to midnight if not set):</p>
      <input
        type="time"
        value={time}
        onChange={handleTimeChange}
        className="border border-gray-300 rounded-md p-2 mt-2"
      />
      <p className="text-xl mt-4">3. Add a description:</p>
      <input
        type="text"
        value={description}
        onChange={handleDescriptionChange}
        placeholder="e.g. My birthday"
        className="border border-gray-300 rounded-md p-2 mt-2"
      />
      <button
        onClick={handleCreateUrl}
        className="bg-blue-500 text-white rounded-md p-2 mt-4"
      >
        Create and copy URL
      </button>
    </main>
  );
}
