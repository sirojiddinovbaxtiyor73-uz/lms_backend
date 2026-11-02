export class conflictError extends Error{
    constructor(status,message){
        super()
        this.status = status
        this.message = message
        this.name="conflictError"
    }
}
export class NotFoundError extends Error{
    constructor(status,message){
        super()
        this.status = status
        this.message = message
        this.name="NotFoundError"

    }
}

export class ValidationError extends Error{
    constructor(status,message){
        super()
        this.status = status
        this.message = message
        this.name="ValidationError"

    }
}

export class ForbiddenError extends Error{
    constructor(status,message){
        super()
        this.status = status
        this.message = message
        this.name="ForbiddenError"

    }
}

export class InternalServerError extends Error{
    constructor(status,message){
        super()
        this.status = status
        this.message = message
        this.name="InternalServerError"

    }
}

export class UnauthorizedError extends Error{
    constructor(status,message){
        super()
        this.status = status
        this.message = message
        this.name="UnauthorizedError"

    }
}

