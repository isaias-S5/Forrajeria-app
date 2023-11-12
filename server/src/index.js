import express from "express";
import cors from "cors";
import { PORT } from "./helpers/config.js";

//routes
import auth from "./routes/auth.routes.js";
import productsRoutes from "./routes/products.routes.js";
import saleRoutes from "./routes/sales.routes.js"
import userRoutes from "./routes/users.routes.js"
import categoriesRoutes from "./routes/categories.routes.js"
import supplierRoutes from "./routes/suppliers.routes.js"

const app = express();

app.use(express.json({ limit: '10mb' }));

app.use(cors());

app.use("/api/auth", auth);
app.use("/api", saleRoutes);
app.use('/api', userRoutes);
app.use("/api", productsRoutes);
app.use("/api", categoriesRoutes);
app.use("/api", supplierRoutes);
app.listen(PORT);

console.log(`server listening on port ${PORT}`);
