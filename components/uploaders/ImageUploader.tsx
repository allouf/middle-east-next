import { FaCamera, FaTimes } from "react-icons/fa";

export const ImageUploader = ({ preview, onChange, onRemove }) => (
  <div className="p-4">
    <label className="flex items-center gap-2 cursor-pointer text-blueSite">
      <FaCamera className="text-green-600 w-6 h-6 " />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChange}
      />
    </label>
    {preview && (
      <div className="relative mt-3">
        <img
          src={preview}
          alt="preview"
          className="max-h-60 w-full rounded-lg"
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 bg-red-600 text-textWhiteColor rounded-full p-1 hover:bg-red-700"
        >
          <FaTimes size={16} />
        </button>
      </div>
    )}
  </div>
);

