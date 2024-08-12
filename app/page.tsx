"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Datepicker, {
  DateRangeType,
  DateValueType,
} from "react-tailwindcss-datepicker";

export default function Countdown() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isValidParams, setIsValidParams] = useState(false);
  const [countdownEndTime, setCountdownEndTime] = useState<number | null>(null);
  const [countdownText, setCountdownText] = useState<string>("");
  const [percentageString, setPercentageString] = useState("0000000");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const d = searchParams.get("d");
    const t = searchParams.get("t");

    if (d && t) {
      const isValidDate = !isNaN(parseInt(d, 36));
      const decodedTime = isValidDate ? parseInt(d, 36) : null;

      if (decodedTime) {
        setCountdownEndTime(decodedTime);
        setCountdownText(decodeURIComponent(t));
        setIsValidParams(true);
      }
    }
    setLoading(false);
  }, [searchParams]);

  const calculatePercentage = () => {
    if (!countdownEndTime) return "0000000";
    const now = new Date().getTime();
    const remainingTime = countdownEndTime - now;
    const percentageOfDay = remainingTime / 86400000; // 86,400,000 ms = 1 day

    if (remainingTime <= 0) {
      return "0000000";
    }

    const percentageRounded = (percentageOfDay * 10000000).toFixed(0);
    return percentageRounded.padStart(7, "0");
  };

  useEffect(() => {
    if (countdownEndTime) {
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
    }
  }, [countdownEndTime]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 text-slate-800 bg-slate-100">
        {/* <div className="text-3xl">Loading...</div> */}
      </main>
    );
  }

  if (!isValidParams || daysLeft === null) {
    return <Form />;
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

function Form() {
  const [dateValue, setDateValue] = useState<DateRangeType>({
    startDate: null,
    endDate: null,
  });
  const [time, setTime] = useState<string>("00:00");
  const [description, setDescription] = useState<string>("");

  const handleDateChange = (newValue: DateValueType) => {
    if (newValue) {
      const { startDate, endDate } = newValue;
      setDateValue({ startDate, endDate });
    }
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTime(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const generateUrl = () => {
    if (!dateValue.startDate) {
      return "";
    }

    const selectedDate = new Date(dateValue.startDate);
    if (isNaN(selectedDate.getTime())) {
      return "Invalid date selected.";
    }

    const [hours, minutes] = time.split(":").map(Number);
    selectedDate.setHours(hours);
    selectedDate.setMinutes(minutes);
    selectedDate.setSeconds(0);
    selectedDate.setMilliseconds(0);

    const base36Date = selectedDate.getTime().toString(36);
    const encodedDescription = encodeURIComponent(description || "");

    return `${window.location.origin}/?d=${base36Date}&t=${encodedDescription}`;
  };

  const urlPreview = generateUrl();

  const handleCopyUrl = () => {
    if (urlPreview) {
      navigator.clipboard.writeText(urlPreview);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-slate-800 bg-slate-100">
      <h1 className="text-4xl font-bold">Create your own shareable URL</h1>
      <p className="text-xl mt-4">1. Select a date:</p>
      <div className="w-full md:w-96 mt-2">
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
        className="border border-gray-300 rounded-md p-2 mt-2 w-full md:w-96"
      />
      <p className="text-xl mt-4">3. Add a description:</p>
      <input
        type="text"
        value={description}
        onChange={handleDescriptionChange}
        placeholder="e.g. My birthday"
        className="border border-gray-300 rounded-md p-2 mt-2 md:w-96 cursor-copy"
      />

      {urlPreview && (
        <div className="mt-8">
          <p className="text-m">Click to copy:</p>
          <div className="flex items-center mt-2">
            <input
              onClick={handleCopyUrl}
              type="text"
              value={urlPreview}
              readOnly
              className="border border-gray-300 rounded-md p-2 w-full md:w-96 cursor-copy"
            />
          </div>
        </div>
      )}
      <div className="fixed bottom-0 left-0 right-0 p-4 text-center text-gray-500">
        Created by{" "}
        <a
          href="https://www.linkedin.com/in/danielcarmonaserrat/"
          className="underline"
          target="_blank"
        >
          Daniel Carmona Serrat
        </a>
      </div>
    </main>
  );
}
