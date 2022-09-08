import { jest, test, expect } from '@jest/globals';
import { Localizer } from '../src/scripts/localization/Localizer';

/*jest.mock("jquery", () => {
    return {
        getJSON: jest.fn().mockImplementation(() => {
            console.log("moooked")
            return "a";
        })
    }
});*/

test('load success', async () => {
    await Localizer.load("lang");
});