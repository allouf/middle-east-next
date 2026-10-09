import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { LucideUserX } from "lucide-react";

export default function DeleteAccount() {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [openModel, setOpenModel] = useState(false);

  const reasons = [
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
  ];

  const handleDelete = () => {
    const reason = customReason || selectedReason;
    if (!reason) {
      alert("Please select or enter a reason before deleting your account.");
      return;
    }
    setOpenModel(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header with left border */}
      <div className="bg-[#E6F0ED] py-3 px-4 rounded-lg border-l-[3px] border-l-blueSite">
        <h2 className="text-blueSite font-semibold text-[20px]">
          Choose The Reason For Deleting The Account :
        </h2>
      </div>

      {/* Reason Selection */}
      <div className="flex flex-col gap-2">
        {reasons.map((reason, idx) => (
          <label
            key={idx}
            className="flex items-center space-x-2 py-2 cursor-pointer"
          >
            <input
              type="radio"
              name="deleteReason"
              value={reason}
              checked={selectedReason === reason}
              onChange={(e) => {
                setSelectedReason(e.target.value);
                setCustomReason("");
              }}
              className="mt-1 accent-blueSiteHover"
            />
            <span className="text-subTitleColor text-[20px]">{reason}</span>
          </label>
        ))}

        {/* Custom reason input */}
        <label className="flex items-center space-x-2 py-2 cursor-pointer">
          <input
            type="radio"
            name="deleteReason"
            value="custom"
            checked={selectedReason === "custom" || customReason !== ""}
            onChange={() => {
              setSelectedReason("custom");
            }}
            className="mt-1 accent-blueSiteHover"
          />
          <input
            type="text"
            placeholder="Write another reason for deleting your account........"
            value={customReason}
            onChange={(e) => {
              setCustomReason(e.target.value);
              if (e.target.value) {
                setSelectedReason("custom");
              }
            }}
            className="w-[600px] h-[60px] border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blueSite"
          />
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-start gap-4">
        <button
          onClick={handleDelete}
          className="bg-red-600 text-textWhiteColor px-4 py-2 rounded-md hover:bg-red-700 transition"
        >
          Delete account
        </button>
        <button className="text-textColor hover:underline">Cancel</button>
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={openModel} onClose={() => setOpenModel(false)} className="bg-[#FBFBFB]">
        <div>
          <div className="w-full flex items-center justify-center mb-4">
            <div className="p-6 w-fit rounded-full bg-[#E6F0ED] ">
              <LucideUserX size={40} color="#dc2626" />
            </div>
          </div>
          <h2 className="text-center text-md">
            Are you sure you permanently want to delete your account ?
          </h2>
          <div className="flex flex-row justify-center gap-5 py-5">
            <button
              onClick={() => setOpenModel(false)}
              className="bg-white text-subTitleColor px-8 py-2 rounded-md shadow-md transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-textWhiteColor px-8 py-2 rounded-md shadow-md hover:bg-red-700 transition"
            >
              Confirm
            </button>
          </div>

          <div className="bg-[#E6F0ED] p-4 rounded-md">
            <h2 className="text-red-500 font-semibold text-lg">You'll be missing </h2>

            <ol className="list-disc pl-3">
              {[...Array(4)].map((_, index) => (
                <li key={index} className="py-1">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.{" "}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Modal>
    </div>
  );
}
