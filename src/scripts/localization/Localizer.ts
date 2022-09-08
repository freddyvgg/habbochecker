import $ from 'jquery';


export class Localizer {
    private static _resource: { [id: string]: string};
    
    public static async load(language: string) { //TODO: Add parameter for language
        try {
            const lang = require ('../../../res/lang/'+ language + '.json');
            Localizer._resource = lang;
            console.log("Error Bien " + Localizer.get('MSG_HABBO_OK'));
        } catch (e) {
            console.log("Error " + e);
        }
    }

    public static get(key: string): string {
        return Localizer._resource[key];
    }
}