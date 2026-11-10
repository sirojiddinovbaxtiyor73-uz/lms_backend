import tasksService from "../services/tasks.js"

class TaskController {
    async getLessonTasks(req, res, next) {
        try {
            const result = await tasksService.getLessonTasks(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async getStudentTasks(req, res, next) {
        try {
            const result = await tasksService.getStudentTasks(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async createTask(req, res, next) {
        try {
            const result = await tasksService.createTask(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async updateTask(req, res, next) {
        try {
            const result = await tasksService.updateTask(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async deleteTask(req, res, next) {
        try {
            const result = await tasksService.deleteTask(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }
}

const taskController = new TaskController()
export default taskController