import examsService from "../services/exams.js"

class ExamController {

    async getAllExams(req, res, next) {
        try {
            const result = await examsService.getAllExams(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async createExam(req, res, next) {
        try {
            const result = await examsService.createExam(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async updateExam(req, res, next) {
        try {
            const result = await examsService.updateExam(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async deleteExam(req, res, next) {
        try {
            const result = await examsService.deleteExam(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }


    async getStudentExams(req, res, next) {
        try {
            const result = await examsService.getStudentExams(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async submitStudentExam(req, res, next) {
        try {
            const result = await examsService.submitStudentExam(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

}

const examController = new ExamController()
export default examController