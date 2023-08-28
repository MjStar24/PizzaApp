class customErrorHandler extends Error{
    constructor(status,msg){
        super()
        this.status=status;
        this.message=msg;
    }

    static alreadyExist(message){
        return new customErrorHandler(409,message);
    }

    static wrongCredentials(message='Username or Password is wrong'){
        return new customErrorHandler(401,message)
    }

    static unAuthorized(message='unauthorized'){
        return new customErrorHandler(401,message);
    }

    static notFound(message='404 not found'){
        return new customErrorHandler(404,message);
    }

    static serverError(message='Internal server Error'){
        return new customErrorHandler(500,message);
    }
}

export default customErrorHandler;