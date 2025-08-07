import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";
import Medusa from "@medusajs/js-sdk";

// Validation schema for forgot password
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address")
});

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    // Validate request body
    const validationResult = forgotPasswordSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    const { email } = validationResult.data;

    try {
      const sdk = new Medusa({
        baseUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
        auth: {
          type: "jwt"
        }
      });

      // Generate reset password token using the SDK
      await sdk.auth.resetPassword("customer", "emailpass", {
        identifier: email,
      });

      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent."
      });

    } catch (error) {
      console.error("Forgot password error:", error);

      // Don't reveal if email exists or not for security
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent."
      });
    }

  } catch (error) {
    console.error("Forgot password error:", error);
    
    return res.status(500).json({
      success: false,
      message: "Internal server error during password reset request"
    });
  }
} 