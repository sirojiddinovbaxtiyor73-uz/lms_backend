import teacherService from "../services/teachers.js"

class TeacherController {
    async createTeacher(req, res, next) {
        let resdata = await teacherService.createTeacher(req, res, next)
        if (!resdata) return
        return res.status(resdata.status).json(resdata)
    }

    async getTeachers(req, res, next) {
        let resdata = await teacherService.getTeachers(req, res, next)
        if (!resdata) return
        return res.status(resdata.status).json(resdata)
    }

    async deleteTeacher(req, res, next) {
        let resdata = await teacherService.deleteTeacher(req, res, next)
        if (!resdata) return

        return res.status(resdata.status).json(resdata)
    }

    async updateTeacher(req, res, next) {
        let resdata = await teacherService.updateTeacher(req, res, next)
        if (!resdata) return

        return res.status(resdata.status).json(resdata)
    }
}

const teacherController = new TeacherController()

export default teacherController