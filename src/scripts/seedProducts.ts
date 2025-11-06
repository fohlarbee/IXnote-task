import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product";

dotenv.config();

const convertSrvToDirect = (srvUri: string): string => {
  if (!srvUri.startsWith("mongodb+srv://")) {
    return srvUri;
  }

  const urlParts = srvUri.replace("mongodb+srv://", "mongodb://");
  const [baseUri, queryParams] = urlParts.split("?");
  
  const hostnameMatch = baseUri.match(/@([^/]+)/);
  if (!hostnameMatch) {
    return srvUri;
  }

  const hostname = hostnameMatch[1];
  const pathMatch = baseUri.match(/@[^/]+\/([^?]+)/);
  const database = pathMatch ? pathMatch[1] : "test";

  const directUri = baseUri.replace(`@${hostname}`, `@${hostname}:27017`);
  return `${directUri}${queryParams ? `?${queryParams}` : ""}`;
};

const products = [
  {
    name: "MacBook Pro 16-inch",
    description:
      "Powerful laptop with M2 Pro chip, 16GB RAM, and 512GB SSD. Perfect for professionals and creatives.",
    price: 2499.99,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    stock: 25,
  },
  {
    name: "iPhone 15 Pro",
    description:
      "Latest iPhone with A17 Pro chip, 256GB storage, and advanced camera system.",
    price: 999.99,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab",
    stock: 50,
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description:
      "Premium noise-canceling wireless headphones with exceptional sound quality.",
    price: 399.99,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    stock: 30,
  },
  {
    name: "Nike Air Max 270",
    description:
      "Comfortable running shoes with air cushioning technology and modern design.",
    price: 149.99,
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    stock: 75,
  },
  {
    name: "Levi's 501 Original Jeans",
    description:
      "Classic straight-fit jeans made from premium denim. Timeless style and durability.",
    price: 89.99,
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d",
    stock: 100,
  },
  {
    name: "Cotton T-Shirt",
    description:
      "Soft and comfortable 100% cotton t-shirt available in multiple colors.",
    price: 24.99,
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    stock: 200,
  },
  {
    name: "The Great Gatsby",
    description:
      "Classic American novel by F. Scott Fitzgerald. Paperback edition with beautiful cover design.",
    price: 12.99,
    category: "Books",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    stock: 150,
  },
  {
    name: "JavaScript: The Definitive Guide",
    description:
      "Comprehensive guide to JavaScript programming. Essential for web developers.",
    price: 49.99,
    category: "Books",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    stock: 80,
  },
  {
    name: "Standing Desk",
    description:
      "Adjustable height standing desk with electric motor. Ergonomic design for home office.",
    price: 399.99,
    category: "Furniture",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
    stock: 20,
  },
  {
    name: "Office Chair",
    description:
      "Ergonomic office chair with lumbar support and adjustable height. Perfect for long work sessions.",
    price: 249.99,
    category: "Furniture",
    imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237",
    stock: 35,
  },
  {
    name: "Coffee Table",
    description:
      "Modern wooden coffee table with clean lines. Fits perfectly in any living room.",
    price: 199.99,
    category: "Furniture",
    imageUrl: "https://images.unsplash.com/photo-1532372320572-cda25653a26d",
    stock: 15,
  },
  {
    name: "Wireless Mouse",
    description:
      "Ergonomic wireless mouse with precision tracking and long battery life.",
    price: 29.99,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db",
    stock: 120,
  },
  {
    name: "Mechanical Keyboard",
    description:
      "RGB backlit mechanical keyboard with Cherry MX switches. Ideal for gaming and typing.",
    price: 129.99,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
    stock: 60,
  },
  {
    name: "4K Monitor",
    description:
      "27-inch 4K UHD monitor with HDR support and USB-C connectivity.",
    price: 349.99,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf",
    stock: 40,
  },
  {
    name: "Yoga Mat",
    description:
      "Premium non-slip yoga mat with carrying strap. Perfect for home workouts.",
    price: 34.99,
    category: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f",
    stock: 90,
  },
  {
    name: "Dumbbell Set",
    description:
      "Adjustable dumbbell set with weights from 5 to 50 pounds. Space-saving design.",
    price: 199.99,
    category: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    stock: 25,
  },
  {
    name: "Running Shoes",
    description:
      "Lightweight running shoes with cushioned sole and breathable mesh upper.",
    price: 119.99,
    category: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    stock: 65,
  },
  {
    name: "Blender",
    description:
      "High-powered blender for smoothies, soups, and more. Easy to clean and dishwasher safe.",
    price: 79.99,
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d",
    stock: 45,
  },
  {
    name: "Coffee Maker",
    description:
      "Programmable coffee maker with thermal carafe. Makes up to 12 cups.",
    price: 89.99,
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1517668808823-83370c3e5570",
    stock: 55,
  },
  {
    name: "Air Fryer",
    description:
      "Digital air fryer with multiple cooking functions. Healthier alternative to deep frying.",
    price: 129.99,
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba",
    stock: 30,
  },
];

