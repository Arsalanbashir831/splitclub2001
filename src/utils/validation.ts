import { z } from 'zod';

// Enhanced password requirements
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Email validation
export const emailSchema = z.string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

// Display name validation
export const displayNameSchema = z.string()
  .min(2, 'Display name must be at least 2 characters')
  .max(50, 'Display name must not exceed 50 characters')
  .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Display name can only contain letters, numbers, spaces, hyphens, and underscores');

// Sanitize user input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim() // Remove leading/trailing whitespace
    .slice(0, 1000); // Limit length to prevent DoS
};

// Rate limiting helper (client-side basic implementation)
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) { // 5 attempts per 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return true;
    }
    
    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(identifier, validAttempts);
    
    return false;
  }

  getRemainingTime(identifier: string): number {
    const attempts = this.attempts.get(identifier) || [];
    if (attempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const remaining = this.windowMs - (Date.now() - oldestAttempt);
    
    return Math.max(0, remaining);
  }
}

// Validation schemas for forms
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Confirm your password" }),
  displayName: z.string().min(1, { message: "Display name is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }).regex(/^\+\d{10,15}$/, { message: "Invalid phone number format. Include country code." }),
  location: z.string().min(1, { message: "Location is required" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;

// File validation utilities
export const FILE_SIZE_LIMITS = {
  DEAL_IMAGE: 5 * 1024 * 1024, // 5MB = 5,242,880 bytes
  VOUCHER_FILE: 5 * 1024 * 1024, // 5MB = 5,242,880 bytes (changed from 10MB to 5MB)
} as const;

console.log('File size limits loaded:', {
  DEAL_IMAGE: FILE_SIZE_LIMITS.DEAL_IMAGE,
  DEAL_IMAGE_MB: FILE_SIZE_LIMITS.DEAL_IMAGE / 1024 / 1024,
  VOUCHER_FILE: FILE_SIZE_LIMITS.VOUCHER_FILE,
  VOUCHER_FILE_MB: FILE_SIZE_LIMITS.VOUCHER_FILE / 1024 / 1024
});

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const ALLOWED_VOUCHER_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateDealImage = (file: File): FileValidationResult => {
  console.log('validateDealImage - File:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
  
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    console.log('validateDealImage - Invalid file type:', file.type);
    return {
      isValid: false,
      error: `File type "${file.type}" is not supported. Please use JPEG, PNG, or WebP files.`
    };
  }

  // Check file size
  if (file.size > FILE_SIZE_LIMITS.DEAL_IMAGE) {
    console.log('validateDealImage - File too large:', (file.size / 1024 / 1024).toFixed(2), 'MB > 5MB');
    return {
      isValid: false,
      error: `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds the 5MB limit. Please choose a smaller file.`
    };
  }

  console.log('validateDealImage - File is valid');
  return { isValid: true };
};

export const validateVoucherFile = (file: File): FileValidationResult => {
  console.log('validateVoucherFile - File:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
  
  // Check file type
  if (!ALLOWED_VOUCHER_TYPES.includes(file.type)) {
    console.log('validateVoucherFile - Invalid file type:', file.type);
    return {
      isValid: false,
      error: `File type "${file.type}" is not supported. Please use JPEG, PNG, WebP, or PDF files.`
    };
  }

  // Check file size
  if (file.size > FILE_SIZE_LIMITS.VOUCHER_FILE) {
    console.log('validateVoucherFile - File too large:', (file.size / 1024 / 1024).toFixed(2), 'MB > 5MB');
    return {
      isValid: false,
      error: `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds the 5MB limit. Please choose a smaller file.`
    };
  }

  console.log('validateVoucherFile - File is valid');
  return { isValid: true };
};