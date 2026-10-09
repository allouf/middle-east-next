// buildCompanyGalleryFormData.ts
export function buildCompanyGalleryFormData(args: {
  images: File[];
}) {
  const fd = new FormData();

  args.images.forEach((file, index) => {
    fd.append(`images[${index}]`, file);
  });

  return fd;
}