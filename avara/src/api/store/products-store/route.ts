import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const type = req.query.type as string || "all";
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    
    const productService = req.scope.resolve("product");
    
    const products = await productService.listProducts({}, { 
      take: 100, 
      relations: ["variants", "images", "categories"] 
    });

    let filteredProducts = products;

    // Filter products based on type
    if (type === "deal_of_the_day") {
      filteredProducts = products.filter((product: any) => 
        product.metadata?.tags === "deal_of_the_day"
      );
    } else if (type === "new_arrivals") {
      filteredProducts = products.filter((product: any) => 
        product.metadata?.tags === "new-arrivals"
      );
    }

    // Apply limit
    if (limit && limit < filteredProducts.length) {
      filteredProducts = filteredProducts.slice(0, limit);
    }

    const formattedProducts = filteredProducts.map((product: any) => {
      const variant = product.variants?.[0];
      const price = variant?.prices?.[0];

      return {
        id: product.id,
        description: product.description,
        image: product.images?.[0]?.url || "",
        name: product.title,
        category: product.categories?.[0]?.name || "",
        price: price?.amount
          ? `$${(price.amount / 100).toFixed(2)}`
          : "",
        oldPrice: null,
        rating: 4,
        packInfo: variant?.title || "",
        badge: type === "deal_of_the_day" ? "DEAL" : type === "new_arrivals" ? "NEW" : null,
        stockStatus: variant?.inventory_quantity > 0 ? "In Stock" : "Out Of Stock",
        stockStatusColor: variant?.inventory_quantity > 0 ? "text-green-500" : "text-gray-400",
        type: product.metadata?.tags || null,
      };
    });

    res.status(200).json({ 
      products: formattedProducts,
      total: formattedProducts.length,
      type: type
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ 
      error: "Failed to fetch products",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 