"use client";

import React, { useState, useEffect } from "react";
import { ConfigProvider, Slider } from "antd";
import { DEFAULT_MAX, DEFAULT_MIN } from "@/features/jobsServices/constants";

export default function SalaryRangeFilter({
  minPlaceholder,
  maxPlaceholder,
  value,
  localValue,
  setLocalValue,
  onCommit,
  loading,
}: {
  minPlaceholder: string;
  maxPlaceholder: string;
  value: [number, number];
  localValue: [number, number];
  setLocalValue: (v: [number, number]) => void;
  onCommit: (min: number | null, max: number | null) => void;
  loading?: boolean;
}) {
  const [inputValues, setInputValues] = useState<[string, string]>([
    String(localValue[0] ?? ""),
    String(localValue[1] ?? ""),
  ]);

  useEffect(() => {
    setInputValues([
      localValue[0] === null || localValue[0] === undefined ? "" : String(localValue[0]),
      localValue[1] === null || localValue[1] === undefined ? "" : String(localValue[1]),
    ]);
  }, [localValue]);
  return (
    <div className="space-y-4 pt-4">
      <div className="px-2">
        <ConfigProvider theme={{ token: { colorPrimary: "#00664F", borderRadius: 2 } }}>
          <Slider
            range
            min={DEFAULT_MIN}
            max={DEFAULT_MAX}
            step={50}
            value={localValue}
            onChange={(values) => setLocalValue(values as [number, number])}
            onAfterChange={(values) => onCommit(values[0], values[1])}
            styles={{
              track: { backgroundColor: "#00664F" },
              handle: { borderColor: "#00664F" },
            }}
          />
        </ConfigProvider>
      </div>

      <div className="flex gap-4">
        <input
          className="w-full py-2.5 px-4 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:border-[#00664F]/30 placeholder:text-gray-400"
          placeholder={minPlaceholder}
          value={inputValues[0] || ""}
          onChange={(e) => {
            const v = e.target.value;
            if (/^\d*$/.test(v)) setInputValues([v, inputValues[1]]); // أرقام فقط
          }}
          onBlur={() => {
            const min = inputValues[0] === "" ? null : Number(inputValues[0]);
            const max = inputValues[1] === "" ? null : Number(inputValues[1]);
            // ممكن تعمل clamp هنا إذا تحب
            setLocalValue([min ?? DEFAULT_MIN, max ?? DEFAULT_MAX]);
            onCommit(min, max);
          }}
        />
        <input
          className="w-full py-2.5 px-4 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:border-[#00664F]/30 placeholder:text-gray-400"
          placeholder={maxPlaceholder}
          value={inputValues[1] || ""}
          onChange={(e) => {
            const v = e.target.value;
            if (/^\d*$/.test(v)) setInputValues([inputValues[0], v]);
          }}
          onBlur={() => {
            const min = inputValues[0] === "" ? null : Number(inputValues[0]);
            const max = inputValues[1] === "" ? null : Number(inputValues[1]);
            setLocalValue([min ?? DEFAULT_MIN, max ?? DEFAULT_MAX]);
            onCommit(min, max);
          }}
        />
      </div>

      {loading ? <div className="text-xs text-gray-400">Updating…</div> : null}
    </div>
  );
}
