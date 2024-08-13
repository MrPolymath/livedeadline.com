"use client";

import React, { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Datepicker, {
  DateRangeType,
  DateValueType,
} from "react-tailwindcss-datepicker";

// Separate your main Countdown logic into a component that will be Suspended
function CountdownLogic() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isValidParams, setIsValidParams] = useState(false);
  const [countdownEndTime, setCountdownEndTime] = useState<number | null>(null);
  const [countdownText, setCountdownText] = useState<string>("");
  const [percentageString, setPercentageString] = useState("0000000");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  // State for colors
  const [backgroundColor, setBackgroundColor] = useState<string>("#f1f5f9");
  const [daysColor, setDaysColor] = useState<string>("#1E293B");
  const [decimalsColor, setDecimalsColor] = useState<string>("#1E293B");
  const [daysTextColor, setDaysTextColor] = useState<string>("#475569");
  const [deadlineTextColor, setDeadlineTextColor] = useState<string>("#1E293B");

  useEffect(() => {
    const d = searchParams.get("d");
    const t = searchParams.get("t");

    const bg = searchParams.get("bg");
    const dc = searchParams.get("dc");
    const dd = searchParams.get("dd");
    const dt = searchParams.get("dt");
    const dl = searchParams.get("dl");

    if (d && t) {
      const isValidDate = !isNaN(parseInt(d, 36));
      const decodedTime = isValidDate ? parseInt(d, 36) : null;

      if (decodedTime) {
        setCountdownEndTime(decodedTime);
        setCountdownText(decodeURIComponent(t));
        setIsValidParams(true);
      }
    }

    // Set colors if they exist in the URL
    if (bg) setBackgroundColor(`#${bg}`);
    if (dc) setDaysColor(`#${dc}`);
    if (dd) setDecimalsColor(`#${dd}`);
    if (dt) setDaysTextColor(`#${dt}`);
    if (dl) setDeadlineTextColor(`#${dl}`);

    setLoading(false);
  }, [searchParams]);

  const calculatePercentage = useCallback(() => {
    if (!countdownEndTime) return "0000000";
    const now = new Date().getTime();
    const remainingTime = countdownEndTime - now;

    if (remainingTime <= 0) {
      return "0000000";
    }

    // Calculate the time left in the current day (remainder of the 24h period)
    const remainingTimeInCurrentDay = remainingTime % 86400000; // 86,400,000 ms = 1 day

    // Calculate the percentage of the day that has passed
    const percentageOfDay = remainingTimeInCurrentDay / 86400000;
    const percentageRounded = (percentageOfDay * 10000000).toFixed(0);

    return percentageRounded.padStart(7, "0");
  }, [countdownEndTime]);

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
  }, [countdownEndTime, calculatePercentage]);

  if (loading) {
    return (
      <main
        className="flex min-h-screen flex-col items-center justify-center p-24"
        style={{ backgroundColor }}
      ></main>
    );
  }

  if (!isValidParams || daysLeft === null) {
    return <Form />;
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-24"
      style={{ backgroundColor }}
    >
      <div>
        <div className="flex items-center justify-center">
          <div className="font-bold text-8xl" style={{ color: daysColor }}>
            {daysLeft}
          </div>
          <div className="flex flex-col">
            <div
              className="text-3xl font-semibold font-mono"
              style={{ color: decimalsColor }}
            >
              <span>.</span>
              <span>{percentageString}</span>
            </div>
            <div className="text-3xl pl-4" style={{ color: daysTextColor }}>
              days
            </div>
          </div>
        </div>
        <div className="text-3xl mt-5" style={{ color: deadlineTextColor }}>
          {countdownText}
        </div>
      </div>
    </main>
  );
}

export default function Countdown() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CountdownLogic />
    </Suspense>
  );
}

