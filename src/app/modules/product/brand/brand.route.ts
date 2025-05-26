import { Router } from "express";
import { BrandController } from "./brand.controller";
import { auth } from "../../../middleware/auth/auth";
import { upload } from "../../../middleware/fileUpload/fileUploadHandler";
import { parseDataField } from "../../../middleware/fileUpload/parseDataField";
import zodValidator from "../../../middleware/zodValidator";
import { brandZodSchema } from "./brand.validation";

const router = Router();

router.post(
  "/add",
  auth("ADMIN"),
  upload.single("image"),
  parseDataField("data"),
  zodValidator(brandZodSchema),
  BrandController.createBrand
);
router.get("/", auth("ADMIN", "USER"), BrandController.getAllBrands);
router.get("/:id", auth("ADMIN", "USER"), BrandController.getBrandById);
router.put(
  "/:id",
  auth("ADMIN"),
  upload.single("image"),
  parseDataField("data"),
  BrandController.updateBrand
);
router.delete("/:id", auth("ADMIN"), BrandController.deleteBrand);

export const BrandRoute = router;
