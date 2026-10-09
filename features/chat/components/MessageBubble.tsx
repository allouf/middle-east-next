"use client";

import React, { useState, useRef, useEffect } from "react";
import { BsCheckAll, BsReply, BsClipboard, BsEmojiSmile, BsForward, BsPin, BsExclamationCircle, BsTrash, BsDownload, BsFileEarmarkText, BsPlayCircleFill } from "react-icons/bs";
import { Image, Modal } from "antd";

interface MessageBubbleProps {
  message: any;
  isSent: boolean;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isSent }) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ visible: false, x: 0, y: 0 });
  const [videoPreviewOpen, setVideoPreviewOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const senderPhoto = message.senderUser?.photo || message.sender?.photo || "/ReferralImage.png";

  // Right-click handler
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Position relative to viewport
    const x = e.clientX;
    const y = e.clientY;

    setContextMenu({ visible: true, x, y });
  };

  // Close context menu on outside click
  useEffect(() => {
    if (!contextMenu.visible) return;
    const handleClick = () => setContextMenu({ visible: false, x: 0, y: 0 });
    const handleScroll = () => setContextMenu({ visible: false, x: 0, y: 0 });
    document.addEventListener("click", handleClick);
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [contextMenu.visible]);

  // Adjust menu position to stay in viewport
  useEffect(() => {
    if (!contextMenu.visible || !menuRef.current) return;
    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    let newX = contextMenu.x;
    let newY = contextMenu.y;

    if (rect.right > viewportW) newX = viewportW - rect.width - 8;
    if (rect.bottom > viewportH) newY = viewportH - rect.height - 8;

    if (newX !== contextMenu.x || newY !== contextMenu.y) {
      setContextMenu({ visible: true, x: newX, y: newY });
    }
  }, [contextMenu.visible]);

  const contextMenuItems = [
    { icon: <BsReply />, label: "Reply", danger: false },
    { icon: <BsClipboard />, label: "Copy", danger: false },
    { icon: <BsEmojiSmile />, label: "React", danger: false },
    { icon: <BsForward />, label: "Forward", danger: false },
    { icon: <BsPin />, label: "Pin", danger: false },
    { icon: <BsExclamationCircle />, label: "Report", danger: true },
    { icon: <BsTrash />, label: "Delete", danger: true },
  ];

  const handleMenuAction = (action: string) => {
    switch (action) {
      case "Copy":
        navigator.clipboard.writeText(message.content || message.message || "");
        break;
      // Other actions can be wired up later
    }
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  const resolveMediaType = (msg: any): { resolvedType: string, url: string, fileName: string, isUrl: boolean } => {
    let type = msg.type || msg.messageType || "TEXT";
    const text = (msg.content || msg.message || "").trim();
    
    // Check if it's a URL
    const isUrl = /^https?:\/\/[^\s]+$/.test(text);
    let fileName = "";
    
    if (isUrl) {
      try {
        const urlObj = new URL(text);
        const pathname = urlObj.pathname;
        const parts = pathname.split('/');
        fileName = parts[parts.length - 1] || "file";
        
        // Remove timestamp prefix like '1779047966788-filename.pdf'
        if (/^\d{13}-/.test(fileName)) {
          fileName = fileName.replace(/^\d{13}-/, '');
        }

        const extMatch = fileName.match(/\.([a-zA-Z0-9]+)$/);
        const ext = extMatch ? extMatch[1].toLowerCase() : "";

        // If the type is TEXT but it's a direct URL to a file, we override the type
        if (type === "TEXT" || type === "FILE") {
          if (["png", "jpg", "jpeg", "gif", "webp", "avif"].includes(ext)) type = "IMAGE";
          else if (["mp4", "webm", "ogg", "mov"].includes(ext)) type = "VIDEO";
          else if (["mp3", "wav", "m4a", "aac"].includes(ext)) type = "AUDIO";
          else if (ext) type = "FILE";
        }
      } catch (e) {
        // Not a valid URL
      }
    }
    
    return { resolvedType: type, url: text, fileName, isUrl };
  };

  const { resolvedType, url, fileName, isUrl } = resolveMediaType(message);

  return (
    <>
      <div
        className={`message-bubble-wrapper ${isSent ? "sent" : "received"}`}
        onContextMenu={handleContextMenu}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "65%",
            alignItems: isSent ? "flex-end" : "flex-start",
          }}
        >
          <div className="message-bubble" style={{ width: "fit-content", padding: (resolvedType === "IMAGE" || resolvedType === "VIDEO") ? "4px" : undefined }}>
            {resolvedType === "IMAGE" ? (
              <Image 
                src={url} 
                alt="Shared Image" 
                className="object-cover rounded-xl"
                style={{ maxWidth: '240px', maxHeight: '240px' }} 
              />
            ) : resolvedType === "VIDEO" ? (
              <>
                <div 
                  className="relative max-w-[240px] max-h-[240px] rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => setVideoPreviewOpen(true)}
                >
                  <video src={url} className="w-full h-full object-cover rounded-xl" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition flex items-center justify-center">
                    <BsPlayCircleFill className="text-white text-4xl opacity-80 group-hover:opacity-100 transition shadow-sm rounded-full" />
                  </div>
                </div>
                <Modal
                  open={videoPreviewOpen}
                  footer={null}
                  onCancel={() => setVideoPreviewOpen(false)}
                  centered
                  width={800}
                  styles={{ body: { padding: 0 } }}
                  destroyOnClose
                >
                  <video src={url} controls autoPlay className="w-full h-auto rounded-lg outline-none" />
                </Modal>
              </>
            ) : (resolvedType === "AUDIO" || resolvedType === "VOICE") ? (
              <audio src={url} controls className="max-w-[280px]" />
            ) : (resolvedType === "FILE" && isUrl) ? (
              <div className={`flex items-center gap-3 p-2 rounded-lg max-w-[280px] ${isSent ? 'bg-white/20' : 'bg-transparent'}`}>
                <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BsFileEarmarkText className="text-[#0d5e3d] text-xl" />
                </div>
                <div className="flex-1 overflow-hidden mr-2">
                  <p className={`text-sm font-bold truncate ${isSent ? 'text-white' : 'text-gray-800'}`}>{fileName}</p>
                  <p className={`text-[10px] uppercase font-medium mt-0.5 ${isSent ? 'text-white/70' : 'text-gray-500'}`}>Document</p>
                </div>
                <a 
                  href={url} 
                  download 
                  target="_blank" 
                  rel="noreferrer"
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition flex-shrink-0 shadow-sm ${isSent ? 'bg-white text-[#0d5e3d] hover:bg-gray-50' : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'}`}
                >
                  <BsDownload />
                </a>
              </div>
            ) : (
              <div className="message-content">{url}</div>
            )}
          </div>

          {/* Time + avatar row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "4px",
              flexDirection: isSent ? "row-reverse" : "row",
            }}
          >
            {!isSent && (
              <img
                src={senderPhoto}
                alt=""
                className="message-avatar-small"
              />
            )}
            <span className="message-time" style={{ margin: 0 }}>
              {formatTime(message.createdAt)}
              {isSent && <BsCheckAll style={{ marginLeft: 4, fontSize: 14 }} />}
            </span>
          </div>
        </div>
      </div>

      {/* Context menu (portal-like, fixed position) */}
      {contextMenu.visible && (
        <div
          ref={menuRef}
          className="fixed z-[9999] bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 min-w-[180px] overflow-hidden"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenuItems.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm transition ${
                item.danger
                  ? "text-red-500 hover:bg-red-50"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => handleMenuAction(item.label)}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default MessageBubble;
