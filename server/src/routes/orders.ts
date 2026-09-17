import { Router, Response } from "express";
import { prisma } from "../prisma";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

router.post("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { items, totalAmount } = req.body;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }
    const order = await prisma.order.create({
      data: {
        userId,
        items: items as any,
        totalAmount: Number(totalAmount),
        status: "PENDING",
      },
    });
    res.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

export default router;
