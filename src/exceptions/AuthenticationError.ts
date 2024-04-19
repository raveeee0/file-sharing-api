import HttpException from "./HttpException";

class AuthenticationError extends HttpException {
    constructor(message: string) {
        super(401, message);
    }
}