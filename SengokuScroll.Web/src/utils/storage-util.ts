export default class StorageUtil {

    public static getSessionValue<T>(key: string) {

        return this.getValue<T>(sessionStorage, key);
    }

    public static setSessionValue(key: string, value: object) {

        this.setValue(sessionStorage, key, value);
    }

    private static getValue<T>(storage: Storage, key: string) {

        const value = storage.getItem(key);

        return value !== null ? <T>JSON.parse(value) : null;
    }

    private static setValue(storage: Storage, key: string, value: object) {

        storage.setItem(key, JSON.stringify(value));
    }
}