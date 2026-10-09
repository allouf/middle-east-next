import React from 'react';
import { FileText, Download, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

const ReviewDeliveryCard = ({ evidence, provider }: { evidence?: any; provider?: any }) => {
  if (!evidence) return null;

  const data = evidence.data || {};
  const attachments = data.attachments || [];
  const message = data?.message||data?.notes || "No message provided.";
  const submittedAt = data.submitted_at || evidence.created_at;

  const handleDownloadAll = () => {
    attachments.forEach((url: string) => {
      const link = document.createElement('a');
      link.href = url;
      // Extract filename from URL
      const fileName = url.split('/').pop() || 'download';
      link.setAttribute('download', fileName);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="flex flex-col rounded-[16px] bg-[#FAFAFA] border border-gray-100 p-6 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#E6F4EA] flex items-center justify-center">
             <FileText className="w-5 h-5 text-[#00664F]" />
          </div>
          <h3 className="text-[18px] font-bold text-[#1F2937]">{evidence.label || "Review Delivery"}</h3>
        </div>
        <span className="text-[12px] text-gray-400">
          {submittedAt ? new Date(submittedAt).toLocaleString() : ""}
        </span>
      </div>

      {attachments.length > 0 && (
        <div className="relative mt-2 border border-[#E5E7EB] rounded-[12px] p-5 mb-4">
          <span className="absolute -top-[10px] left-4 px-2 text-[13px] bg-[#FAFAFA] font-bold text-[#00664F]">
            Attached Files
          </span>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
            <div className="flex flex-wrap gap-4">
              {attachments.map((fileUrl: string, idx: number) => {
                const fileName = fileUrl.split('/').pop() || `Attachment ${idx + 1}`;
                const isImage = fileUrl.match(/\.(jpeg|jpg|gif|png)$/i) != null;
                return (
                  <a 
                    key={idx} 
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {isImage ? <ImageIcon className="w-4 h-4 text-blue-500" /> : <FileText className="w-4 h-4 text-red-500" />}
                    <span className="text-[13px] text-gray-600 font-medium truncate max-w-[150px]" title={fileName}>
                      {fileName}
                    </span>
                  </a>
                );
              })}
            </div>
            <button 
              onClick={handleDownloadAll}
              className="p-2 border border-gray-200 rounded-lg text-[#00664F] bg-white hover:bg-green-50 transition-colors shadow-sm"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 bg-white rounded-[12px] p-5 border border-gray-100 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 relative">
             <Image src="/anonymous.png" alt="Avatar" fill className="object-cover" />
          </div>
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between">
              <h4 className="text-[15px] font-bold text-[#1F2937]">{provider?.name || "Provider"}</h4>
            </div>
            <p className="text-[14px] text-gray-500 leading-relaxed mt-1 whitespace-pre-wrap">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReviewDeliveryCard;
