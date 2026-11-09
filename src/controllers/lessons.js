import lessonsService from "../services/lessons.js"

class LessonController {
    async getAllLessons(req, res, next) {
        try {
            const result = await lessonsService.getAllLessons(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async createLesson(req, res, next) {
        try {
            const result = await lessonsService.createLesson(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async updateLesson(req, res, next) {
        try {
            const result = await lessonsService.updateLesson(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async deleteLesson(req, res, next) {
        try {
            const result = await lessonsService.deleteLesson(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }
}

const lessonController = new LessonController()
export default lessonController