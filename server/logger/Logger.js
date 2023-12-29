const FileSys = require("../fileSystem/FileSys");
const { format } = require("date-fns");
const { ru } = require("date-fns/locale");
class Logger {
  logs = [];
  filePath;
  isSaving = false;

  constructor() {
    this.filePath = "log.txt";
  }
  info(data) {
    this.addLog(data, "INFO");
  }
  error(data) {
    if (typeof data !== "string") {
      console.error(data);
    }
    this.addLog(data, "ERROR");
  }

  addLog(data, type) {
    let value = data;
    if (typeof value !== "string") {
      try {
        value = JSON.stringify(value, undefined, " ");
      } catch (error) {
        value = `LOGGER ERROR: Было невозможно перевести данные в строку ${error.message}`;
      }
    }
    const date = new Date();

    const text = `${type}: ${format(date, "P O pp", {
      locale: ru,
    })}.${date.getMilliseconds()}: ${value}`;
    console.info(text);

    this.logs.push(text + "\n");
    !this.isSaving && this.log();
  }

  async log() {
    this.isSaving = true;
    const logData = this.logs.shift();

    if (this.filePath && logData) {
      await FileSys.appendFile(this.filePath, logData);
    }

    if (this.logs.length && this.filePath) {
      setTimeout(async () => {
        await this.log();
      }, 0);
    }
    if (this.logs.length === 0) {
      this.isSaving = false;
    }
  }
}
module.exports = new Logger();
