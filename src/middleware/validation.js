import { ErrorException } from "../utils/error.js"
import schema from "../utils/validation.js"

export default {
    staffCreate: (req, res, next) => {
        let { error } = schema.staffSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },

    createStudent: (req, res, next) => {
        let { error } = schema.studentSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },

    CourseCreate: (req, res, next) => {
        let { error } = schema.courseSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },

    CourseUpdate: (req, res, next) => {
        let { error } = schema.courseUpdateSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },


    teacherCreate: (req, res, next) => {
        let { error } = schema.teacherSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },

    teacherUpdate: (req, res, next) => {
        let { error } = schema.teacherUpdateSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },

    Createcategories: (req, res, next) => {
        let { error } = schema.categoriesSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))

        }
        return next()
    },

    studentUpdate: (req, res, next) => {
        let { error } = schema.studentUpdateSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },

    LessonCreate: (req, res, next) => {
        let { error } = schema.lessonSchema.validate(req.body ?? {})
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },

    LessonUpdate: (req, res, next) => {
        let { error } = schema.lessonUpdateSchema.validate(req.body ?? {})
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },

    MaterialCreate: (req, res, next) => {
        let { error } = schema.materialSchema.validate(req.body ?? {})
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },

    MaterialUpdate: (req, res, next) => {
        let { error } = schema.materialUpdateSchema.validate(req.body ?? {})
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },

    PaymentCreate: (req, res, next) => {
        let { error } = schema.paymentSchema.validate(req.body ?? {})
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },


    TaskCreate: (req, res, next) => {
        let { error } = schema.taskSchema.validate(req.body ?? {})
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },

    TaskUpdate: (req, res, next) => {
        let { error } = schema.taskUpdateSchema.validate(req.body ?? {})
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },

    ExamCreate: (req, res, next) => {
        let { error } = schema.examSchema.validate(req.body ?? {})
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },

    ExamUpdate: (req, res, next) => {
        let { error } = schema.examUpdateSchema.validate(req.body ?? {})
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },

    
}