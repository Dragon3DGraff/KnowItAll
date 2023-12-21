export class StorageHelper {
  constructor() {}

  public static save(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log("Не удалось записать в сторедж");
    }
  }

  public static get(key: string) {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.log("Не удалось распарсить из локалсторедж");
      }
    }
  }
}
