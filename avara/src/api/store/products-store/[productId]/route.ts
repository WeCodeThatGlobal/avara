import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
// import { title } from "process";

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

    const firstVariant = product.variants?.[0];

    const priceAmount =
      (firstVariant && (firstVariant as any).prices?.[0]?.amount) ||
      (firstVariant && (firstVariant as any).price) ||
      (firstVariant && (firstVariant as any).metadata?.price) ||
      null;

    const formattedVariants = (product.variants || []).map((v: any) => ({
      id: v.id,
      title: v.title,
      sku: v.sku,
      inventory_quantity: v.inventory_quantity,
      available: typeof v.inventory_quantity === 'number' ? v.inventory_quantity > 0 : undefined,
      prices: ((v as any).prices || []).map((p: any) => ({
        currency_code: p.currency_code,
        amount: p.amount,
      })),
    }));

    const formattedProduct = {
      id: product.id,
      title: product.title,
      name: product.title,
      description: product.description,
      image: product.images?.[0]?.url || "",
      images: (product.images || []).map((img: any) => img.url).filter(Boolean),
      category: product.categories?.[0]?.name || "",
      price: priceAmount ? `$${(priceAmount / 100).toFixed(2)}` : "",
      oldPrice: null,
      rating: product.metadata?.rating ?? 4,
      rating_count: product.metadata?.rating_count ?? null,
      in_stock: formattedVariants.some((v) => v.available),
      variants: formattedVariants,
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