import { IRules } from "./IRules";
import { IValidationResult } from "./IValidationResult";
import { Cloth } from "./Cloth";
import { Uniform } from "./Unform";
import { Localizer } from "../localization/Localizer";
import { HabboApi } from "./api/HabboApi";
import { IUser } from "./api/IUser";

export class HabboChecker {
    private _rules: IRules;

    public constructor(rules: IRules) {
        this._rules = rules;
    }

    public async check(name: string): Promise<IValidationResult> {
        let user: IUser;
        try {
            user = await HabboApi.getUserByName(name);
        } catch (error) {
            return { errors: [Localizer.get("ERR_HABBO_NOT_FOUND")] };
        }

        let errors: string[] = [];
        if (!this.validateMission(user.motto)) {
            errors.push(Localizer.get("ERR_HABBO_WRONG_MOTTO"));
        }

        try {
            let profile = await HabboApi.getProfile(user.uniqueId);
            if (!this.validateGroup(profile.groups.map((group: { id: string; }) => group.id))) {
                errors.push(Localizer.get("ERR_HABBO_GROUP_NOT_FOUND"));
            }
        } catch (error) {
            errors.push(Localizer.get("ERR_HABBO_PROFILE_NOT_PUBLIC"));
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
            if (mission === item) return true;
        }
        return false;
    }
}