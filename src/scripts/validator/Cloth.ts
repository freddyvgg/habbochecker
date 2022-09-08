import { Localizer } from "../localization/Localizer";

export class Cloth {
    public static SHIRT_TYPE = "ch";
    public static PANTS_TYPE = "lg";
    public static SHOES_TYPE = "sh";
    public static BELT_TYPE = "wa";
    public static JACKET_TYPE = "cc";

    private _type: string;
    private _model: number;
    private _color: string

    public get Type() {
        return this._type;
    }

    public constructor(code: string) {
        let parts = code.split('-');
        this._type = parts.splice(0,1)[0];
        this._model = Number(parts.splice(0,1)[0]);
        this._color = parts.join("-");
    }

    public compareCloth(other: Cloth): number {
        // 0 - OK | 1 - WRONG
        //bit 0 = type
        //bit 1 = model
        //bit 2 = color
        let result = 0;
        if (this._type !== other._type) result += 1;
        if (this._model !== other._model) result += 2;
        if (this._color !== other._color) result += 4;
        return result;
    }

    public static getErrorMessage(error: number): string {
        switch (error) {
            case 0:
                return Localizer.get("MSG_HABBO_OK");
            case 2:
                return Localizer.get("ERR_HABBO_MODEL");
            case 4:
                return Localizer.get("ERR_HABBO_COLOR");
            case 6:
                return Localizer.get("ERR_HABBO_MODEL_COLOR");
            default:
                return Localizer.get("ERR_HABBO_TYPE");
        }
    }

    public static getTypeName(type: string) {
        switch (type) {
            case Cloth.SHIRT_TYPE:
                return Localizer.get("LBL_CLOTH_SHIRT");
            case Cloth.PANTS_TYPE:
                return Localizer.get("LBL_CLOTH_PANTS");
            case Cloth.SHOES_TYPE:
                return Localizer.get("LBL_CLOTH_SHOES");
            case Cloth.BELT_TYPE:
                return Localizer.get("LBL_CLOTH_BELT");
            case Cloth.JACKET_TYPE:
                return Localizer.get("LBL_CLOTH_JACKET");
        }
    }
}