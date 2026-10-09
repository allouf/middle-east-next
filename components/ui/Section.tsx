'use client';

import { useState } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

export default function SectionDrop({ title, children }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b py-4">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm font-semibold text-subTitleColor flex items-center justify-between w-full mb-2"
      >
        {title}
        <span className="ml-2">
          {open ? (
            <FiChevronUp className="w-5 h-5 text-textColor" />
          ) : (
            <FiChevronDown className="w-5 h-5 text-textColor" />
          )}
        </span>
      </button>

      {open && <div className="space-y-4 text-sm">{children}</div>}
    </div>
  );
}
