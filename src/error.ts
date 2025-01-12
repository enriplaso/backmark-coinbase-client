export class CoinbaseError extends Error {
    statusCode: number;
    response: Response;

    constructor(message: string, statusCode: number, response: Response) {
        super(message);
        this.name = 'CoinbaseError';
        this.statusCode = statusCode;
        this.response = response;
    }
}
