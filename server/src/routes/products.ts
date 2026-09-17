import { Router, Request, Response } from "express";
import { prisma } from "../prisma";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { search, origin, roastLevel, sortBy } = req.query;
    const where: any = {};

    if (search && typeof search === "string" && search.trim() !== "") {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { origin: { contains: search, mode: "insensitive" } },
      ];
    }

    if (origin && typeof origin === "string" && origin.trim() !== "") {
      where.origin = origin;
    }

    if (
      roastLevel &&
      typeof roastLevel === "string" &&
      roastLevel.trim() !== ""
    ) {
      where.roastLevel = roastLevel;
    }

    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "price-asc") orderBy = { price: "asc" };
    if (sortBy === "price-desc") orderBy = { price: "desc" };
    if (sortBy === "score-desc") orderBy = { score: "desc" };

    const products = await prisma.product.findMany({
      where,
      orderBy,
    });

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

export default router;
