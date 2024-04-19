import HttpException from "./HttpException";

class RateLimitError extends HttpException {
    constructor(message: string) {
        super(429, message);
    }
}