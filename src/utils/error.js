export class conflictError extends Error{
    constructor(status,message){
        super()
        this.status = status
        this.message = message
    }
}
export class NotFoundError extends Error{
    constructor(status,message){
        super()
        this.status = status
        this.message = message
    }
}

export class ValidationError extends Error{
    constructor(status,message){
        super()
        this.status = status
        this.message = message
    }
}

export class InternalServerError extends Error{
    constructor(status,message){
        super()
        this.status = status
        this.message = message
    }
}

