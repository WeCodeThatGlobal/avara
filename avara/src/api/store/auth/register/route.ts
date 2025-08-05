import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";
import { generateToken } from "../../../../lib/jwt";

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

    const customerService = req.scope.resolve("customer");
    
    try {
      // Check if customer already exists
      const existingCustomers = await customerService.listCustomers({
        email: email
      });
      
      if (existingCustomers.length > 0) {
        return res.status(409).json({
          success: false,
          message: "A user with this email already exists"
        });
      }
    } catch (error) {
        // Customer doesn't exist, which is what we want for registration
    }

    // Create new customer
    const customer = await customerService.createCustomers({
      email,
      first_name: name.split(' ')[0] || name,
      last_name: name.split(' ').slice(1).join(' ') || '',
      password: password
    });

    const token = generateToken({
      customer_id: customer.id,
      email: customer.email
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
        token: token
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle specific Medusa errors
    if (error.type === "duplicate_error") {
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
}