const connectWithRetry = async (
  uri: string,
  options: mongoose.ConnectOptions,
  isDirect = false
): Promise<void> => {
  try {
    await mongoose.connect(uri, options);
    console.log("Connected to MongoDB successfully");
  } catch (error: any) {
    if (
      (error.code === "ETIMEOUT" || error.code === "ENOTFOUND") &&
      !isDirect &&
      uri.startsWith("mongodb+srv://")
    ) {
      console.log("\nSRV connection failed, trying direct connection...");
      const directUri = convertSrvToDirect(uri);
      console.log("Direct connection string:", directUri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@"));
      await mongoose.connect(directUri, options);
      console.log("Connected to MongoDB using direct connection");
    } else {
      throw error;
    }
  }
};

const seedProducts = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error("MONGODB_URI is not defined in environment variables");
      console.error("Please set MONGODB_URI in your .env file");
      process.exit(1);
    }

    console.log("Attempting to connect to MongoDB...");
    console.log("Connection string:", mongoURI.replace(/\/\/[^:]+:[^@]+@/, "//***:***@"));

    const connectionOptions: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      retryWrites: true,
      w: "majority",
    };

    await connectWithRetry(mongoURI, connectionOptions);

    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      console.log(`Found ${existingProducts} existing products. Clearing...`);
      await Product.deleteMany({});
      console.log("Existing products cleared");
    }

    const createdProducts = await Product.insertMany(products);
    console.log(`Successfully seeded ${createdProducts.length} products`);

    const categories = await Product.distinct("category");
    console.log(`Categories created: ${categories.join(", ")}`);

    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  } catch (error: any) {
    console.error("\nError seeding products:");
    
    if (error.code === "ETIMEOUT" || error.code === "ENOTFOUND") {
      console.error("DNS/Network Error: Cannot resolve MongoDB hostname");
      console.error("\nTroubleshooting steps:");
      console.error("1. Check your internet connection");
      console.error("2. Verify MongoDB Atlas cluster is running (not paused)");
      console.error("3. Check if your IP address is whitelisted in MongoDB Atlas");
      console.error("4. Try using a direct connection string in your .env file:");
      console.error("   - Replace 'mongodb+srv://' with 'mongodb://'");
      console.error("   - Add ':27017' after the hostname");
      console.error("   Example: mongodb://username:password@cluster0.xxxxx.mongodb.net:27017/dbname");
      console.error("5. Check firewall/network restrictions");
      console.error("6. Try using a VPN or different network");
    } else if (error.code === "ENETUNREACH") {
      console.error("Network Error: Cannot reach MongoDB server");
      console.error("Check your internet connection and firewall settings");
    } else if (error.message?.includes("authentication")) {
      console.error("Authentication Error: Invalid credentials");
      console.error("Verify your MongoDB username and password in the connection string");
    } else {
      console.error("Error details:", error.message || error);
    }
    
    console.error("\nFull error:", error);
    
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedProducts();

