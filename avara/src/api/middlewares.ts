import { defineMiddlewares } from "@medusajs/framework/http"
import type {
  MedusaRequest,
  MedusaResponse,
  MedusaNextFunction,
} from "@medusajs/framework/http";
import jwt from 'jsonwebtoken';

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
      // Verify JWT token using Medusa's JWT secret
      const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

      const decoded = jwt.verify(token, JWT_SECRET) as any;

      // Medusa JWT tokens use auth_identity_id instead of customer_id
      if (!decoded || !decoded.auth_identity_id) {
        console.log("Invalid or expired token - no auth_identity_id");
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token"
        });
      }

      const customerService = req.scope.resolve("customer");
      console.log("Customer service resolved");

      let customer: any = null;

      if (decoded.actor_id && decoded.actor_id.trim() !== '') {
        console.log("Trying to get customer by actor_id:", decoded.actor_id);
        try {
          customer = await customerService.retrieveCustomer(decoded.actor_id);
          console.log("Customer found by actor_id:", customer ? "Yes" : "No");
        } catch (error) {
          console.log("Error getting customer by actor_id:", error);
        }
      }

      if (!customer) {
        console.log("Trying to get customer from auth identity");
        const authService = req.scope.resolve("auth");

        try {
          const authIdentity = await authService.retrieveAuthIdentity(decoded.auth_identity_id);
          console.log("Auth identity retrieved:", authIdentity);

          if (authIdentity) {
            if (authIdentity.app_metadata) {
              const metadata = authIdentity.app_metadata as any;
              if (metadata.email) {
                const customers = await customerService.listCustomers({ email: metadata.email });
                customer = customers[0];
                console.log("Customer found by metadata email:", customer ? "Yes" : "No");
              }
            }
          }
        } catch (error) {
          console.log("Error getting customer from auth identity:", error);
        }
      }

      if (!customer) {
        console.log("Trying to find customer by checking all customers metadata");
        try {
          const allCustomers = await customerService.listCustomers();
          for (const cust of allCustomers) {
            if (cust.metadata && (cust.metadata as any).auth_identity_id === decoded.auth_identity_id) {
              customer = cust;
              console.log("Customer found by metadata auth_identity_id:", customer ? "Yes" : "No");
              break;
            }
          }
        } catch (error) {
          console.log("Error searching all customers:", error);
        }
      }

      if (!customer) {
        console.log("Customer not found in database");
        return res.status(401).json({
          success: false,
          message: "Customer not found"
        });
      }

      req.user = {
        customer_id: customer.id,
        email: customer.email
      };
      console.log("User object set:", req.user);

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
      const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      if (decoded && decoded.auth_identity_id) {
        const customerService = req.scope.resolve("customer");
        let customer: any = null;

        // First try: if actor_id is not empty, use it as customer_id
        if (decoded.actor_id && decoded.actor_id.trim() !== '') {
          try {
            customer = await customerService.retrieveCustomer(decoded.actor_id);
          } catch (error) {
            console.warn("Optional authentication - error getting customer by actor_id:", error);
          }
        }

        // Second try: get auth identity and find customer by email
        if (!customer) {
          const authService = req.scope.resolve("auth");

          try {
            const authIdentity = await authService.retrieveAuthIdentity(decoded.auth_identity_id);

            if (authIdentity && authIdentity.app_metadata) {
              const metadata = authIdentity.app_metadata as any;
              if (metadata.email) {
                const customers = await customerService.listCustomers({ email: metadata.email });
                customer = customers[0];
              }
            }
          } catch (error) {
            console.warn("Optional authentication - error retrieving auth identity:", error);
          }
        }

        // Third try: Since we can't get email from auth identity, let's try to find the customer
        // by looking at all customers and checking if any have the same auth_identity_id in their metadata
        if (!customer) {
          try {
            const allCustomers = await customerService.listCustomers();
            for (const cust of allCustomers) {
              if (cust.metadata && (cust.metadata as any).auth_identity_id === decoded.auth_identity_id) {
                customer = cust;
                break;
              }
            }
          } catch (error) {
            console.warn("Optional authentication - error searching all customers:", error);
          }
        }

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
      matcher: "/store/auth/me",
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
    {
      matcher: "/store/auth/forgot-password",
      middlewares: [optionalAuthenticateCustomer],
    },
  ],
}) 