import HttpException from "./HttpException";

class NoUserFoundException extends HttpException {
    constructor(message: string) {
        super(404, message);
    }
}