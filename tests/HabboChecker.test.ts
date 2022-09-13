import { beforeAll, describe, expect, it, jest } from "@jest/globals";
import { Localizer } from "../src/scripts/localization/Localizer";
import { Cloth } from "../src/scripts/validator/Cloth";
import { HabboChecker } from "../src/scripts/validator/HabboChecker";
import { Uniform } from "../src/scripts/validator/Unform";


jest.mock('jquery', ()=> {
    ajax: jest.fn()
    .mockImplementation(() => {
        return Promise.resolve({
            uniqueId: "00",
            motto: "Right",
            figureString: "ch-01-00"
        });
    });
});
describe('Habbo Checker', () => {
    let ref: HabboChecker;
    
    beforeAll(() => {
        ref = new HabboChecker({
            missions: ["Right"],
            groupId: "00",
            uniforms: [new Uniform([new Cloth("ch-00-00")], [Cloth.JACKET_TYPE]), 
            new Uniform([new Cloth("ch-01-00")], [Cloth.JACKET_TYPE])]
        });
        Localizer.get = (key: string) => {
            return key;
        }
    });
    it('wrong motto', async () => {
        let validation = await ref.check("MrFred");
        validation.errors.forEach(error => console.log("Errors: " + error));
        expect(validation.errors).toContain("ERR_HABBO_WRONG_MOTTO");
    });
});