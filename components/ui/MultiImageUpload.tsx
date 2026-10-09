'use client';

import { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { App } from "antd";

interface MultiImageUploadProps {
  onImagesChange: (images: File[]) => void;
  oldImages?: any[];
  handleDeleteOldImg?: (id: string | number) => void;
  withFieldset?: boolean;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  label?: string;
  defaultImages?: any[];
  value?: (File | string)[];
  acceptedTypes?: string[];
  customFilter?: (file: File) => boolean;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  onImagesChange,
  oldImages = [],
  handleDeleteOldImg,
  withFieldset = false,
  required = false,
  disabled = false,
  id,
  label,
  defaultImages = [],
  value = [], // Current value prop for controlled component
  acceptedTypes = ['image/*'],
  customFilter,
}) => {
    const { message: messageApi } = App.useApp();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Helper function to compare File objects by their properties
  const isSameFile = (file1, file2) => {
    if (!file1 || !file2) return false;
    if (file1 === file2) return true; // Same reference
    if (file1 instanceof File && file2 instanceof File) {
      return (
        file1.name === file2.name &&
        file1.size === file2.size &&
        file1.lastModified === file2.lastModified
      );
    }
    return false;
  };

  // Sync with value prop (for File objects from formData)
  useEffect(() => {
    if (value && Array.isArray(value) && value.length > 0) {
      // Check if value contains File objects
      const hasFileObjects = value.some(item => item instanceof File);

      if (hasFileObjects) {
        // Convert File objects to display format
        setImages(prevImages => {
          // Preserve default images (isDefault: true) - these are URLs from API
          const defaultImages = prevImages.filter(img => img.isDefault);

          // Create a map of existing files to preserve their object URLs
          const existingFileMap = new Map();
          prevImages.forEach(img => {
            if (img.file) {
              const key = `${img.file.name}-${img.file.size}-${img.file.lastModified}`;
              existingFileMap.set(key, img);
            }
          });

          // Check if the value files match the current file images
          const currentFileKeys = prevImages
            .filter(img => img.file)
            .map(img => `${img.file.name}-${img.file.size}-${img.file.lastModified}`)
            .sort()
            .join(',');
          const newFileKeys = value
            .filter(file => file instanceof File)
            .map(file => `${file.name}-${file.size}-${file.lastModified}`)
            .sort()
            .join(',');

          // Only update if files have actually changed
          if (currentFileKeys === newFileKeys) {
            return prevImages; // No change needed
          }

          // Map value files to image objects, reusing existing URLs when possible
          const fileImageObjects = value
            .filter(file => file instanceof File)
            .map((file) => {
              const key = `${file.name}-${file.size}-${file.lastModified}`;
              const existing = existingFileMap.get(key);
              if (existing) {
                return existing;
              }
              return {
                file,
                url: URL.createObjectURL(file),
                isDefault: false,
              };
            });

          // Revoke URLs for files that are no longer in value
          prevImages.forEach(img => {
            if (img.file && !img.isDefault) {
              const stillExists = value.some(file => isSameFile(file, img.file));
              if (!stillExists) {
                URL.revokeObjectURL(img.url);
              }
            }
          });

          // Combine default images (from API) with new file images
          const combinedImages = [...defaultImages, ...fileImageObjects];
          imagesRef.current = combinedImages;
          return combinedImages;
        });
      }
    } else if (!value || value.length === 0) {
      // When value is empty, preserve default images but remove file images
      setImages(prevImages => {
        const defaultImages = prevImages.filter(img => img.isDefault);
        // Revoke URLs for removed file images
        prevImages.forEach(img => {
          if (img.file && !img.isDefault) {
            URL.revokeObjectURL(img.url);
          }
        });
        imagesRef.current = defaultImages;
        return defaultImages;
      });
    }
  }, [value]);

  // Initialize with default images if provided (when defaultImages change and no value/images exist)
  useEffect(() => {
    if (defaultImages && defaultImages.length > 0 && images.length === 0 && (!value || value.length === 0)) {
      const defaultImageObjects = defaultImages.map((img) => {
        // Handle both string URLs and objects with file_path
        const url = typeof img === "string" ? img : img?.file_path || img?.url;
        return {
          file: null, // Default images don't have file objects
          url: url,
          isDefault: true,
        };
      });
      imagesRef.current = defaultImageObjects;
      setImages(defaultImageObjects);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultImages]);

  // Cleanup: revoke all object URLs on unmount
  useEffect(() => {
    return () => {
      imagesRef.current.forEach(img => {
        if (img.file && !img.isDefault && img.url) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, []);

  const processFiles = (files: FileList) => {
    const allFiles = Array.from(files);
    const validFiles: File[] = [];
    const invalidFiles: File[] = [];
    
    allFiles.forEach((file: File) => {
      let isValid = false;
      
      // Use custom filter if provided
      if (customFilter) {
        isValid = customFilter(file);
      } else {
        // Default filter: check if file type matches any accepted type
        isValid = acceptedTypes.some(type => {
          if (type === 'image/*') {
            return file.type.startsWith('image/');
          }
          if (type.endsWith('/*')) {
            const prefix = type.slice(0, -2);
            return file.type.startsWith(prefix);
          }
          return file.type === type;
        });
      }
      
      if (isValid) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file);
      }
    });
    
    // Log invalid files to console
    if (invalidFiles.length > 0) {
      console.warn('Invalid files rejected:', invalidFiles.map(f => ({
        name: f.name,
        type: f.type,
        size: f.size
      })));
      
      // Show Ant Design error message
      const allowedTypeNames = acceptedTypes.map(type => 
        type.replace('image/', '').replace('video/', '').toUpperCase()
      ).join(', ');
      const errorMessage = t('imageUpload.invalidFileType').replace('{{types}}', allowedTypeNames);
      messageApi.error(errorMessage);
    }
    
    // Log valid files to console
    if (validFiles.length > 0) {
      console.log('Valid files accepted:', validFiles.map(f => ({
        name: f.name,
        type: f.type,
        size: f.size
      })));
    }
    
    const newImages = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isDefault: false,
    }));
    return newImages;
  };

  const handleImageChange = (e) => {
    const newImages = processFiles(e.target.files);
    const updatedImages = [...images, ...newImages];
    imagesRef.current = updatedImages;
    setImages(updatedImages);
    onImagesChange(
      updatedImages.filter((img) => img.file).map((img) => img.file)
    );
    
    // Show success message if files were added
    if (newImages.length > 0) {
      const successMessage = t('imageUpload.uploadSuccess').replace('{{count}}', newImages.length.toString());
      messageApi.success(successMessage);
    }
    
    // Reset input to allow selecting same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const newImages = processFiles(files);
      const updatedImages = [...images, ...newImages];
      imagesRef.current = updatedImages;
      setImages(updatedImages);
      onImagesChange(
        updatedImages.filter((img) => img.file).map((img) => img.file)
      );
      
      // Show success message if files were added
      if (newImages.length > 0) {
        const successMessage = t('imageUpload.uploadSuccess').replace('{{count}}', newImages.length.toString());
        messageApi.success(successMessage);
      }
    }
  };

  const removeImage = (index: number) => {
    // Calculate the actual index in the images array (accounting for oldImages)
    const oldImagesCount = oldImages.length;

    if (index < oldImagesCount) {
      // Removing an old image
      if (handleDeleteOldImg && oldImages[index]) {
        handleDeleteOldImg(oldImages[index].id || index);
      }
    } else {
      // Removing a new image
      const imageIndex = index - oldImagesCount;
      const imageToRemove = images[imageIndex];

      // Revoke object URL to prevent memory leaks
      if (imageToRemove?.url && !imageToRemove?.isDefault) {
        URL.revokeObjectURL(imageToRemove.url);
      }

      const updatedImages = images.filter((_, idx) => idx !== imageIndex);
      imagesRef.current = updatedImages;
      setImages(updatedImages);
      onImagesChange(
        updatedImages.filter((img) => img.file).map((img) => img.file)
      );
    }
  };

  const triggerFileInput = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  // Combine old images and new images for display
  const allImages = [
    ...oldImages.map((img) => ({
      url: img.image_path || img.url || (typeof img === "string" ? img : ""),
      isOld: true,
    })),
    ...images,
  ];

  if (withFieldset) {
    return (
      <div>
        {/* Drag and Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative w-full bg-white border border-gray-300 rounded-md p-4
            transition-all duration-200
            ${isDragging ? "border-blueSite bg-[#E6F0ED]" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          {/* Label inside the border at top-left */}
          {label && (
            <div className="absolute top-0 start-0 -mt-3 ms-4 px-2 bg-white">
              <label className="text-blueSite font-semibold sm:text-sm text-[12px]">
                {label}
              </label>
            </div>
          )}

          {/* Content: Images on left, Upload prompt on right */}
          <div className="flex items-center gap-4 min-h-[120px]">
            {/* Images on the left */}
            {allImages.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap">
                {allImages.map((img, index) => {
                  const imageUrl =
                    img.url ||
                    img.file_path ||
                    img.image_path ||
                    (typeof img === "string" ? img : "/defaulLogo.png");
                  return (
                    <div
                      key={`img-${index}-${imageUrl}`}
                      className="relative group"
                    >
                      <img
                        src={imageUrl}
                        alt={`preview-${index}`}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          // If image fails to load and we have a File object, recreate the URL
                          const actualImg = allImages[index];
                          if (actualImg && actualImg.file && actualImg.file instanceof File) {
                            try {
                              // Revoke old URL if it exists
                              if (actualImg.url && actualImg.url.startsWith('blob:')) {
                                URL.revokeObjectURL(actualImg.url);
                              }
                              const newUrl = URL.createObjectURL(actualImg.file);
                              e.target.src = newUrl;
                              // Update the image in state
                              const imageIndex = index - oldImages.length;
                              if (imageIndex >= 0) {
                                setImages(prev => prev.map((im, idx) =>
                                  idx === imageIndex ? { ...im, url: newUrl } : im
                                ));
                              }
                            } catch (err) {
                              console.error('Failed to recreate object URL:', err);
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute -top-1 -right-1 bg-red-600 text-textWhiteColor rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                        aria-label="Remove image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Upload prompt on the right */}
            <div
              className={`flex flex-col items-center justify-center ${allImages.length > 0 ? "ml-auto" : "mx-auto"
                }`}
              onClick={triggerFileInput}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerFileInput();
                }}
                disabled={disabled}
                className="px-6 py-2 bg-white border border-gray-300 rounded-md text-subTitleColor font-medium hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
              >
                {t('imageUpload.addFile')}
              </button>
              <p className="mt-2 text-sm text-textColor">
                {t('imageUpload.orDragAndDrop')}
              </p>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            accept={acceptedTypes.join(',')}
            multiple
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
            required={required}
            disabled={disabled}
            id={id}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-subTitleColor mb-1"
      >
        {label}
      </label>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative w-full bg-white border border-gray-300 rounded-md p-2
          transition-all duration-200
          ${isDragging ? "border-blueSite bg-[#E6F0ED]" : ""}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <div
          className="flex flex-col items-center justify-center p-4"
          onClick={triggerFileInput}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerFileInput();
            }}
            disabled={disabled}
            className="px-6 py-2 bg-white border border-gray-300 rounded-md text-subTitleColor font-medium hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
          >
            {t('imageUpload.addFile')}
          </button>
          <p className="mt-2 text-sm text-textColor">
            {t('imageUpload.orDragAndDrop')}
          </p>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          accept={acceptedTypes.join(',')}
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageChange}
          required={required}
          disabled={disabled}
          id={id}
        />

        {/* Image Preview Grid */}
        {allImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {allImages.map((img, index) => {
              const imageUrl =
                img.url ||
                img.file_path ||
                img.image_path ||
                (typeof img === "string" ? img : "/defaulLogo.png");
              return (
                <div key={`img-${index}-${imageUrl}`} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`preview-${index}`}
                    className="w-full h-32 object-cover rounded-md border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-textWhiteColor rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>


    </div>
  );
};

export default MultiImageUpload;
