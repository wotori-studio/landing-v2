"use server";

import { z } from "zod";
import { supabase } from "../../lib/supabase";
import { resend } from "../../lib/resend";

const waitlistSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
});

export type WaitlistFormState = {
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
    name?: string[];
  };
};

export async function submitWaitlist(
  prevState: WaitlistFormState | null,
  formData: FormData
): Promise<WaitlistFormState> {
  try {
    const rawData = {
      email: formData.get("email") as string,
      name: formData.get("name") as string | undefined,
    };

    // Validate input
    const validationResult = waitlistSchema.safeParse(rawData);
    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { email, name } = validationResult.data;

    // Insert into Supabase
    if (!supabase) {
      return {
        success: false,
        message: "Database is not configured. Please contact support.",
      };
    }

    const { error: insertError } = await supabase
      .from("waitlist_users")
      .insert({
        email,
        name: name || null,
      });

    if (insertError) {
      // Check if it's a duplicate email error
      if (insertError.code === "23505") {
        return {
          success: false,
          message: "This email is already on the waitlist.",
        };
      }

      console.error("Supabase insert error:", insertError);
      return {
        success: false,
        message: "Failed to add you to the waitlist. Please try again.",
      };
    }

    // Send welcome email via Resend
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
      const toEmail = email;

      await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        subject: "Welcome to Ekza Space Waitlist!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Welcome to Ekza Space!</h1>
            <p>Thank you for joining our waitlist. We're excited to have you on board.</p>
            <p>We'll keep you updated on our progress and notify you when we launch.</p>
            <p>Best regards,<br>The Ekza Space Team</p>
          </div>
        `,
      });
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error("Failed to send welcome email:", emailError);
      // Continue - the user is still added to the waitlist
    }

    return {
      success: true,
      message: "Successfully added to waitlist! Check your email for confirmation.",
    };
  } catch (error) {
    console.error("Unexpected error in submitWaitlist:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
