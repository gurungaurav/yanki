// errors/CustomError.ts
class CustomError extends Error {
  status;

  constructor(message, status) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export default CustomError;
