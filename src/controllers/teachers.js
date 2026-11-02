import teacherService from "../services/teachers.js"

class TeacherController {
    async createTeacher(req,res,next){
        let resData = await teacherService.createTeacher(req,res,next)

        return res.status(resData.status).json(resData)
    }

    async getTeachers(req,res,next){
        let resdata = await teacherService.getTeachers(req,res,next)

        return res.status(resdata.status).json(resdata)
    }
}

const teacherController = new TeacherController()

export default teacherController