import { ApplyFormState } from "@/features/jobsServices/types/jobs.types";

export function buildApplyFormData(args: {
  jobId: string | number;
  cvFile?: File | null;
  data: ApplyFormState;
}) {
  const fd = new FormData();

  fd.append("job_id", String(args.jobId));
  fd.append("cover_letter", args.data.cover_letter);

  args.data.answers.forEach((a, i) => {
    fd.append(`answers[${i}][field_id]`, String(a.field_id));
    fd.append(`answers[${i}][value]`, a.value);
  });

  if (args.cvFile) fd.append("resume", args.cvFile);

  return fd;
}
