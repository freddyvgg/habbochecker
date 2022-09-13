import { beforeAll, describe, expect, it } from "@jest/globals";
import { Localizer } from "../src/scripts/localization/Localizer";
import { Cloth } from "../src/scripts/validator/Cloth";
import { Uniform } from "../src/scripts/validator/Unform";

describe('Uniform', () => {
    let ref: Uniform;
    beforeAll(() => {
        ref = new Uniform([new Cloth("ch-00-00")], [Cloth.JACKET_TYPE]);
        Localizer.get = (key: string) => {
            return key;
        }
    });
    it('success', () => {
        let test = new Uniform([new Cloth("ch-00-00"), new Cloth("lg-00-00")]);
        let errors = ref.getErrors(test);
        expect(errors.length).toBe(0);
    });
    it('with wrong cloth', () => {
        let test = new Uniform([new Cloth("ch-01-00")]);
        let errors = ref.getErrors(test);
        expect(errors.length).toBeGreaterThan(0);
        
    });
    it('without required cloth', () => {
        let test = new Uniform([new Cloth("lg-00-00")]);
        let errors = ref.getErrors(test);
        expect(errors).toContain("ERR_HABBO_NO_CLOTH");
    });
    it('without non-allowed cloth', () => {
        let test = new Uniform([new Cloth("ch-01-00"), new Cloth("cc-00-00")]);
        let errors = ref.getErrors(test);
        expect(errors).toContain("ERR_HABBO_FORBHIDDEN");
    });
})