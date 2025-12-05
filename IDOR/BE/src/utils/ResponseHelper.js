class ResponseHelper {
  static success(data, message = 'Success') {
    return {
      success: true,
      message,
      data
    };
  }

  static error(message = 'Error', statusCode = 500) {
    return {
      statusCode,
      success: false,
      message
    };
  }
}

module.exports = ResponseHelper;