// LivePreview component
function LivePreview({
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
    // Calculate the next Friday midnight
    const now = new Date();
    const nextFriday = new Date();
    nextFriday.setDate(now.getDate() + ((12 - now.getDay()) % 7)); // Get the next Friday
    nextFriday.setHours(24, 0, 0, 0); // Set to midnight

    const countdownEndTime = nextFriday.getTime();

    const calculatePercentage = () => {
      const now = new Date().getTime();
      const remainingTime = countdownEndTime - now;

      if (remainingTime <= 0) {
        return "0000000";
      }

      const remainingTimeInCurrentDay = remainingTime % 86400000; // 86,400,000 ms = 1 day
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
      className="flex min-h-[50%] flex-col items-center justify-center p-6 relative"
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

function Form() {
  const [dateValue, setDateValue] = useState<DateRangeType>({
    startDate: null,
    endDate: null,
  });
  const [time, setTime] = useState<string>("00:00");
  const [description, setDescription] = useState<string>("");

  const [backgroundColor, setBackgroundColor] = useState("#f1f5f9");
  const [daysColor, setDaysColor] = useState("#000000");
  const [decimalsColor, setDecimalsColor] = useState("#000000");
  const [daysTextColor, setDaysTextColor] = useState("#000000");
  const [deadlineTextColor, setDeadlineTextColor] = useState("#000000");

  const [isCopied, setIsCopied] = useState(false);

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

    const queryParams = new URLSearchParams({
      d: base36Date,
      t: encodedDescription,
      ...(backgroundColor !== "#f1f5f9" && {
        bg: backgroundColor.slice(1),
      }),
      ...(daysColor !== "#000000" && {
        dc: daysColor.slice(1),
      }),
      ...(decimalsColor !== "#000000" && {
        dd: decimalsColor.slice(1),
      }),
      ...(daysTextColor !== "#000000" && {
        dt: daysTextColor.slice(1),
      }),
      ...(deadlineTextColor !== "#000000" && {
        dl: deadlineTextColor.slice(1),
      }),
    });

    return `${window.location.origin}/?${queryParams.toString()}`;
  };

  const urlPreview = generateUrl();

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      <div className="md:min-h-screen flex flex-col md:items-center md:justify-center md:p-24 p-12 text-slate-800 bg-slate-100 md:w-2/3">
        <h1 className="text-2xl md:text-4xl font-bold">
          Create your own live deadline link
        </h1>
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
        <p className="text-sm">(optional, defaults to midnight if not set):</p>
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
          placeholder="e.g. My super important event"
          className="border border-gray-300 rounded-md p-2 mt-2 md:w-96"
        />

        {urlPreview && description.length > 0 && (
          <div className="mt-8 w-full md:w-96">
            <a
              className="block text-center bg-blue-500 text-white rounded-md p-2 cursor-pointer"
              href={urlPreview}
              target="_blank"
            >
              Open countdown
            </a>
          </div>
        )}
      </div>

      <div className="md:fixed md:h-full md:right-0 md:top-0 md:w-1/3 bg-white md:shadow-lg flex flex-col">
        {/* Top half for color pickers */}
        <div className="p-4 flex-grow">
          <h2 className="text-xl font-bold mb-4">Customize styles</h2>
          <label className="block text-sm font-medium">Background Color</label>
          <input
            type="color"
            className="h-10 w-full block bg-white cursor-pointer"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
          <label className="block text-sm font-medium mt-2">Days Color</label>
          <input
            type="color"
            className="h-10 w-full block bg-white cursor-pointer"
            value={daysColor}
            onChange={(e) => setDaysColor(e.target.value)}
          />
          <label className="block text-sm font-medium mt-2">
            Decimals Color
          </label>
          <input
            type="color"
            className="h-10 w-full block bg-white cursor-pointer"
            value={decimalsColor}
            onChange={(e) => setDecimalsColor(e.target.value)}
          />
          <label className="block text-sm font-medium mt-2">
            Days Text Color
          </label>
          <input
            type="color"
            className="h-10 w-full block bg-white cursor-pointer"
            value={daysTextColor}
            onChange={(e) => setDaysTextColor(e.target.value)}
          />
          <label className="block text-sm font-medium mt-2">
            Deadline Text Color
          </label>
          <input
            type="color"
            className="h-10 w-full block bg-white cursor-pointer"
            value={deadlineTextColor}
            onChange={(e) => setDeadlineTextColor(e.target.value)}
          />
        </div>

        {/* Bottom half for live preview */}
        <LivePreview
          backgroundColor={backgroundColor}
          daysColor={daysColor}
          decimalsColor={decimalsColor}
          daysTextColor={daysTextColor}
          deadlineTextColor={deadlineTextColor}
        />
      </div>

      <div className="fixed bottom-0 left-0 p-4 pl-6 text-gray-500">
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
