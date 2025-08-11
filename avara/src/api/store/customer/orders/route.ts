import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";

const orderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  image: z.string().optional(),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  subtotal: z.number().nonnegative(),
  shipping: z.number().nonnegative().default(0),
  total: z.number().nonnegative(),
  payment_method: z.enum(["cash", "card"]).default("cash"),
  billing_details: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    address: z.string().min(1),
    country: z.string().min(1),
    postCode: z.string().min(1),
  }),
});

type OrderItem = z.infer<typeof orderItemSchema>;

type OrderRecord = {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  payment_method: "cash" | "card";
  status: "created" | "processing" | "completed" | "cancelled";
  billing_details: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    country: string;
    postCode: string;
  };
  created_at: string;
};

function generateOrderId(): string {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  const ts = Date.now().toString(36).toUpperCase();
  return `ORD-${ts}-${random}`;
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const customerId = req.user?.customer_id;
    if (!customerId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const customerService = req.scope.resolve("customer");
    const customer = await customerService.retrieveCustomer(customerId, { select: ["id", "metadata"] });
    const orders: OrderRecord[] = Array.isArray(customer?.metadata?.orders)
      ? (customer.metadata.orders as OrderRecord[])
      : [];

    orders.sort((a, b) => (b.created_at > a.created_at ? 1 : -1));

    return res.status(200).json({ success: true, data: { orders } });
  } catch (error) {
    console.error("List orders error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const customerId = req.user?.customer_id;
    const customerEmail = req.user?.email;
    if (!customerId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const parseResult = createOrderSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid order payload",
        errors: parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
      });
    }

    const payload = parseResult.data;
    const customerService = req.scope.resolve("customer");
    const customer = await customerService.retrieveCustomer(customerId, { select: ["id", "metadata", "email"] });

    const computedSubtotal = payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const computedTotal = computedSubtotal + payload.shipping;
    const totalsMismatch =
      Math.round(computedSubtotal * 100) !== Math.round(payload.subtotal * 100) ||
      Math.round(computedTotal * 100) !== Math.round(payload.total * 100);

    const newOrder: OrderRecord = {
      id: generateOrderId(),
      items: payload.items,
      subtotal: totalsMismatch ? computedSubtotal : payload.subtotal,
      shipping: payload.shipping,
      total: totalsMismatch ? computedTotal : payload.total,
      payment_method: payload.payment_method,
      status: "created",
      billing_details: payload.billing_details,
      created_at: new Date().toISOString(),
    };

    const existingOrders: OrderRecord[] = Array.isArray(customer?.metadata?.orders)
      ? (customer.metadata.orders as OrderRecord[])
      : [];

    const updatedMetadata = {
      ...(customer?.metadata || {}),
      orders: [...existingOrders, newOrder],
      last_order_id: newOrder.id,
      last_order_at: newOrder.created_at,
      last_order_email: customerEmail || customer?.email,
    } as Record<string, unknown>;

    const updated = await customerService.updateCustomers(customerId, { metadata: updatedMetadata });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: { order: newOrder, customer: { id: updated.id } },
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}


