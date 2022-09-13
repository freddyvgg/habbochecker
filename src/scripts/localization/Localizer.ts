export class Localizer {
    private static _default: { [id: string]: string };
    private static _resource: { [id: string]: string};
    
    public static load(language: string = null) {
        Localizer._default = require ('../../../res/lang/lang.json');
        if (!language) {
            Localizer._resource = Localizer._default;
        } else {
            try {
                Localizer._resource = require('../../../res/lang/lang.' + language + '.json');
            } catch (e) {
                Localizer._resource = Localizer._default;
            }
        }
    }

    public static get(key: string): string {
        if (Localizer._resource && Localizer._resource.hasOwnProperty(key)) {
            return Localizer._resource[key];
        } else if (Localizer._default && Localizer._default.hasOwnProperty(key)){
            return Localizer._default[key];
        } else {
            return key;
        }
    }

    public static format(str: string, param: string[]): string {
        if (param) {
            param.forEach((value, index) => {
                str = str.replace("{" + index + "}", value);
            });
        }
        return str;
    }
}