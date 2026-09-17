import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const INITIAL_PRODUCTS = [
  {
    title: "Ethiopia Yirgacheffe",
    description:
      "Vibrant specialty coffee featuring floral notes of jasmine, bergamot, and sweet peach. Bright citric acidity.",
    price: 12,
    origin: "Ethiopia",
    processing: "Washed",
    roastLevel: "Light (Filter)",
    flavorProfile: ["Jasmine", "Bergamot", "Peach"],
    score: 87.5,
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop",
    inStock: true,
    weights: [250, 1000],
    grindOptions: ["Whole Bean", "Espresso", "Filter", "French Press"],
  },
  {
    title: "Colombia Huila Pink Bourbon",
    description:
      "Rare Pink Bourbon cultivar. Intense sweetness with redcurrant, raspberry, and brown sugar notes.",
    price: 15,
    origin: "Colombia",
    processing: "Natural Anaerobic",
    roastLevel: "Light (Filter)",
    flavorProfile: ["Raspberry", "Redcurrant", "Caramel"],
    score: 88.0,
    image:
      "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=800&auto=format&fit=crop",
    inStock: true,
    weights: [250, 1000],
    grindOptions: ["Whole Bean", "Espresso", "Filter", "French Press"],
  },
  {
    title: "Brazil Cerrado Blend",
    description:
      "Classic rich profile with roasted hazelnut, dark chocolate, and dried fruit notes. Low acidity.",
    price: 10,
    origin: "Brazil",
    processing: "Natural",
    roastLevel: "Medium (Espresso)",
    flavorProfile: ["Hazelnut", "Dark Chocolate", "Dried Fruit"],
    score: 83.5,
    image:
      "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?q=80&w=800&auto=format&fit=crop",
    inStock: true,
    weights: [250, 1000],
    grindOptions: ["Whole Bean", "Espresso", "Moka Pot", "French Press"],
  },
  {
    title: "Kenya Nyeri AA",
    description:
      "Powerful juicy acidity with blackcurrant, grapefruit, and a long rosehip finish.",
    price: 14,
    origin: "Kenya",
    processing: "Washed",
    roastLevel: "Light (Filter)",
    flavorProfile: ["Blackcurrant", "Grapefruit", "Rosehip"],
    score: 87.0,
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
    inStock: true,
    weights: [250, 1000],
    grindOptions: ["Whole Bean", "Espresso", "Filter", "French Press"],
  },
];

async function main() {
  console.log("Seeding initial coffee products...");
  await prisma.product.deleteMany({});

  for (const product of INITIAL_PRODUCTS) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
