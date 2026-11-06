import studentService from "../services/categories.js"

class StudentController {
    async getAllStudents(req, res, next) {
        let resdate = await studentService.getAllStudents()
        return res.status(resdate.status).json(resdate)
    }
    async createStudent(req, res, next) {
        let resdate = await studentService.createStudent(req, res, next)
        if (resdate) {
            return res.status(resdate.status).json(resdate)

        }
    }
}

const studentController = new StudentController()
export default studentController