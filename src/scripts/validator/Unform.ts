import { Localizer } from "../localization/Localizer";
import { Cloth } from "./Cloth";

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
                    errors.push(Localizer.format(Cloth.getErrorMessage(error), [Cloth.getTypeName(key)]));
                }
            } else {
                errors.push(Localizer.format(Localizer.get("ERR_HABBO_NO_CLOTH"),[Cloth.getTypeName(key)]));
            }
        }

        this._forhiddenTypes.filter(type => other._cloths.hasOwnProperty(type)).forEach(type=> errors.push(
            Localizer.format(Localizer.get("ERR_HABBO_FORBHIDDEN"), [Cloth.getTypeName(type)])));
        return errors;
    }
}