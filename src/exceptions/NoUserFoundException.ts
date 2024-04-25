import HttpException from "./HttpException";

class NoUserFoundException extends HttpException {
    constructor(id: string) {
        super(404, "User with id " + id + " not found");
    }
}

export default NoUserFoundException;