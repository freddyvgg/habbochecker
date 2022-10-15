import { HabboChecker } from "../validator/HabboChecker";
import { Cloth } from "../validator/Cloth";
import { Uniform } from "../validator/Unform";
import '../../styles/app.css';
import { Localizer } from "../localization/Localizer";

let habboChecker = new HabboChecker({
    groupId: "g-hhes-956c81f7687a427308fe259fa1e7b067",
    missions: ['Aspirante', "Empleado"],
    uniforms: [new Uniform([new Cloth('ch-3109-1408-1408'), new Cloth('lg-3023-1408'), new Cloth('sh-290-1408'), new Cloth('wa-3074-1408-1408')], [Cloth.JACKET_TYPE]),
    new Uniform([new Cloth('ch-3030-92'), new Cloth('lg-3023-110'), new Cloth('sh-290-92'), new Cloth('wa-3264-92-92')], [Cloth.JACKET_TYPE]),
    new Uniform([new Cloth('ch-665-1408'), new Cloth('lg-3216-1408'), new Cloth('sh-725-1408'), new Cloth('wa-3074-1408-1408')], [Cloth.JACKET_TYPE]),
    new Uniform([new Cloth('ch-3013-92'), new Cloth('lg-3006-110-92'), new Cloth('sh-725-92'), new Cloth('wa-3073-110')], [Cloth.JACKET_TYPE])]
});

window.onload = async function () {
    Localizer.load("es");
    let habboPicture = document.getElementById("habboPicture") as HTMLImageElement;
    let habboName = document.getElementById("habboName");
    let textName = habboName.getElementsByTagName("span")[0];
    let habboMission = document.getElementById("habboMission");
    let textMission = habboMission.getElementsByTagName("span")[0];
    let habboErrors = document.getElementById("habboErrors");
    let btnSubmit = document.getElementById("submit");
    let inputName = document.getElementById("name") as HTMLInputElement;

    habboPicture.hidden = true;
    habboName.hidden = true;
    habboMission.hidden = true;

    btnSubmit.onclick = async function() {
        let name = inputName.value;
        let validationResult = await habboChecker.check(name);
        if (validationResult.user) {
            habboPicture.src = 'https://www.habbo.es/habbo-imaging/avatarimage?direction=2&&head_direction=2&&figure='+ validationResult.user.figureString;
            textName.innerText = validationResult.user.name;
            textMission.innerText = validationResult.user.motto;
            habboPicture.hidden = false;
            habboName.hidden = false;
            habboMission.hidden = false;
        } else {
            habboPicture.hidden = true;
            habboName.hidden = true;
            habboMission.hidden = true;
        }

        if (validationResult.errors.length !== 0) {
            let errorHtml = "<ul>" + validationResult.errors.map(err => "<li>" + err + "</li>").join("") + "</ul>" ;
            habboErrors.innerHTML = errorHtml;
            habboErrors.className = "error";
        } else {
            habboErrors.innerHTML = Localizer.get("MSG_HABBO_OK");
            habboErrors.className = "success";
        }
    }
}