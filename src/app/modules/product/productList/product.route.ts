import { Router } from "express";
import { ProductController } from "./product.controller";
import { auth } from "../../../middleware/auth/auth";

import { parseDataField } from "../../../middleware/fileUpload/parseDataField";
import { upload } from "../../../middleware/fileUpload/fileUploadHandler";
import zodValidator from "../../../middleware/zodValidator";
import { productUpdateZodSchema, productZodSchema } from "./product.validation";

const router = Router();

router.post(
  "/add",
  auth("ADMIN"),
  upload.single("image"),
  parseDataField("data"),
  zodValidator(productZodSchema),
  ProductController.createProduct
);
router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);
router.put(
  "/:id",
  auth("ADMIN"),
  upload.single("image"),
  parseDataField("data"),
  zodValidator(productUpdateZodSchema),
  ProductController.updateProduct
);
router.delete("/:id", ProductController.deleteProduct);

export const ProductRoute = router;
