import coursesService from "../services/courses.js"

class CoursesController {
    async getAllCourses(req, res, next) {
        let resdate = await coursesService.getAllCourses()
        return res.status(resdate.status).json(resdate)
    }
    async createCourse(req, res, next) {
        let resdate = await coursesService.createCourse(req, res, next)
        if (resdate) {
            return res.status(resdate.status).json(resdate)

        }
    }
}

const coursesController = new CoursesController()
export default coursesController