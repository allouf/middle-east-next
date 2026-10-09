'use client';

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";

function VerifyUpgrade() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [nationalId, setNationalId] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [documents, setDocuments] = useState([]);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setDocuments(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setStatus("Missing or invalid token");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("token", token);
      formData.append("national_id", nationalId);
      formData.append("portfolio_url", portfolioUrl);

      // multiple documents
      for (let i = 0; i < documents.length; i++) {
        formData.append("documents[]", documents[i]);
      }

      const response = await api.post(
        "/freelancers/confirm-upgrade",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setStatus(response.data.message || "Upgrade successful!");
    } catch (error) {
      setStatus(error.response?.data?.message || "Upgrade failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Complete Your Upgrade</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="National ID"
          value={nationalId}
          onChange={(e) => setNationalId(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <input
          type="url"
          placeholder="Portfolio URL"
          value={portfolioUrl}
          onChange={(e) => setPortfolioUrl(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="border p-2 w-full rounded"
        />

        <button
          type="submit"
          className="bg-blueBtn text-textWhiteColor px-4 py-2 rounded hover:bg-blueSiteHover"
        >
          Confirm Upgrade
        </button>
      </form>

      {status && <p className="mt-3 text-sm text-subTitleColor">{status}</p>}
    </div>
  );
}

export default VerifyUpgrade;
