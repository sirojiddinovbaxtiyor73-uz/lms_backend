import categoryService from "../services/categories.js"

class CategoryController {
    async getAllCategories(req, res, next) {
        let resdate = await categoryService.getAllCategories()
        return res.status(resdate.status).json(resdate)
    }
    async createCategory(req, res, next) {
        let resdate = await categoryService.createCategory(req, res, next)
        if (resdate) {
            return res.status(resdate.status).json(resdate)

        }
    }

    async deleteCategory(req, res, next) {
        let resdate = await categoryService.deleteCategory(req, res, next)
        if (resdate) {
            return res.status(resdate.status).json(resdate)

        }
    }
}

const categoryController = new CategoryController()
export default categoryController