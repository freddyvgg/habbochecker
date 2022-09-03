import * as $ from "jquery";
import { IRules } from "./IRules";
import { IValidationResult } from "./IValidationResult";
import { Cloth } from "./Cloth";
import { Uniform } from "./Unform";

export class HabboChecker {
    private _rules: IRules;

    public constructor(rules: IRules) {
        this._rules = rules;
    }

    public async check(name: string): Promise<IValidationResult> {
        let user;
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
            if (!this.validateGroup(profile.groups.map((group: { id: string; }) => group.id))) {
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

    private validateGroup(groupIds: string[]): boolean {
        let validGroupId = this._rules.groupId;
        return groupIds.some(id => id === validGroupId);
    }

    private validateMission(mission: string): boolean {
        for (let item of this._rules.missions) {
            if (mission.startsWith(item)) return true; //TODO: improve with RGEX
        }
        return false;
    }
}