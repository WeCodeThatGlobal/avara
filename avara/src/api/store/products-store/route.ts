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
      take: limit, 
      relations: ["images", "categories"] 
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
      return {
        id: product.id,
        name: product.title,
        description: product.description,
        image: product.images?.[0]?.url || "",
        category: product.categories?.[0]?.name || "",
        rating: product.metadata?.rating ?? 4,
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