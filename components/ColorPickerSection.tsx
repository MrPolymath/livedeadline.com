import React, { useState, useEffect } from "react";

const COLOR_PRESETS = [
  {
    backgroundColor: "#F6F6EF",
    daysColor: "#f0652f",
    decimalsColor: "#fda942",
    daysTextColor: "#000000",
    deadlineTextColor: "#108AD2",
  },
  {
    backgroundColor: "#F1F5F9",
    daysColor: "#1E293B",
    decimalsColor: "#1E293B",
    daysTextColor: "#475569",
    deadlineTextColor: "#1E293B",
  },
  {
    backgroundColor: "#1a1a23",
    daysColor: "#00bfff",
    decimalsColor: "#b6dafb",
    daysTextColor: "#d9d9d9",
    deadlineTextColor: "#e8b65e",
  },
  {
    backgroundColor: "#fcf5e9",
    daysColor: "#A02334",
    decimalsColor: "#98641C",
    daysTextColor: "#D69251",
    deadlineTextColor: "#3EB87E",
  },
  {
    backgroundColor: "#f1faee",
    daysColor: "#1d3557",
    decimalsColor: "#457b9d",
    daysTextColor: "#a8dadc",
    deadlineTextColor: "#e63946",
  },
];

export default function ColorPickerSection({
  backgroundColor,
  setBackgroundColor,
  daysColor,
  setDaysColor,
  decimalsColor,
  setDecimalsColor,
  daysTextColor,
  setDaysTextColor,
  deadlineTextColor,
  setDeadlineTextColor,
}: {
  backgroundColor: string;
  setBackgroundColor: React.Dispatch<React.SetStateAction<string>>;
  daysColor: string;
  setDaysColor: React.Dispatch<React.SetStateAction<string>>;
  decimalsColor: string;
  setDecimalsColor: React.Dispatch<React.SetStateAction<string>>;
  daysTextColor: string;
  setDaysTextColor: React.Dispatch<React.SetStateAction<string>>;
  deadlineTextColor: string;
  setDeadlineTextColor: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

  // Set default colors based on the first preset
  useEffect(() => {
    applyPreset(COLOR_PRESETS[0]);
  }, []);

  const applyPreset = (preset: (typeof COLOR_PRESETS)[0], index?: number) => {
    setBackgroundColor(preset.backgroundColor);
    setDaysColor(preset.daysColor);
    setDecimalsColor(preset.decimalsColor);
    setDaysTextColor(preset.daysTextColor);
    setDeadlineTextColor(preset.deadlineTextColor);
    if (index !== undefined) {
      setSelectedPresetIndex(index);
    }
  };

  return (
    <div className="p-4 flex-grow">
      <h2 className="text-xl font-bold mb-4">Customize styles</h2>
      <div className="flex flex-wrap">
        <label className="block text-sm font-medium w-1/2 pr-2">
          Background Color
        </label>
        <input
          type="color"
          className="h-10 w-1/2 block bg-white cursor-pointer"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap mt-2">
        <label className="block text-sm font-medium w-1/2 pr-2">
          Days Color
        </label>
        <input
          type="color"
          className="h-10 w-1/2 block bg-white cursor-pointer"
          value={daysColor}
          onChange={(e) => setDaysColor(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap mt-2">
        <label className="block text-sm font-medium w-1/2 pr-2">
          Decimals Color
        </label>
        <input
          type="color"
          className="h-10 w-1/2 block bg-white cursor-pointer"
          value={decimalsColor}
          onChange={(e) => setDecimalsColor(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap mt-2">
        <label className="block text-sm font-medium w-1/2 pr-2">
          Days Text Color
        </label>
        <input
          type="color"
          className="h-10 w-1/2 block bg-white cursor-pointer"
          value={daysTextColor}
          onChange={(e) => setDaysTextColor(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap mt-2">
        <label className="block text-sm font-medium w-1/2 pr-2">
          Deadline Text Color
        </label>
        <input
          type="color"
          className="h-10 w-1/2 block bg-white cursor-pointer"
          value={deadlineTextColor}
          onChange={(e) => setDeadlineTextColor(e.target.value)}
        />
      </div>

      {/* Color Presets */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Color Presets</h2>
        <div className="flex justify-between">
          {COLOR_PRESETS.map((preset, index) => (
            <div
              key={index}
              className={`w-16 h-16 cursor-pointer border hover:scale-110 ${
                selectedPresetIndex === index
                  ? "border-blue-500 border-4 shadow-md scale-110"
                  : "border-gray-950"
              }`}
              onClick={() => applyPreset(preset, index)}
            >
              <div
                className="h-full w-full"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div
                  style={{
                    height: "50%",
                    backgroundColor: preset.backgroundColor,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    height: "50%",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "50%",
                      height: "100%",
                      backgroundColor: preset.daysColor,
                    }}
                  />
                  <div
                    style={{
                      width: "50%",
                      height: "100%",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        height: "50%",
                        backgroundColor: preset.decimalsColor,
                      }}
                    />
                    <div
                      style={{
                        height: "50%",
                        backgroundColor: preset.daysTextColor,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
