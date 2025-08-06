import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function POST(
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
      await customerService.updateCustomers(customerId, {
        metadata: {
          last_logout: new Date().toISOString()
        }
      });
    } catch (error) {
      console.warn("Failed to update logout timestamp:", error);
    }

    // For JWT tokens, the client should discard the token
    // We don't need to clear any server-side session
    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });

  } catch (error) {
    console.error("Logout error:", error);
    
    return res.status(500).json({
      success: false,
      message: "Internal server error during logout"
    });
  }
}
