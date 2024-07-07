const responseCode = require("./responseCode");
const responseStatus = require("./responseStatus");

module.exports = {
  success: (data = {}) => ({
    statusCode: responseCode.success,
    body: {
      status: responseStatus.success,
      message: data.message || "Your request is successfully executed.",
      data: data.data && Object.keys(data.data).length ? data.data : null,
    },
  }),
};
