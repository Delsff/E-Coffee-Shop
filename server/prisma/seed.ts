import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        title: "Ethiopia Yirgacheffe",
        origin: "Ethiopia",
        roastLevel: "Medium",
        price: 18.5,
        score: 89,
        flavorProfile: ["Jasmine", "Lemon", "Bergamot"],
        description: "Floral and complex coffee with bright citrus acidity.",
        processing: "Washed",
        image:
          "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800",
      },
      {
        title: "Colombia Huila",
        origin: "Colombia",
        roastLevel: "Dark",
        price: 16.0,
        score: 86,
        flavorProfile: ["Caramel", "Red Apple", "Dark Chocolate"],
        description: "Smooth body with rich caramel sweetness.",
        processing: "Natural",
        image:
          "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800",
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
