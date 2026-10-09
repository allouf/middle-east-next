import { ServiceFormState } from "./useServiceForm";

interface BuildServiceFormDataArgs {
  data: ServiceFormState;
  coverFile?: File;
  mediaFiles?: File[];
  includeBasicInfo?: boolean; // New parameter to control basic info inclusion
}

export function buildServiceFormData(args: BuildServiceFormDataArgs): FormData {
  const fd = new FormData();

  // Only include basic info if explicitly requested
  if (args.includeBasicInfo !== false) {
    // Always append string fields, even if empty (to preserve empty-but-valid values)
    fd.append("title", args.data.title);
    fd.append("service_category_id", args.data.service_category_id);
    fd.append("type", args.data.type);
    fd.append("delivery_model", args.data.delivery_model);
    fd.append("description", args.data.description);
    fd.append("is_active", args.data.is_active === "1" ? "1" : "0");
    fd.append("sort_order", args.data.sort_order);
  }

  // Append all plans as array
  if (args.data.plans?.length) {
    args.data.plans.forEach((plan, index) => {
      fd.append(`plans[${index}][title]`, plan.title || '');
      fd.append(`plans[${index}][price]`, plan.price || '');
      fd.append(`plans[${index}][currency]`, plan.currency || '');
      fd.append(`plans[${index}][delivery_time_value]`, plan.delivery_time_value || '');
      fd.append(`plans[${index}][delivery_time_unit]`, plan.delivery_time_unit || '');
      fd.append(`plans[${index}][revision_window]`, plan.revision_window || '');
      fd.append(`plans[${index}][revision_scope_rules]`, plan.revision_scope_rules || '');
      fd.append(`plans[${index}][number_of_revisions]`, plan.number_of_revisions || '');
    });
  }

  // Append FAQs as array
  if (args.data.faqs?.length) {
    args.data.faqs.forEach((faq, index) => {
      fd.append(`faqs[${index}][question]`, faq.question);
      fd.append(`faqs[${index}][answer]`, faq.answer);
    });
  }

  // Append availability as array
  if (args.data.available_slots?.length) {
    args.data.available_slots.forEach((avail, index) => {
      fd.append(`available_slots[${index}][day]`, avail.day);

      if (avail.slots?.length) {
        avail.slots.forEach((slot, slotIndex) => {
          fd.append(`available_slots[${index}][slots][${slotIndex}][start_time]`, slot.start_time);
          fd.append(`available_slots[${index}][slots][${slotIndex}][end_time]`, slot.end_time);
        });
      }
    });
  }

  // Append cover file
  if (args.coverFile) {
    fd.append("cover", args.coverFile);
  }

  // Append media files (using media[0][file], media[0][sort_order] as specified)
  if (args.mediaFiles?.length) {
    args.mediaFiles.forEach((file, index) => {
      fd.append(`media[${index}][file]`, file);
      fd.append(`media[${index}][sort_order]`, index.toString());
    });
  }

  return fd;
}
