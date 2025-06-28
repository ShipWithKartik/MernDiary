export const errorHandler = (statusCode,message)=>{

    const error = new Error()
    error.statusCode = statusCode;
    error.message = message;

    return error;
}

// Creates a new Error object , adds custom properties (statusCode and message) and returns the enhanced error object