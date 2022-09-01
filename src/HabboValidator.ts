import * as $ from "jquery";

export class Uniform {
    private _cloths: { [type: string]: Cloth; } = {}
    private _forhiddenTypes: string[];

    public constructor(cloths: Cloth[], forhiddenTypes: string[] = []) {
        this._forhiddenTypes = forhiddenTypes;
        for (let cloth of cloths) {
            this._cloths[cloth.Type] = cloth;
        }
    }

    public getErrors(other: Uniform) {
        let errors = [];
        for (let key of Object.keys(this._cloths)) {
            let otherCloth = other._cloths[key]
            if (otherCloth) {
                let error = this._cloths[key].compareCloth(otherCloth);
                if (error!=0) {
                    errors.push(Cloth.getTypeName(key) + ": " + Cloth.getErrorMessage(error));
                }
            } else {
                errors.push("Sin " + Cloth.getTypeName(key));
            }
        }

        this._forhiddenTypes.filter(type => other._cloths.hasOwnProperty(type)).forEach(type=> errors.push(Cloth.getTypeName(type) + " Prohibida."))
        if (other._cloths[Cloth.JACKET_TYPE]) errors.push("Chaqueta Prohibida.");
        return errors;
    }
}

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
                return "Modelo y color incorrecto";
            default:
                return "Tipos no coinciden";
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

interface IRules {
    missions: string[];
    uniforms: Uniform[];
    groupId: string;
}

interface IValidationResult {
    user?: any;
    errors: string[]
}


export class HabboChecker {
    private _rules: IRules;

    public constructor(rules: IRules) {
        this._rules = rules;
    }

    public async check(name: string): Promise<IValidationResult> {
        let user: any; //TODO Create interfaces for habbo API
        try {
            user = await $.ajax({
                url: "https://www.habbo.es/api/public/users?name="+name, 
                type: "GET"
            });
        } catch (error) {
            return { errors: ["Habbo no encontrado"] };
        }

        let errors: string[] = [];
        if (!this.validateMission(user.motto)) {
            errors.push("Mision incorrecta.");
        }

        try {
            let profile = await $.ajax({
                url: "https://www.habbo.es/api/public/users/"+user.uniqueId+"/profile", 
                type: "GET"
            });
            if (!this.validateGroup(profile.groups)) {
                errors.push("No es miembro del grupo.");
            }
        } catch (error) {
            errors.push("El perfil no es publico. No se puede verificar el grupo.");
        }

        errors.push(...this.getUniformErrors(user.figureString));

        return {user, errors}
    }

    private getUniformErrors(figure: string): string[] {
        let cloths = figure.split(".").map((code: string)=>new Cloth(code));
        let currentUniform = new Uniform(cloths);
    
        let wrongMessages;
        let minErrors = 100;
        for (let uniform of this._rules.uniforms) {
            let errors = uniform.getErrors(currentUniform);
            let errorsCount = errors.length;
            if (errorsCount == 0) {
                return errors;
            }
            else if (errorsCount < minErrors) {
                minErrors = errorsCount;
                wrongMessages = errors;
            }
        }
        return wrongMessages;
    }

    private validateGroup(groups: any[]): boolean {
        let validGroupId = this._rules.groupId;
        for (let group of groups) {
            if (group.id === validGroupId) return true;
        }
        return false;
    }

    private validateMission(mission: string): boolean {
        for (let item of this._rules.missions) {
            if (mission.startsWith(item)) return true; //TODO: improve with RGEX
        }
        return false;
    }
}