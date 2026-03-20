"use server";

import { z } from "zod";
import { supabase } from "../../lib/supabase";

// Email validation schema
const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Form state type
export type NewsletterFormState = {
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
  };
};

/**
 * Server Action for newsletter subscription
 * Accepts email from form, validates it, and writes to ekza_subscribers table
 */
export async function subscribeToNewsletter(
  prevState: NewsletterFormState | null,
  formData: FormData
): Promise<NewsletterFormState> {
  try {
    // Get email from form
    const email = formData.get("email") as string;

    // Validate email
    const validationResult = newsletterSchema.safeParse({ email });
    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { email: validatedEmail } = validationResult.data;

    // Check if Supabase client is available
    if (!supabase) {
      return {
        success: false,
        message: "Database is not configured. Please contact support.",
      };
    }

    // Insert email into ekza_subscribers table
    const { error: insertError } = await supabase
      .from("ekza_subscribers")
      .insert({
        email: validatedEmail,
      });

    // Handle errors
    if (insertError) {
      // Code 23505 - unique constraint violation (email already exists)
      if (insertError.code === "23505") {
        return {
          success: false,
          message: "This email is already subscribed to the newsletter.",
        };
      }

      // Other database errors
      console.error("Error adding subscriber:", insertError);
      return {
        success: false,
        message: "Failed to add you to the newsletter. Please try again later.",
      };
    }

    // Successful subscription
    return {
      success: true,
      message: "Thank you for subscribing! We'll keep you updated with the latest news.",
    };
  } catch (error) {
    // Handle unexpected errors
    console.error("Unexpected error in subscribeToNewsletter:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
