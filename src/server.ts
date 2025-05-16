import express from "express";
import userRoutes from "./routes/user.routes"
import postRoutes from "./routes/post.routes"
import authRoutes from "./routes/auth.routes"
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"


const app = express();
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Travel App API",
      version: "1.0.0",
      description: "API para implementar o aplicativo TravelApp",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/schemas/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/auth', authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello World Express" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
