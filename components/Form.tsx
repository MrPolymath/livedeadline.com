"use client";

import React, { useState } from "react";
import Datepicker, {
  DateRangeType,
  DateValueType,
} from "react-tailwindcss-datepicker";
import LivePreview from "./LivePreview";
import ColorPickerSection from "./ColorPickerSection";

export default function Form() {
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
        <ColorPickerSection
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          daysColor={daysColor}
          setDaysColor={setDaysColor}
          decimalsColor={decimalsColor}
          setDecimalsColor={setDecimalsColor}
          daysTextColor={daysTextColor}
          setDaysTextColor={setDaysTextColor}
          deadlineTextColor={deadlineTextColor}
          setDeadlineTextColor={setDeadlineTextColor}
        />

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
