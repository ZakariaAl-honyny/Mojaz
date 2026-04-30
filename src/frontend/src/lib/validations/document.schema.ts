import * as z from 'zod';

/**
 * Sovereign constraints for document uploads
 */
export const DOCUMENT_CONSTRAINTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/png',
    'application/pdf'
  ],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.pdf']
};

/**
 * Validation schema for a single sovereign document
 */
export const documentFileSchema = z
  .instanceof(File, { message: 'يجب اختيار ملف صحيح' })
  .refine(
    (file) => file.size <= DOCUMENT_CONSTRAINTS.MAX_FILE_SIZE,
    { message: 'حجم الملف يتجاوز الحد المسموح به (5 ميجابايت)' }
  )
  .refine(
    (file) => DOCUMENT_CONSTRAINTS.ALLOWED_MIME_TYPES.includes(file.type),
    { message: 'نوع الملف غير مدعوم. يرجى رفع ملف (JPG, PNG, PDF)' }
  );

/**
 * Schema for document items in a list
 */
export const documentItemSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  name: z.string(),
  file: documentFileSchema.optional(),
  status: z.enum(['Pending', 'Uploaded', 'Error', 'Reviewing']).default('Pending'),
  progress: z.number().min(0).max(100).default(0),
  error: z.string().optional(),
});

export type DocumentItem = z.infer<typeof documentItemSchema>;
