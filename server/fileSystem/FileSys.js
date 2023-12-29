const { mkdir, writeFile, appendFile, readFile } = require("node:fs/promises");

class FileSys {
  static async createFolder(url) {
    try {
      await mkdir(url, { recursive: true });
    } catch (error) {
      console.log(`Не могу создать папку ${url}`);
    }
  }

  static async writeFile(fileUri, data) {
    try {
      await writeFile(fileUri, data);
    } catch (error) {
      console.info("Не могу сохранить файл", fileUri);
      return null;
    }
  }

  static async appendFile(fileUri, data) {
    try {
      await appendFile(fileUri, data);
    } catch (error) {
      console.info("Не могу добавить в файл", fileUri);
      return null;
    }
  }

  static async readFile(fileUri) {
    try {
      const readData = await fs.readFile(fileUri);
      const readStr = Buffer.from(readData).toString("utf8");
      return readStr;
    } catch (error) {
      return null;
    }
  }
}


module.exports =  FileSys;
