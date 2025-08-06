import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";
import Medusa from "@medusajs/js-sdk";


// Validation schema for registration
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number")
});

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const validationResult = registerSchema.safeParse(req.body);
    
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

    const { name, email, password } = validationResult.data;

    const sdk = new Medusa({
      baseUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
      auth: {
        type: "jwt"
      }
    });

    try {
      // First, try to authenticate the user  - n(in case they already exist)
      try {
        const loginResult = await sdk.auth.login("customer", "emailpass", {
          email,
          password
        });

        // If login succeeds, user already exists and tehn authenticate
        const token = typeof loginResult === 'string' ? loginResult : (loginResult as any).location;

        return res.status(200).json({
          success: true,
          message: "User already exists and can be authenticated",
          data: {
            customer: {
              email: email
            },
            token: token
          }
        });
      } catch (loginError) {
        console.log("User doesn't exist, proceeding with registration");
      }

      const registerResult = await sdk.auth.register("customer", "emailpass", {
        email,
        password
      });

      const registerToken = typeof registerResult === 'string' ? registerResult : (registerResult as any).location;

      if (!registerToken) {
        return res.status(400).json({
          success: false,
          message: "Failed to get registration token"
        });
      }

      // Create customer with auth_identity_id in metadata
      const customerService = req.scope.resolve("customer");
      
      // Extract auth_identity_id from the register token
      const authService = req.scope.resolve("auth");
      let authIdentityId = null;
      
      try {
        const jwt = require('jsonwebtoken');
        const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
        const decoded = jwt.verify(registerToken, JWT_SECRET) as any;
        authIdentityId = decoded.auth_identity_id;
        console.log("Extracted auth_identity_id from register token:", authIdentityId);
      } catch (error) {
        console.error("Error decoding register token:", error);
      }
      
      const customer = await customerService.createCustomers({
        email,
        first_name: name.split(' ')[0] || name,
        last_name: name.split(' ').slice(1).join(' ') || '',
        metadata: authIdentityId ? { auth_identity_id: authIdentityId } : {}
      });

      return res.status(201).json({
        success: true,
        message: "Registration successful",
        data: {
          customer: {
            id: customer.id,
            email: customer.email,
            first_name: customer.first_name,
            last_name: customer.last_name,
            created_at: customer.created_at
          },
          token: registerToken
        }
      });

    } catch (error) {
      console.error("Registration error:", error);

      if (error.status === 409) {
        return res.status(409).json({
          success: false,
          message: "A user with this email already exists"
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error during registration"
      });
    }

  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error during registration"
    });
  }
}
