import HttpException from "./HttpException";

class NoCommentFoundException extends HttpException {
    constructor(message: string) {
        super(404, message);
    }
}