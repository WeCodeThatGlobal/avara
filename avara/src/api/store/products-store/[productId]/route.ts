import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { title } from "process";

export async function GET(
  req: MedusaRequest, 
  res: MedusaResponse
) {
  try {
    const { productId } = req.params;
    const productService = req.scope.resolve("product");

    const product = await productService.retrieveProduct(productId, {
      relations: ["variants", "images", "categories"]
    });

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
        message: `No product found with ID ${productId}`
      });
    }

    const variant = product.variants?.[0];

    const priceAmount =
      (variant && (variant as any).prices?.[0]?.amount) ||
      (variant && (variant as any).price) ||
      (variant && (variant as any).metadata?.price) ||
      null;

    const formattedProduct = {
      id: product.id,
      title: product.title,
      image: product.images?.[0]?.url || "",
      name: product.title,
      description: product.description,
      category: product.categories?.[0]?.name || "",
      price: priceAmount
        ? `$${(priceAmount / 100).toFixed(2)}`
        : "",
      oldPrice: null,
      rating: 4,
      packInfo: variant?.title || "",
      type: product.metadata?.tags || null,
      
    };

    res.status(200).json({
      product: formattedProduct
    });

  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      error: "Failed to fetch product",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}