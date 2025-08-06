import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const customerId = req.user?.customer_id;
    
    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
    }

    try {
      const customerService = req.scope.resolve("customer");
      const customer = await customerService.retrieveCustomer(customerId);

      if (!customer) {
        return res.status(401).json({
          success: false,
          message: "Customer not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Authentication check successful",
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
      console.error("Customer retrieval error:", error);
      return res.status(401).json({
        success: false,
        message: "Invalid authentication"
      });
    }

  } catch (error) {
    console.error("Auth check error:", error);
    
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication check"
    });
  }
} 