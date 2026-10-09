'use client';

import { useEffect, useRef, useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaSearchPlus,
  FaSearchMinus,
  FaDownload,
} from "react-icons/fa";
import { storageURL } from "@/shared/constants/data";

const PhotoGalleryModal = ({open, setOpen,  images }) => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const thumbsRef = useRef([]);

  const goLeft = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goRight = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const downloadImage = () => {
    const imageURL = images[currentIndex].image;
    const link = document.createElement("a");
    link.href = imageURL;
    link.download = `image-${images[currentIndex]?.id || currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    thumbsRef.current[currentIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }, [currentIndex]);

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <>


      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-2 sm:px-6 py-8">
          <div className="relative bg-white rounded-xl shadow-3xl max-w-6xl w-full flex flex-col md:flex-row overflow-hidden animate-fade-in">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 md:top-2 right-4 md:right-2 text-subTitleColor bg-white hover:bg-gray-100 p-2 rounded-full shadow"
            >
              <FaTimes size={18} />
            </button>

            {/* Main Image */}
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br relative overflow-hidden">
              <div
                className={`${
                  isZoomed ? "scale-[1.8]" : "scale-100"
                } transition-transform duration-500`}
              >
                <Zoom>
                  <img
                    src={`${storageURL}/${images[currentIndex].image}`}
                    alt={`Main ${currentIndex}`}
                    className="rounded-lg shadow-bottom object-contain max-h-[80vh] w-auto"
                  />
                </Zoom>
              </div>

              {/* Zoom and Download */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <button
                  onClick={toggleZoom}
                  className="bg-white/90 p-2 rounded-full shadow hover:bg-white transition"
                >
                  {isZoomed ? <FaSearchMinus /> : <FaSearchPlus />}
                </button>
                <button
                  onClick={downloadImage}
                  className="bg-white/90 p-2 rounded-full shadow hover:bg-white transition"
                  title="Download Image"
                >
                  <FaDownload />
                </button>
              </div>

              {/* Navigation */}
              <button
                onClick={goLeft}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg backdrop-blur"
              >
                <FaChevronLeft className="text-subTitleColor" />
              </button>
              <button
                onClick={goRight}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg backdrop-blur"
              >
                <FaChevronRight className="text-subTitleColor" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="w-full md:w-32 p-4 md:p-4 mt-0 md:mt-[2rem] flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-300">
              {images.map((img, idx) => (
                <img
                  ref={(el) => (thumbsRef.current[idx] = el)}
                  key={img.id || idx}
                  src={`${storageURL}/${img.image}`}
                  alt={`Thumb ${idx}`}
                  onClick={() => setCurrentIndex(idx)}
                  className={`cursor-pointer object-cover rounded-md w-20 h-20 transition-all duration-300 border-2 ${
                    currentIndex === idx
                      ? "border-blueSite scale-105"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoGalleryModal;
