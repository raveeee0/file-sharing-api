import HttpException from "./HttpException";

class NoFileFoundException extends HttpException {
    constructor(message: string) {
        super(404, message);
    }
}