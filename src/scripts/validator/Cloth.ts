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
                return "Ok";
            case 2:
                return "Modelo incorrecto.";
            case 4:
                return "Color incorrecto.";
            case 6:
                return "Modelo y color incorrecto.";
            default:
                return "Tipos no coinciden.";
        }
    }

    public static getTypeName(type: string) {
        switch (type) {
            case Cloth.SHIRT_TYPE:
                return "Camisa";
            case Cloth.PANTS_TYPE:
                return "Pantalones";
            case Cloth.SHOES_TYPE:
                return "Zapatos";
            case Cloth.BELT_TYPE:
                return "Correa";
            case Cloth.JACKET_TYPE:
                return "Chaqueta";
        }
    }
}