import * as $ from "jquery";

$(function() {
    $("#submit").on('click', function() {
        let name = $("#name").val();
        $.ajax({
            url: "https://www.habbo.es/api/public/users?name="+name, 
            type: "GET"
        })
        .done(function (user) {
            $.ajax({
                url: "https://www.habbo.es/api/public/users/"+user.uniqueId+"/profile", 
                type: "GET"
            })
            .done(showUser);
        });
    });
});

function showUser(profile: any) {
    $("#habboPicture").attr('src','https://www.habbo.es/habbo-imaging/avatarimage?direction=2&&head_direction=2&&figure='+ profile.user.figureString);
    $("#habboName>span").text(profile.user.name);
    $("#habboMission>span").text(profile.user.motto);

    let errors = [];
    if (!validateMission(profile.user.motto)) {
        errors.push("Mision incorrecta.");
    }
    if (!validateGroup(profile.groups)) {
        errors.push("No tiene placa agente.");
    }
    errors.push(...getUniformErrors(profile.user.figureString));

    let errorHtml = "<ul>" + errors.map(err => "<li>" + err + "</li>").join("") + "</ul>" ;
    $("#habboErrors").html(errorHtml);
}

function validateMission(mission: string): boolean {
    let validMissions = [
        'CRW- Aspirante',
        'CRW- Empleado C',
        'CRW- Empleado B',
        'CRW- Empleado A',
        'CRW- Empleado Jefe'
    ];
    return validMissions.includes(mission);
}

function validateGroup(groups: any[]): boolean {
    let validGroupId = "g-hhes-956c81f7687a427308fe259fa1e7b067"
    for (let group of groups) {
        if (group.id === validGroupId) return true;
    }
    return false;
}

//M
//SIN HC - ch-3109-1408-1408.lg-3023-1408.sh-290-1408.wa-3074-1408-1408
//CON HC - ch-3030-92.lg-3023-110.sh-290-92.wa-3264-92-92
//F
//SIN HC - ch-665-1408.lg-3216-1408.sh-725-1408.wa-3074-1408-1408
//CON HC - ch-3013-92.lg-3006-110-92.sh-725-92.wa-3073-110
function getUniformErrors(figure: string) {
    let uniforms = [new Uniform([new Cloth('ch-3109-1408-1408'), new Cloth('lg-3023-1408'), new Cloth('sh-290-1408'), new Cloth('wa-3074-1408-1408')]),
                new Uniform([new Cloth('ch-3030-92'), new Cloth('lg-3023-110'), new Cloth('sh-290-92'), new Cloth('wa-3264-92-92')]),
                new Uniform([new Cloth('ch-665-1408'), new Cloth('lg-3216-1408'), new Cloth('sh-725-1408'), new Cloth('wa-3074-1408-1408')]),
                new Uniform([new Cloth('ch-3013-92'), new Cloth('lg-3006-110-92'), new Cloth('sh-725-92'), new Cloth('wa-3073-110')])];

    let cloths = figure.split(".").map((code: string)=>new Cloth(code));
    let currentUniform = new Uniform(cloths);

    let wrongMessages;
    let minErrors = 100;
    for (let uniform of uniforms) {
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

class Uniform {
    private _cloths: { [type: string]: Cloth; } = {}

    public constructor(cloths: Cloth[]) {
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

        if (other._cloths[Cloth.JACKET_TYPE]) errors.push("Chaqueta Prohibida.");
        return errors;
    }
}

class Cloth {
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