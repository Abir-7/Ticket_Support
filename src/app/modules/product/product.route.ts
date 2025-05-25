import { Router } from "express";
import { ProductController } from "./product.controller";

const router = Router();

router.post("/", ProductController.createProduct);
router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);
router.put("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

export const ProductRoute = router;
