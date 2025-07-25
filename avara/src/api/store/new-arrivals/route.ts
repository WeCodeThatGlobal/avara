import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const productService = req.scope.resolve("product");
  
  const products = await productService.listProducts({}, { 
    take: 100, 
    relations: ["variants", "images", "categories"] 
  });

  const newArrivalProducts = products.filter((product: any) => 
    product.metadata?.tags === "new-arrivals"
  ).slice(0, 8);

  const newArrivalProductsFormatted = newArrivalProducts.map((product: any) => {
    const variant = product.variants?.[0];
    const price = variant?.prices?.[0];

    return {
      image: product.images?.[0]?.url || "",
      name: product.title,
      category: product.categories?.[0]?.name || "",
      price: price?.amount
        ? `$${(price.amount / 100).toFixed(2)}`
        : "",
      oldPrice: null,
      rating: 4,
      packInfo: variant?.title || "",
      badge: "NEW",
      stockStatus: variant?.inventory_quantity > 0 ? "In Stock" : "Out Of Stock",
      stockStatusColor: variant?.inventory_quantity > 0 ? "text-green-500" : "text-gray-400",
    };
  });

  res.status(200).json({ products: newArrivalProductsFormatted });
} 