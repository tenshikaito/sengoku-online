export default class WebClient {

    public static baseUrl = "/";
    public static error: (resp: Response) => void;

    public static init(baseUrl: string, error: (resp: Response) => void) {

        this.baseUrl = baseUrl;
        this.error = error;
    }

    public static getPath(name: string) {

        return this.baseUrl + name;
    }

    public static async get<T>(url: string) {

        const response = await fetch(url);

        return this.process<T>(response);
    }

    public static async post<T>(url: string, body: BodyInit) {

        const response = await fetch(url, {
            method: "post",
            body: body
        });

        return this.process<T>(response);
    }

    private static async process<T>(response: Response) {

        if (response.ok) {
            const text = await response.text();
            return <T>JSON.parse(text);
        }
        else {
            this.error && this.error(response);
        }
    }
}