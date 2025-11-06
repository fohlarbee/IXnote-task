import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import fs from "fs";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Product Listing API",
    version: "1.0.0",
    description:
      "A RESTful API for product listing, authentication, and shopping cart management built with TypeScript, Express, and MongoDB",
    contact: {
      name: "API Support",
    },
  },
  servers: [
    {
      url: "http://localhost:5000/api",
      description: "Development server",
    },
    {
      url: "https://web-production-3c6f.up.railway.app/api",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "User ID",
          },
          email: {
            type: "string",
            format: "email",
            description: "User email address",
          },
          name: {
            type: "string",
            description: "User full name",
          },
        },
      },
      Product: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "Product ID",
          },
          name: {
            type: "string",
            description: "Product name",
          },
          description: {
            type: "string",
            description: "Product description",
          },
          price: {
            type: "number",
            description: "Product price",
          },
          category: {
            type: "string",
            description: "Product category",
          },
          imageUrl: {
            type: "string",
            description: "Product image URL",
          },
          stock: {
            type: "number",
            description: "Available stock quantity",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      Cart: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "Cart ID",
          },
          user: {
            type: "string",
            description: "User ID",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                product: {
                  $ref: "#/components/schemas/Product",
                },
                quantity: {
                  type: "number",
                  description: "Item quantity",
                },
              },
            },
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          message: {
            type: "string",
            description: "Error message",
          },
        },
      },
      Success: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            description: "Success message",
          },
        },
      },
    },
  },
  tags: [
    {
      name: "Authentication",
      description: "User authentication endpoints",
    },
    {
      name: "Products",
      description: "Product management endpoints",
    },
    {
      name: "Cart",
      description: "Shopping cart management endpoints",
    },
  ],
};

const isProduction = process.env.NODE_ENV === "production";

const distRoutesPath = path.join(__dirname, "../routes");
const srcRoutesPath = path.join(process.cwd(), "src", "routes");

const apiPaths: string[] = [];

if (isProduction) {
  if (fs.existsSync(distRoutesPath)) {
    apiPaths.push(path.join(distRoutesPath, "*.js"));
    apiPaths.push(path.join(distRoutesPath, "*.ts"));
  }
  if (fs.existsSync(srcRoutesPath)) {
    apiPaths.push(path.join(srcRoutesPath, "*.ts"));
    apiPaths.push(path.join(srcRoutesPath, "*.js"));
  }
} else {
  apiPaths.push(path.join(srcRoutesPath, "*.ts"));
  apiPaths.push(path.join(srcRoutesPath, "*.js"));
}

const options = {
  definition: swaggerDefinition,
  apis: apiPaths,
};

const swaggerSpec = swaggerJsdoc(options) as {
  paths?: Record<string, unknown>;
};

export { swaggerSpec };
