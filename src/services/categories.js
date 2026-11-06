import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"

class CategoryService {

    async getAllCategories() {
        let categories = await pool.query("select * from categories")

        return {
            status: 200,
            data: categories.rows
        }
    }

    async createCategory(req, res, next) {
        try {
            const { name } = req.body

            await pool.query(`insert into categories(name) values($1)`, [name])

            return {
                status: 201,
                message: "categories added!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async deleteCategory(req, res, next) {
        try {
            const { categoryId } = req.params

            if (!Number.isInteger(Number(categoryId))) {
                return next(new ErrorException(400, "enter only integer for categoryId"))
            }

            const existCategory = await pool.query(`select id from categories where id=$1`, [categoryId])
            if (!existCategory.rows.length) {
                return next(new ErrorException(404, "Category not found with this categoryId"))
            }
            await pool.query(`delete from categories where id=$1`, [categoryId])

            return {
                status: 200,
                message: "category deleted"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }
}

let categoryService = new CategoryService()
export default categoryService