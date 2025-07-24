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

  const dealProducts = products.filter((product: any) => 
    product.metadata?.tags === "deal_of_the_day"
  );

  const dealProductsFormatted = dealProducts.map((product: any) => ({
    image: product.images?.[0]?.url || "",
    name: product.title,
    category: product.categories?.[0]?.name || "",
    price: product.variants?.[0]?.prices?.[0]?.amount
      ? `$${(product.variants[0].prices[0].amount / 100).toFixed(2)}`
      : "",
    oldPrice: null,
    rating: 4,
    packInfo: product.variants?.[0]?.title || "",
    badge: "DEAL",
    stockStatus: product.variants?.[0]?.inventory_quantity > 0 ? "In Stock" : "Out Of Stock",
    stockStatusColor: product.variants?.[0]?.inventory_quantity > 0 ? "text-green-500" : "text-gray-400",
  }));

  res.status(200).json({ products: dealProductsFormatted });
}
