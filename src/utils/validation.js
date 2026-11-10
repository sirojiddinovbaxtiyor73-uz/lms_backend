import Joi from "joi"

export default {
    staffSchema: Joi.object({
        fullname: Joi.string().min(3).max(30).required(),
        phone: Joi.string().pattern(/^\+998(9[0123456789]|3[3]|7[1]|8[8])[0-9]{7}$/).required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().required()
    }),

    teacherSchema: Joi.object({
        fullname: Joi.string().min(3).max(30).required(),
        phone: Joi.string().pattern(/^\+998(9[0123456789]|3[3]|7[1]|8[8])[0-9]{7}$/).required(),
        password: Joi.string().min(6).required(),
        photo: Joi.string().allow("", null),
        experience: Joi.number().integer().min(0).required(),
        job: Joi.string().min(2).max(50).required(),
        description: Joi.string().allow("", null),
        portfolio: Joi.string().allow("", null),
        github: Joi.string().allow("", null),
        telegram: Joi.string().allow("", null),
        linkedin: Joi.string().allow("", null),
        facebook: Joi.string().allow("", null),
        instagram: Joi.string().allow("", null),
        status: Joi.string().valid("active", "inactive")
    }),

    teacherUpdateSchema: Joi.object({
        fullname: Joi.string().min(3).max(30),
        phone: Joi.string().pattern(/^\+998(9[0123456789]|3[3]|7[1]|8[8])[0-9]{7}$/),
        password: Joi.string().min(6),
        experience: Joi.number().integer().min(0),
        job: Joi.string().min(2).max(50),
        description: Joi.string().allow("", null),
        portfolio: Joi.string().allow("", null),
        github: Joi.string().allow("", null),
        telegram: Joi.string().allow("", null),
        linkedin: Joi.string().allow("", null),
        facebook: Joi.string().allow("", null),
        instagram: Joi.string().allow("", null),
        status: Joi.string().valid("active", "inactive")
    }).min(1),

    categoriesSchema: Joi.object({
        name: Joi.string().min(3).max(30).required()
    }),

    studentSchema: Joi.object({
        fullname: Joi.string().min(3).max(30).required(),
        phone: Joi.string().pattern(/^\+998(9[0123456789]|3[3]|7[1]|8[8])[0-9]{7}$/).required(),
        password: Joi.string().min(6).required()

    }),

    studentUpdateSchema: Joi.object({
        fullname: Joi.string().min(3).max(30),
        phone: Joi.string().pattern(/^\+998(9[0123456789]|3[3]|7[1]|8[8])[0-9]{7}$/),
        course_id: Joi.number().integer().positive()
    }).min(1),

    courseSchema: Joi.object({
        name: Joi.string().min(3).max(30).required(),
        description: Joi.string().max(500).allow("", null),
        level: Joi.string().valid("beginner", "elementary", "intermediate", "advance").required(),
        price: Joi.string().pattern(/^\d+(\.\d{1,2})?$/).required(),
        category_id: Joi.number().integer().positive().required(),
        teacher_id: Joi.number().integer().required()

    }),

    courseUpdateSchema: Joi.object({
        name: Joi.string().min(3).max(100),
        description: Joi.string().max(500).allow("", null),
        level: Joi.string().valid("beginner", "elementary", "intermediate", "advance"),
        price: Joi.string().pattern(/^\d+(\.\d{1,2})?$/),
        category_id: Joi.number().integer().positive()
    }),

    lessonSchema: Joi.object({
        name: Joi.string().trim().min(2).max(255).required(),
        description: Joi.string().max(1000).allow("", null),
        section_id: Joi.number().integer().positive().required()
    }),

    lessonUpdateSchema: Joi.object({
        name: Joi.string().trim().min(2).max(255),
        description: Joi.string().max(1000).allow("", null)
    }),

    materialSchema: Joi.object({
        lesson_id: Joi.number().integer().positive().required(),
        description: Joi.string().trim().min(2).max(1000).required()
    }),

    materialUpdateSchema: Joi.object({
        description: Joi.string().trim().min(2).max(1000),
        remove_file_ids: Joi.string().pattern(/^\d+(,\d+)*$/)
    }),

    paymentSchema: Joi.object({
        student_id: Joi.number().integer().positive().required(),
        course_id: Joi.number().integer().positive().required(),
        amount: Joi.number().positive().max(9999999999),
        type: Joi.string().valid("cash", "payme", "card").required(),
        status: Joi.string().valid("paid", "pending", "cancelled").required()
    }),

    taskSchema: Joi.object({
        lesson_id: Joi.number().integer().positive().required(),
        description: Joi.string().trim().min(2).max(1000).required()
    }),

    taskUpdateSchema: Joi.object({
        description: Joi.string().trim().min(2).max(1000)
    }),

    examSchema: Joi.object({
        lesson_id: Joi.number().integer().positive().required(),
        question: Joi.string().trim().min(2).max(1000).required(),
        option_a: Joi.string().trim().min(1).max(500).required(),
        option_b: Joi.string().trim().min(1).max(500).required(),
        option_c: Joi.string().trim().min(1).max(500).required(),
        option_d: Joi.string().trim().min(1).max(500).required(),
        correct_answer: Joi.string().valid("A", "B", "C", "D").required()
    }),

    examUpdateSchema: Joi.object({
        question: Joi.string().trim().min(2).max(1000),
        option_a: Joi.string().trim().min(1).max(500),
        option_b: Joi.string().trim().min(1).max(500),
        option_c: Joi.string().trim().min(1).max(500),
        option_d: Joi.string().trim().min(1).max(500),
        correct_answer: Joi.string().valid("A", "B", "C", "D")
    }).min(1),

    
}