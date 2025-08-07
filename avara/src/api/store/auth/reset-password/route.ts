import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";
import Medusa from "@medusajs/js-sdk";

// Validation schema for reset password
const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  token: z.string().min(1, "Reset token is required")
});

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    // Validate request body
    const validationResult = resetPasswordSchema.safeParse(req.body);
    
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

    const { email, password, token } = validationResult.data;

    try {
      const sdk = new Medusa({
        baseUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
        auth: {
          type: "jwt"
        }
      });

      // Update the customer password using the reset token
      await sdk.auth.updateProvider("customer", "emailpass", {
        email,
        password,
      }, token);

      return res.status(200).json({
        success: true,
        message: "Password reset successfully"
      });

    } catch (error) {
      console.error("Reset password error:", error);

      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token. Please request a new password reset."
      });
    }

  } catch (error) {
    console.error("Reset password error:", error);
    
    return res.status(500).json({
      success: false,
      message: "Internal server error during password reset"
    });
  }
} 