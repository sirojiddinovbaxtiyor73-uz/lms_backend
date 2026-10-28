import Joi from "joi"

export default {
    staffSchema: Joi.object({
        fullname: Joi.string().min(3).max(30).required(),
        phone: Joi.string().pattern(/^\+998(9[0123456789]|3[3]|7[1]|8[8])[0-9]{7}$/).required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().required()
    })
}