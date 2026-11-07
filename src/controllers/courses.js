import coursesService from "../services/courses.js"

class CoursesController {
    async getAllCourses(req, res, next) {
        try {
            const result = await coursesService.getAllCourses()
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async createCourse(req, res, next) {
        try {
            const result = await coursesService.createCourse(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async deleteCourse(req, res, next) {
        try {
            const result = await coursesService.deleteCourse(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async updateCourse(req, res, next) {
        try {
            const result = await coursesService.updateCourse(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }
}

const coursesController = new CoursesController()
export default coursesController