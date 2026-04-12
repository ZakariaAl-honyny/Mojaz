import { z } from "zod";

export const trainingEntrySchema = z.object({
  additionalHours: z.coerce
    .number({
      required_error: "hoursRequired",
      invalid_type_error: "hoursInvalid",
    })
    .min(0.5, "hoursMin")
    .max(8, "hoursMax"),
  notes: z.string().max(200, "notesMax").optional(),
});

export type TrainingEntryFormValues = z.infer<typeof trainingEntrySchema>;

export const exemptionRequestSchema = z.object({
  exemptionReason: z.string().min(10, "reasonMin").max(500, "reasonMax"),
  exemptionDocumentId: z.string().uuid("documentRequired"),
});

export type ExemptionRequestFormValues = z.infer<typeof exemptionRequestSchema>;
