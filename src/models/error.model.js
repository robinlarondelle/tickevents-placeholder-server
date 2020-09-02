module.exports = class ErrorMessage {
    constructor(type, message, status) {
      this.type = type
      this.message = message
      this.status = status
    }
  }