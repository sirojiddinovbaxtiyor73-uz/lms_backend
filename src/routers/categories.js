import express from "express"
const router = express.Router()
import validationMiddleware from "../middleware/validation.js"
import {authGuard} from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"
import categoryController from "../controllers/categories.js"

router
    .get("/categories",authGuard,roleGuard("admin"),categoryController.getAllCategories)
    .post("/categories",authGuard,roleGuard("admin"),validationMiddleware.Createcategories,categoryController.createCategory)
    .delete("/categories/:categoryId",authGuard,roleGuard("admin"),categoryController.deleteCategory)

export default router