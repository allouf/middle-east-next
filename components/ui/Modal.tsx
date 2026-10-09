"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import { VectorLeft, VectorRight } from "@/shared/constants/icons";

type Props = {
  id?: string | number;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  classNameContent?: string;
  style?: React.CSSProperties;
  showLine?: boolean;
  showCloseButton?: boolean;
  padding?: string;
  secondPadding?:string;
};

const Modal: React.FC<Props> = ({
  id,
  isOpen,
  onClose,
  children,
  className = "",
  classNameContent = "",
  style = {},
  showLine = true,
  showCloseButton = true,
  padding = "px-8 py-12",
  secondPadding ="p-8"
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.25, ease: "easeInOut" },
    },
  };

  // Prevent SSR / hydration issues
  if (!mounted || !isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key={id}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className={`relative bg-white rounded-[24px] shadow-2xl ${padding} max-w-xl max-h-screen w-full overflow-hidden ${className}`}
            style={style}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {showLine && (
              <div className="pointer-events-none absolute inset-0 m-4 sm:m-6">
                {/* Left vector */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-full w-4 sm:w-6 scale-[1.3] drop-shadow-[0_0_25px_rgba(33,150,243,0.8)]">
                  <Image
                    src={VectorLeft}
                    alt="Left vector"
                    fill
                    priority={false}
                    className="object-contain"
                    sizes="(max-width: 640px) 20vw, (max-width: 768px) 25vw, 200px"
                  />
                </div>

                {/* Right vector */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-4 sm:w-6 scale-[1.3] drop-shadow-[0_0_25px_rgba(33,150,243,0.8)]">
                  <Image
                    src={VectorRight}
                    alt="Right vector"
                    fill
                    priority={false}
                    className="object-contain"
                    sizes="(max-width: 640px) 20vw, (max-width: 768px) 25vw, 200px"
                  />
                </div>
              </div>
            )}

            {/* Close Button */}
            {showCloseButton &&
              <motion.button
                type="button"
                onClick={onClose}
                className="absolute top-4 end-4 z-30 bg-white/90 backdrop-blur-md border border-transparent rounded-full p-2 text-blueBtn transition-all duration-300"
                aria-label="Close modal"
                whileHover={{
                  scale: 1.2,
                  rotate: 90,
                }}
                whileTap={{ scale: 0.9 }}
              >
                <AiOutlineClose size={18} />
              </motion.button>
            }


            {/* Modal content */}
            <div className={`relative z-0 ${secondPadding} overflow-y-auto ${classNameContent}`}>{children}</div>

            {/* Bottom glowing line */}
            {showLine && (
              <motion.div
                className="bottom-6 mx-auto -translate-x-1/2 w-[12rem] h-[3px] bg-gradient-to-r from-transparent via-blueSite to-transparent rounded-full shadow-[0_0_15px_rgba(33,150,243,0.8)]"
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scaleX: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
