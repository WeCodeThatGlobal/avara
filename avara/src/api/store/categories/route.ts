import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const productService = req.scope.resolve("product");

    const categories = await (productService as any).listProductCategories?.(
      {},
      { take: 1000, select: ["id", "name", "handle"] }
    );

    if (Array.isArray(categories)) {
      const payload = categories
        .map((c: any) => ({ id: c.id, name: c.name ?? c.title ?? c.handle ?? "", handle: c.handle, count: (c as any).product_count ?? 0 }))
        .sort((a: any, b: any) => a.name.localeCompare(b.name));
      return res.status(200).json({ categories: payload, total: payload.length });
    }

    const products = await productService.listProducts({}, { relations: ["categories"], take: 1000 });
    const idToCategory: Record<string, { id: string; name: string; count: number }> = {};
    for (const product of products as any[]) {
      const cats = product.categories || [];
      for (const cat of cats) {
        if (!cat?.id) continue;
        if (!idToCategory[cat.id]) {
          idToCategory[cat.id] = { id: cat.id, name: cat.name || "", count: 0 };
        }
        idToCategory[cat.id].count += 1;
      }
    }
    const fallback = Object.values(idToCategory).sort((a, b) => a.name.localeCompare(b.name));
    return res.status(200).json({ categories: fallback, total: fallback.length });
  } catch (e) {
    console.error("Error fetching categories:", e);
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
}


