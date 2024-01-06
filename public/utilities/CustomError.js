class CustomError extends Error{
    constructor(statusCode, message){
        super(); // Error class constructor
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = CustomError;