'use client';

import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaLinkedinIn,
} from "react-icons/fa";
import { Share } from "lucide-react";

const ProductShare = () => (
  <div className="flex items-center gap-4 border-t pt-4 border-gray-200">
    <span className="text-sm font-medium">Share:</span>

    <div className="flex gap-3">
      <button className="p-2 bg-gray-100 rounded-full hover:bg-blue-100">
        <FaFacebookF size={16} />
      </button>
      <button className="p-2 bg-gray-100 rounded-full hover:bg-blue-100">
        <FaTwitter size={16} />
      </button>
      <button className="p-2 bg-gray-100 rounded-full hover:bg-blue-100">
        <FaLinkedinIn size={16} />
      </button>
      <button className="p-2 bg-gray-100 rounded-full hover:bg-blue-100">
        <FaPinterestP size={16} />
      </button>
      <button className="p-2 bg-gray-100 rounded-full hover:bg-blue-100">
        <Share size={16} />
      </button>
    </div>
  </div>
);

export default ProductShare;
