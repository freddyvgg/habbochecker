import { jest, describe, it, beforeAll, expect } from '@jest/globals';
import { Localizer } from '../src/scripts/localization/Localizer';

describe('Localizer', () => {
    beforeAll(() => {
        jest.mock('../res/lang/lang.json', () => {
            return {
                first: "first",
                second: "second"
            };
        });
    })
    it('load default', () => {
        Localizer.load();
        expect(Localizer.get("first")).toBe("first");
        expect(Localizer.get("NOT_FOUND")).toBe("NOT_FOUND");
    });
    it('load es', () => {
        jest.mock('../res/lang/lang.es.json', () => {
            return {
                first: "primero"
            };
        });
        Localizer.load('es');
        expect(Localizer.get("first")).toBe("primero");
        expect(Localizer.get("second")).toBe("second");
    });
    it('load not found', () => {
        Localizer.load('bad');
        expect(Localizer.get("first")).toBe("first");
        expect(Localizer.get("second")).toBe("second");
    });
    it('format', () => {
        let result = Localizer.format("{0} - {1}", ["first", "second"]);
        expect(result).toBe("first - second");
        result = Localizer.format("{1} - {0}", ["first", "second"]);
        expect(result).toBe("second - first");
    });
});