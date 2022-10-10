import { beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Localizer } from '../src/scripts/localization/Localizer';
import { HabboChecker } from '../src/scripts/validator/HabboChecker';

//jest.mock("../src/scripts/validator/HabboChecker");

require('../src/scripts/pages/app');

describe("App - habbo", ()=> {
    beforeAll(()=>{
        document.body.innerHTML = `
        <div>
            <label for="name">Nombre:</label>
            <input type="text" id="name" name="name" />
            <button type="button" id="submit">Buscar</button>
        </div>
        <div id="result">
            <img id="habboPicture" alt="Foto de perfil" />
            <div id="habboName"><label>Nombre:</label><span></span></div>
            <div id="habboMission"><label>Mision:</label><span></span></div>
            <div id="habboErrors"></div>
        </div>
        `;
        Localizer.load = (lang) => {};
        window.dispatchEvent(new Event('load'));
    });
    it('not found', () => {
        let result = {
            errors:["NOT_FOUND"]
        };
        HabboChecker.prototype.check = (name: string)=>{
            return Promise.resolve(result);
        };

        let btn = document.getElementById("submit");
        btn.click();
        Promise.resolve()
        .then(()=>{
            expect(document.getElementById('habboPicture').hidden).toBe(true);
            expect(document.getElementById('habboName').hidden).toBe(true);
            expect(document.getElementById('habboMission').hidden).toBe(true);
            expect(document.getElementById('habboErrors').innerHTML).toContain("NOT_FOUND");
        });
    });
    it('allowed', () => {
        let result = {
            user: {
                name: "name",
                motto: "motto",
                figureString: "figureString"
            },
            errors: <string[]>[]
        };
        HabboChecker.prototype.check = (name: string)=>{
            return Promise.resolve(result);
        };
        let btn = document.getElementById("submit");
        btn.click();
        Promise.resolve()
        .then(()=>{
            let habboPicture = document.getElementById('habboPicture') as HTMLImageElement;
            var habboName = document.getElementById("habboName");
            var textName = habboName.getElementsByTagName("span")[0];
            var habboMission = document.getElementById("habboMission");
            var textMission = habboMission.getElementsByTagName("span")[0];
            var habboErrors = document.getElementById("habboErrors");
            expect(habboPicture.src).toBe("https://www.habbo.es/habbo-imaging/avatarimage?direction=2&&head_direction=2&&figure=figureString");
            expect(textName.innerText).toBe("name");
            expect(textMission.innerText).toBe("motto");
            expect(habboErrors.innerHTML).toContain("MSG_HABBO_OK");
        });
    });
});