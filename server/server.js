require("dotenv/config");
const app = require("./app");

// CONNECT TO DATABASE
require("./config/database");

// START SERVER
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, function () {
  console.log(`[SERVER] listening on port: ${PORT}`);
});

// HANDLE UNCAUGHT EXEPTION
process.on("uncaughtException", function (err, origin) {
  console.error(`[ERROR] error: ${err}`, origin);
  server.close(() => {
    console.log(`[SERVER] closing server`);
    process.exit(1);
  });
});

// HANDLE UNHANDLED REJECTIONS
process.on("unhandledRejection", function (reason, promise) {
  console.error(`[ERROR] reason: `, reason, " at promise: ", promise);
  server.close(() => {
    console.log(`[SERVER] closing server`);
    process.exit(1);
  });
});
