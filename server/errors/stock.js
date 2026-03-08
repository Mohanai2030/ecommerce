export class NotEnoughStockError extends Error {
    constructor(message){
        super(message);
        this.name = "NotEnoughStockError"
    }
}