process.env["NODE_CONFIG_DIR"] = "../config";
const express = require("express");
const config = require("config");
cookieParser = require("cookie-parser");
const path = require("path");
var bodyParser = require("body-parser");
const logger = require("./logger/Logger");

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const db = require("./models");

app.use((req, res, next) => {
  // if (process.env.NODE_ENV !== "production") {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5173");

  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, credentials"
  );
  // }
  next();
});

app.use(cookieParser());
app.use(express.json({ extended: true }));

app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
  logger.info(
    `REQUEST: ${req.method} ${req.url} from ${ip} ${
      req.cookies.token ? "Авторизован" : "Не авторизован"
    }`
  );

  next();
});
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/data", require("./routes/results.routes"));
app.use("/api/stat", require("./routes/statistic.routes"));

const PORT = config.get("port");

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "client", "dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

async function start() {
  try {
    await db.sequelize.authenticate();
    logger.info("sequelize: успешно подключился к БД");
  } catch (error) {
    logger.error("sequelize: Не удалось подключиться к БД: ...");
    logger.error(error);
  }
  try {
    app.listen(PORT, () => {
      logger.info(`Server: запущен порт ${PORT}`);
    });
  } catch (error) {
    logger.error(`Server: error: ...`);
    logger.error(error.message);
    process.exit(1);
  }
}

start();
