import * as $ from "jquery";
import { HabboChecker, Uniform, Cloth } from "./HabboValidator";

let habboChecker = new HabboChecker({
    groupId: "g-hhes-956c81f7687a427308fe259fa1e7b067",
    missions: ['CRW- Aspirante', 'CRW- Empleado C', 'CRW- Empleado B', 'CRW- Empleado A', 'CRW- Empleado Jefe'],
    uniforms: [new Uniform([new Cloth('ch-3109-1408-1408'), new Cloth('lg-3023-1408'), new Cloth('sh-290-1408'), new Cloth('wa-3074-1408-1408')], [Cloth.JACKET_TYPE]),
    new Uniform([new Cloth('ch-3030-92'), new Cloth('lg-3023-110'), new Cloth('sh-290-92'), new Cloth('wa-3264-92-92')], [Cloth.JACKET_TYPE]),
    new Uniform([new Cloth('ch-665-1408'), new Cloth('lg-3216-1408'), new Cloth('sh-725-1408'), new Cloth('wa-3074-1408-1408')], [Cloth.JACKET_TYPE]),
    new Uniform([new Cloth('ch-3013-92'), new Cloth('lg-3006-110-92'), new Cloth('sh-725-92'), new Cloth('wa-3073-110')], [Cloth.JACKET_TYPE])]
});

$(function() {
    $("#submit").on('click', async function() {
        let name = String($("#name").val());
        let validationResult = await habboChecker.check(name);
        if (validationResult.user) {
            $("#habboPicture").attr('src','https://www.habbo.es/habbo-imaging/avatarimage?direction=2&&head_direction=2&&figure='+ validationResult.user.figureString);
            $("#habboName>span").text(validationResult.user.name);
            $("#habboMission>span").text(validationResult.user.motto);
            $("#habboPicture").show();
            $("#habboName").show();
            $("#habboMission").show();
        } else {
            $("#habboPicture").hide();
            $("#habboName").hide();
            $("#habboMission").hide();
        }

        if (validationResult.errors.length !== 0) {
            let errorHtml = "<ul>" + validationResult.errors.map(err => "<li>" + err + "</li>").join("") + "</ul>" ;
            $("#habboErrors").html(errorHtml);
        } else {
            $("#habboErrors").text("Permitido!!");
        }
    });
});