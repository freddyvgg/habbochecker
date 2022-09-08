import { jest, describe, it, beforeAll, expect } from '@jest/globals';
import { Localizer } from '../src/scripts/localization/Localizer';

describe('Localizer', () => {
    beforeAll(() => {
        jest.mock('../res/lang/lang.json', () => {
            return {
                first: "first",
                secound: "secound"
            };
        });
    })
    it('load default', async () => {
        await Localizer.load();
        expect(Localizer.get("first")).toBe("first");
        expect(Localizer.get("NOT_FOUND")).toBe("NOT_FOUND");
    });
    it('load es', async () => {
        jest.mock('../res/lang/lang.es.json', () => {
            return {
                first: "primero"
            };
        });
        await Localizer.load('es');
        expect(Localizer.get("first")).toBe("primero");
        expect(Localizer.get("secound")).toBe("secound");
    });
    it('load not found', async () => {
        await Localizer.load('bad');
        expect(Localizer.get("first")).toBe("first");
        expect(Localizer.get("secound")).toBe("secound");
    });
});