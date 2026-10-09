import React from "react";
import { AlertCircle } from "lucide-react"; // or any icon library you use
 // ✅ adjust if you use shadcn/ui or your own button
import Modal from "../../../Modal";
import Button from "../../../Button";

const TransferDataError = ({ onGoHome ,open=false,setOpen}) => {

  console.log("open",open)
  return (
    <Modal id="TransferDataError" isOpen={open} onClose={()=>setOpen(false)} className="p-3" >
      <div className="flex flex-col items-center justify-center text-center px-3">
        {/* Icon */}
        <div className="flex items-center justify-center pb-5">
          <img src="/errorsIcons/ExportFaild.png" className="w-[160px] h-[160px]"/>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-red-500 mb-2">
         Failed to export data to Excel file
        </h2>

        {/* Description */}
        <p className="text-textColor text-[18px] mb-6">
          You are being timed out due to inactivity. Please choose to stay signed
          in or to log off. Otherwise, you will be logged off automatically.
        </p>

        {/* Button */}
        <Button
          onClick={onGoHome}
          className="bg-blueBtn hover:bg-blueSiteHover text-textWhiteColor font-medium px-6 py-2 rounded-md"
        >
          Go To Home Page
        </Button>
      </div>
    </Modal>
  );
};

export default TransferDataError;
