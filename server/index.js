process.env["NODE_CONFIG_DIR"] = "../config";
const express = require("express");
const config = require("config");
cookieParser = require("cookie-parser");
const path = require("path");
var bodyParser = require("body-parser");

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
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/data", require("./routes/results.routes"));

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
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  try {
    app.listen(PORT, () => console.log(`Server has been started at ${PORT}`));
  } catch (error) {
    console.log("Server error", error.message);
    process.exit(1);
  }
}

start();
