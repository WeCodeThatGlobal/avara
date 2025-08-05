import { defineMiddlewares } from "@medusajs/framework/http"
import type {
  MedusaRequest,
  MedusaResponse,
  MedusaNextFunction,
} from "@medusajs/framework/http";
import { verifyToken, extractCustomerIdFromToken } from "../lib/jwt";

// Extend MedusaRequest to include user property
declare module "@medusajs/framework/http" {
  interface MedusaRequest {
    user?: {
      customer_id: string;
      email: string;
    };
  }
}

/**
 * Authentication middleware to verify JWT tokens
 */
async function authenticateCustomer(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing or invalid"
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is required"
      });
    }

    try {
      const payload = verifyToken(token);
      
      if (!payload || !payload.customer_id) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token"
        });
      }

      // Verify customer exists
      const customerService = req.scope.resolve("customer");
      const customer = await customerService.retrieveCustomer(payload.customer_id);
      
      if (!customer) {
        return res.status(401).json({
          success: false,
          message: "Customer not found"
        });
      }

      req.user = {
        customer_id: customer.id,
        email: customer.email
      };

      next();
    } catch (error) {
      console.error("Token validation error:", error);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token"
      });
    }
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication"
    });
  }
}



/**
 * Optional authentication middleware - doesn't fail if no token provided
 */
async function optionalAuthenticateCustomer(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      next();
      return;
    }

    try {
      const payload = verifyToken(token);
      
      if (payload && payload.customer_id) {
        const customerService = req.scope.resolve("customer");
        const customer = await customerService.retrieveCustomer(payload.customer_id);
        
        if (customer) {
          req.user = {
            customer_id: customer.id,
            email: customer.email
          };
        }
      }
    } catch (error) {
      console.warn("Optional authentication failed:", error);
    }

    next();
  } catch (error) {
    console.error("Optional authentication middleware error:", error);
    next();
  }
}

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/auth/logout",
      middlewares: [authenticateCustomer],
    },
    {
      matcher: "/store/customers/me",
      middlewares: [authenticateCustomer],
    },
    {
      matcher: "/store/customers/profile",
      middlewares: [authenticateCustomer],
    },
    {
      matcher: "/store/customers/addresses",
      middlewares: [authenticateCustomer],
    },
    {
      matcher: "/store/customers/payment-methods",
      middlewares: [authenticateCustomer],
    },
    {
      matcher: "/store/carts",
      middlewares: [optionalAuthenticateCustomer],
    },
    {
      matcher: "/store/orders",
      middlewares: [authenticateCustomer],
    },
  ],
}) 