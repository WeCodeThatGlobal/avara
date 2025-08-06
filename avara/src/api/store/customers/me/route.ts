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

    // Get customer details
    const customerService = req.scope.resolve("customer");
    const customer = await customerService.retrieveCustomer(customerId, {
      select: ["id", "email", "first_name", "last_name", "created_at", "updated_at", "metadata"]
    });

    return res.status(200).json({
      success: true,
      data: {
        customer: {
          id: customer.id,
          email: customer.email,
          first_name: customer.first_name,
          last_name: customer.last_name,
          created_at: customer.created_at,
          updated_at: customer.updated_at,
          metadata: customer.metadata
        }
      }
    });

  } catch (error) {
    console.error("Get customer profile error:", error);
    
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export async function PUT(
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

    const { first_name, last_name, email } = req.body as { first_name: string, last_name: string, email: string };

    if (!first_name && !last_name && !email) {
      return res.status(400).json({
        success: false,
        message: "At least one field must be provided"
      });
    }

    const customerService = req.scope.resolve("customer");
    const updateData: any = {};
    
    if (first_name) updateData.first_name = first_name;
    if (last_name) updateData.last_name = last_name;
    if (email) updateData.email = email;

    const updatedCustomer = await customerService.updateCustomers(customerId, updateData);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        customer: {
          id: updatedCustomer.id,
          email: updatedCustomer.email,
          first_name: updatedCustomer.first_name,
          last_name: updatedCustomer.last_name,
          updated_at: updatedCustomer.updated_at
        }
      }
    });

  } catch (error) {
    console.error("Update customer profile error:", error);
    
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
} 