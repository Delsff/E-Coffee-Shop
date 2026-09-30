import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "coffee-beans" | "accessories" | "equipment";
  roastLevel?: "light" | "medium" | "dark";
  imageUrl: string;
  inStock: boolean;
};

type CustomerInfo = {
  fullName: string;
  email: string;
  address: string;
};

type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  customer: CustomerInfo;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "completed";
  createdAt: string;
};

const products: Product[] = [
  {
    id: "1",
    name: "Ethiopia Yirgacheffe",
    description:
      "Washed process coffee with vibrant notes of bergamot, jasmine, and bright lemongrass acidity.",
    price: 1550,
    category: "coffee-beans",
    roastLevel: "light",
    imageUrl:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=600&auto=format&fit=crop",
    inStock: true,
  },
  {
    id: "2",
    name: "Colombia Huila Reserve",
    description:
      "Smooth balanced cup featuring sweet red apple, caramel, and a juicy citrus finish.",
    price: 1400,
    category: "coffee-beans",
    roastLevel: "medium",
    imageUrl:
      "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=600&auto=format&fit=crop",
    inStock: true,
  },
  {
    id: "3",
    name: "Brazil Cerrado Mineiro",
    description:
      "Low acidity bean with a rich body, offering creamy milk chocolate and toasted hazelnut notes.",
    price: 1250,
    category: "coffee-beans",
    roastLevel: "medium",
    imageUrl:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop",
    inStock: true,
  },
  {
    id: "4",
    name: "Kenya AA Nyeri",
    description:
      "Complex and bold African specialty with tart blackcurrant, grapefruit zest, and cane sugar sweetness.",
    price: 1750,
    category: "coffee-beans",
    roastLevel: "light",
    imageUrl:
      "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?q=80&w=600&auto=format&fit=crop",
    inStock: true,
  },
  {
    id: "5",
    name: "Sumatra Mandheling",
    description:
      "Heavy-bodied dark roast with earthy notes, fresh cedar, spice, and a dark chocolate finish.",
    price: 1350,
    category: "coffee-beans",
    roastLevel: "dark",
    imageUrl:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=600&auto=format&fit=crop",
    inStock: true,
  },
  {
    id: "6",
    name: "Guatemala Antigua",
    description:
      "Volcanic soil coffee with elegant cocoa nuances, subtle orange blossom, and a spicy kick.",
    price: 1450,
    category: "coffee-beans",
    roastLevel: "medium",
    imageUrl:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600&auto=format&fit=crop",
    inStock: true,
  },
  {
    id: "7",
    name: "Costa Rica Tarrazú",
    description:
      "High-altitude beans delivering clean acidity with notes of honey, stone fruit, and green apple.",
    price: 1600,
    category: "coffee-beans",
    roastLevel: "light",
    imageUrl:
      "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?q=80&w=600&auto=format&fit=crop",
    inStock: true,
  },
  {
    id: "8",
    name: "Night Owl Espresso Blend",
    description:
      "Dark roasted signature blend engineered for espresso. Deep crema, molasses, and dark cocoa body.",
    price: 1300,
    category: "coffee-beans",
    roastLevel: "dark",
    imageUrl:
      "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=600&auto=format&fit=crop",
    inStock: true,
  },
];

const orders: Order[] = [];

app.get("/api/products", (req: Request, res: Response) => {
  res.json(products);
});

app.get("/api/orders", (req: Request, res: Response) => {
  res.json(orders);
});

app.post("/api/orders", (req: Request, res: Response) => {
  const { customer, items, totalAmount } = req.body;

  if (!customer || !items || items.length === 0) {
    res.status(400).json({ error: "Customer info and items are required." });
    return;
  }

  const newOrder: Order = {
    id: `ORD-${Date.now()}`,
    customer,
    items,
    totalAmount,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);

  console.log("====================================");
  console.log("New order received:", JSON.stringify(newOrder, null, 2));
  console.log("====================================");

  res.status(201).json(newOrder);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
