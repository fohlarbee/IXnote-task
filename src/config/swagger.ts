import swaggerJsdoc from "swagger-jsdoc";

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
      url: "http://localhost:5000",
      description: "Development server",
    },
    {
      url: "https://your-production-url.com",
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

const options = {
  definition: swaggerDefinition,
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
