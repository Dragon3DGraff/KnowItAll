export class StorageHelper {
  constructor() {}

  public static save(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(`Не удалось записать ${key} в сторедж`);
    }
  }

  public static delete(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.log(`Не удалось удалить ${key}`);
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
    return null
  }
}
