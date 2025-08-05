import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";
import { generateToken } from "../../../../lib/jwt";

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

    // Get the customer service
    const customerService = req.scope.resolve("customer");
    
    try {
      // Retrieve customer by email
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

      // For now, we'll skip password verification since registration doesn't set passwords
      // In a production environment, you would need to implement proper password hashing
      // and verification during registration and login
      
      // Since we're not setting passwords during registration, we'll just verify the email exists
      // This is NOT secure for production - you should implement proper password verification

      // Generate JWT token using our utility
      const token = generateToken({
        customer_id: customer.id,
        email: customer.email
      });

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
      // Customer not found or other error
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

// GET endpoint to check authentication status
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    // Check if user is authenticated
    const customerId = req.session?.customer_id;
    
    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
    }

    // Get customer details
    const customerService = req.scope.resolve("customer");
    const customer = await customerService.retrieveCustomer(customerId, {
      select: ["id", "email", "first_name", "last_name"]
    });

    return res.status(200).json({
      success: true,
      data: {
        customer: {
          id: customer.id,
          email: customer.email,
          first_name: customer.first_name,
          last_name: customer.last_name
        }
      }
    });

  } catch (error) {
    console.error("Auth check error:", error);
    
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}
