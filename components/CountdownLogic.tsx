"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Form from "./Form";

export default function CountdownLogic() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isValidParams, setIsValidParams] = useState(false);
  const [countdownEndTime, setCountdownEndTime] = useState<number | null>(null);
  const [countdownText, setCountdownText] = useState<string>("");
  const [percentageString, setPercentageString] = useState("0000000");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  const [backgroundColor, setBackgroundColor] = useState<string>("#f1f5f9");
  const [daysColor, setDaysColor] = useState<string>("#1E293B");
  const [decimalsColor, setDecimalsColor] = useState<string>("#1E293B");
  const [daysTextColor, setDaysTextColor] = useState<string>("#475569");
  const [deadlineTextColor, setDeadlineTextColor] = useState<string>("#1E293B");

  const [sheetUrl, setSheetUrl] = useState<string | null>(null);

  useEffect(() => {
    const d = searchParams.get("d");
    const t = searchParams.get("t");
    const sheet = searchParams.get("sheet");
    console.log(sheet);
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

    if (bg) setBackgroundColor(`#${bg}`);
    if (dc) setDaysColor(`#${dc}`);
    if (dd) setDecimalsColor(`#${dd}`);
    if (dt) setDaysTextColor(`#${dt}`);
    if (dl) setDeadlineTextColor(`#${dl}`);

    if (sheet) {
      const decodedSheetUrl = decodeURIComponent(sheet);
      const modifiedSheetUrl = `${decodedSheetUrl}&rm=minimal`;
      setSheetUrl(modifiedSheetUrl);
    }

    setLoading(false);
  }, [searchParams]);

  const calculatePercentage = useCallback(() => {
    if (!countdownEndTime) return "0000000";
    const now = new Date().getTime();
    const remainingTime = countdownEndTime - now;

    if (remainingTime <= 0) {
      return "0000000";
    }

    const remainingTimeInCurrentDay = remainingTime % 86400000;

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

  // Define font sizes conditionally
  const daysFontSize = sheetUrl ? "12rem" : "6rem"; // Adjust to your needs
  const percentageFontSize = sheetUrl ? "4rem" : "1.5rem";
  const daysTextFontSize = sheetUrl ? "4rem" : "1.5rem";
  const countdownTextFontSize = sheetUrl ? "4rem" : "1.5rem";

  return (
    <main
      className={`flex min-h-screen ${
        sheetUrl ? "flex-row p-0" : "flex-col p-24 justify-center"
      }`}
      style={{ backgroundColor }}
    >
      {sheetUrl && (
        <div className="w-1/2 h-screen">
          <iframe
            src={sheetUrl}
            className="w-full h-full"
            frameBorder="0"
          ></iframe>
        </div>
      )}
      <div
        className={`flex flex-col items-center justify-center ${
          sheetUrl ? "w-1/2" : "w-full"
        }`}
      >
        <div className="flex items-center justify-center">
          <div
            className="font-bold"
            style={{ color: daysColor, fontSize: daysFontSize }}
          >
            {daysLeft}
          </div>
          <div className="flex flex-col">
            <div
              className="font-semibold font-mono"
              style={{ color: decimalsColor, fontSize: percentageFontSize }}
            >
              <span>.</span>
              <span>{percentageString}</span>
            </div>
            <div
              className="pl-4"
              style={{ color: daysTextColor, fontSize: daysTextFontSize }}
            >
              days
            </div>
          </div>
        </div>
        <div
          style={{ color: deadlineTextColor, fontSize: countdownTextFontSize }}
          className=""
        >
          {countdownText}
        </div>
      </div>
    </main>
  );
}
