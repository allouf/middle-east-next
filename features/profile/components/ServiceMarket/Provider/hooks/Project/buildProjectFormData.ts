import { ProjectFormState } from "../../types";

interface BuildProjectFormDataArgs {
  data: ProjectFormState;
  imageFiles?: File[];
}

export function buildProjectFormData(args: BuildProjectFormDataArgs): FormData {
  const fd = new FormData();

  // Always append string fields, even if empty (to preserve empty-but-valid values)
  fd.append("title", args.data.title);
  fd.append("description", args.data.description);
  fd.append("url", args.data.url);
  fd.append("sort_order", args.data.sort_order);

  // Append service offer IDs as array
  if (args.data.service_offer_ids?.length) {
    args.data.service_offer_ids.forEach((id) => {
      fd.append("service_offer_ids[]", id.toString());
    });
  }

  // Append image files
  if (args.imageFiles?.length) {
    args.imageFiles.forEach((file, index) => {
      fd.append(`images[${index}]`, file);
    });
  }

  return fd;
}
