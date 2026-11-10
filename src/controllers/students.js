import studentService from "../services/students.js"

class StudentController {
    async getAllStudents(req, res, next) {
        try {
            const result = await studentService.getAllStudents(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async getOneStudent(req, res, next) {
        try {
            const result = await studentService.getOneStudent(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async getStudentCourses(req, res, next) {
        try {
            const result = await studentService.getStudentCourses(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async createStudent(req, res, next) {
        try {
            const result = await studentService.createStudent(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async deleteStudent(req, res, next) {
        try {
            const result = await studentService.deleteStudent(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async updateStudent(req, res, next) {
        try {
            const result = await studentService.updateStudent(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }
}

const studentController = new StudentController()
export default studentController