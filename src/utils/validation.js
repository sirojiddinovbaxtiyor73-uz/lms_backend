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
        fullName: Joi.string().min(3).max(30).required(),
        phone: Joi.string().pattern(/^\+998(9[0123456789]|3[3]|7[1]|8[8])[0-9]{7}$/).required(),
        password: Joi.string().min(6).required()

    }),

    courseSchema: Joi.object({
        name: Joi.string().min(3).max(100).required(),
        description: Joi.string().max(500).allow("",null),
        level_id: Joi.number().positive().required(),
        price: Joi.string().pattern(/^\d+$/).required(),
        category_id: Joi.number().integer().positive().required(),

    })
}