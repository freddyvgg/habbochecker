import { describe, it, expect, beforeAll, jest } from '@jest/globals'
import { Localizer } from '../src/scripts/localization/Localizer';
import { Cloth } from '../src/scripts/validator/Cloth'

let ref: Cloth;
describe('Cloth', () => {
    beforeAll(() => {
        ref = new Cloth("ch-01-01");
        Localizer.get = (key: string) => {
            return key;
        }
    });
    it("success", () => {
        let error = ref.compareCloth(new Cloth('ch-01-01'))
        expect(error).toBe(0);
        expect(Cloth.getErrorMessage(error)).toBe("MSG_HABBO_OK");
    });
    it("with wrong type", () => {
        let error = ref.compareCloth(new Cloth('xx-01-01'))
        expect(error).toBe(1);
        expect(Cloth.getErrorMessage(error)).toBe("ERR_HABBO_TYPE");
    });
    it("with wrong type", () => {
        let error = ref.compareCloth(new Cloth('ch-00-01'))
        expect(error).toBe(2);
        expect(Cloth.getErrorMessage(error)).toBe("ERR_HABBO_MODEL");
    });
    it("with wrong type and model", () => {
        let error = ref.compareCloth(new Cloth('xx-00-01'))
        expect(error).toBe(3);
        expect(Cloth.getErrorMessage(error)).toBe("ERR_HABBO_TYPE");
    });
    it("with wrong color", () => {
        let error = ref.compareCloth(new Cloth('ch-01-00'))
        expect(error).toBe(4);
        expect(Cloth.getErrorMessage(error)).toBe("ERR_HABBO_COLOR");
    });
    it("with wrong type and color", () => {
        let error = ref.compareCloth(new Cloth('xx-01-00'))
        expect(error).toBe(5);
        expect(Cloth.getErrorMessage(error)).toBe("ERR_HABBO_TYPE");
    });
    it("with wrong model and color", () => {
        let error = ref.compareCloth(new Cloth('ch-00-00'))
        expect(error).toBe(6);
        expect(Cloth.getErrorMessage(error)).toBe("ERR_HABBO_MODEL_COLOR");
    });
    it("with wrong type, model and color", () => {
        let error = ref.compareCloth(new Cloth('xx-00-00'))
        expect(error).toBe(7);
        expect(Cloth.getErrorMessage(error)).toBe("ERR_HABBO_TYPE");
    });
    it("types", () => {
        expect(ref.Type).toBe(Cloth.SHIRT_TYPE);
        expect(Cloth.getTypeName(Cloth.SHIRT_TYPE)).toBe("LBL_CLOTH_SHIRT");
        expect(Cloth.getTypeName(Cloth.PANTS_TYPE)).toBe("LBL_CLOTH_PANTS");
        expect(Cloth.getTypeName(Cloth.SHOES_TYPE)).toBe("LBL_CLOTH_SHOES");
        expect(Cloth.getTypeName(Cloth.BELT_TYPE)).toBe("LBL_CLOTH_BELT");
        expect(Cloth.getTypeName(Cloth.JACKET_TYPE)).toBe("LBL_CLOTH_JACKET");
    });
});