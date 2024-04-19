import HttpException from "./HttpException";

class RateLimitException extends HttpException {
    constructor(message: string) {
        super(429, message);
    }
}

export default RateLimitException;