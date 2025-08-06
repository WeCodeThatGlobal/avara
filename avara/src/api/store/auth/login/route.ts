import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";
import Medusa from "@medusajs/js-sdk";


// Validation schema for login
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    // Validate request body
    const validationResult = loginSchema.safeParse(req.body);
    
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

    const { email, password } = validationResult.data;

    try {
      const sdk = new Medusa({
        baseUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
        auth: {
          type: "jwt"
        }
      });

      // Use Medusa's built-in authentication
      const authResult = await sdk.auth.login("customer", "emailpass", {
        email,
        password
      });

      const token = typeof authResult === 'string' ? authResult : (authResult as any).location;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Authentication failed"
        });
      }

      // Get customer details
      const customerService = req.scope.resolve("customer");
      const customers = await customerService.listCustomers({
        email: email
      });

      const customer = customers[0];

      if (!customer) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }

      // Update last login timestamp
      await customerService.updateCustomers(customer.id, {
        metadata: {
          ...customer.metadata,
          last_login: new Date().toISOString()
        }
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          customer: {
            id: customer.id,
            email: customer.email,
            first_name: customer.first_name,
            last_name: customer.last_name
          },
          token: token
        }
      });

    } catch (error) {
      console.error("Authentication error:", error);

      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

  } catch (error) {
    console.error("Login error:", error);
    
    return res.status(500).json({
      success: false,
      message: "Internal server error during login"
    });
  }
}
