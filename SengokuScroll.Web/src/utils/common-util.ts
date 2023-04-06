
import { ElMessage } from 'element-plus';

export default class CommonUtil {

    public static getTextStyle() {

        return <Phaser.Types.GameObjects.Text.TextStyle>{

            font: '16px MingLiU',
            fill: '#FFFFFF'
        };
    }

    public static getTextShadow() {

        return <Phaser.Types.GameObjects.Text.TextStyle>{

            shadow: {
                color: "#000000",
                fill: true,
                offsetX: 2,
                offsetY: 2
            }
        }
    }

    public static setValues(from: any, to: any, isInit = false) {

        if (isInit) {

            for (const o in Object.keys(to)) {

                delete to[o];
            }
        }

        for (const o in from) {
            
            to[o] = from[o];
        }
    }

    public static copy<T>(src: T) {

        return <T>JSON.parse(JSON.stringify(src));
    }

    public static download(dataUrl: string, filename: string) {

        const a = document.createElement("a");

        a.download = filename;
        a.href = dataUrl;
        a.style.display = "none";

        a.click();
        a.remove();
    }

    public static downloadJson(data: object, filename: string) {

        const blob = new Blob([JSON.stringify(data)]);

        const url = URL.createObjectURL(blob);

        this.download(url, filename);
    }

    public static format(text: string, ...params: any[]) {

        for (const i in params) {

            text = text.replace(`{${i}}`, params[i]);
        }

        return text;
    }

    public static success(msg: string) {

        ElMessage({
            message: msg,
            type: "success"
        });
    }

    public static changeListCount<T>(list: T[], length: number, addItem: (startIndex: number) => T) {

        if (list.length > length) {
            list.splice(length, list.length - length);
            return -1;
        } else if (list.length < length) {
            for (let i = 0, s = list.length, l = length - list.length; i < l; ++i) {
                list.push(addItem(s + i));
            }
            return 1;
        }

        return 0;
    }
}