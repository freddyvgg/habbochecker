import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Localizer } from "../src/scripts/localization/Localizer";
import { HabboApi } from "../src/scripts/validator/api/HabboApi";
import { HabboChecker } from "../src/scripts/validator/HabboChecker";
import { Uniform } from "../src/scripts/validator/Unform";
jest.mock("../src/scripts/validator/Unform");
const MockUniform = jest.mocked(Uniform, true);

describe('Habbo Checker', () => {
    let ref: HabboChecker;
    
    beforeEach(() => {
        let uni = new Uniform([]);
        jest.spyOn(uni, "getErrors").mockImplementation(() => []);
        ref = new HabboChecker({
            missions: ["Right"],
            groupId: "001",
            uniforms: [uni]
        });
        Localizer.get = (key: string) => {
            return key;
        }
    });
    it('success', async () => {
        HabboApi.getUserByName = (name: string) => {
            return Promise.resolve({
                motto: "Right",
                uniqueId: "001",
                figureString: "ch-00-00"
            });
        }
        HabboApi.getProfile = (id: string) => {
            return Promise.resolve({
                groups: [{id: "001"}]
            });
        }
        let validation = await ref.check("test");
        expect(validation.errors).toHaveLength(0);
    });
    it('habbo not found', async () => {
        HabboApi.getUserByName = (name: string) => {
            throw new Error("Not found");
        }
        let validation = await ref.check("test");
        expect(validation.errors).toHaveLength(1);
        expect(validation.errors).toContain("ERR_HABBO_NOT_FOUND");
    });
    it('wrong motto', async () => {
        HabboApi.getUserByName = (name: string) => {
            return Promise.resolve({
                motto: "wrong",
                uniqueId: "001",
                figureString: "ch-00-00"
            });
        }
        HabboApi.getProfile = (id: string) => {
            return Promise.resolve({
                groups: [{id: "001"}]
            });
        }
        let validation = await ref.check("test");
        expect(validation.errors).toHaveLength(1);
        expect(validation.errors).toContain("ERR_HABBO_WRONG_MOTTO");
    });
    it('without public profile', async () => {
        HabboApi.getUserByName = (name: string) => {
            return Promise.resolve({
                motto: "Right",
                uniqueId: "001",
                figureString: "ch-00-00"
            });
        }
        HabboApi.getProfile = (id: string) => {
            throw new Error("not found");
        }
        let validation = await ref.check("test");
        expect(validation.errors).toHaveLength(1);
        expect(validation.errors).toContain("ERR_HABBO_PROFILE_NOT_PUBLIC");
    });
    it('wrong group', async () => {
        HabboApi.getUserByName = (name: string) => {
            return Promise.resolve({
                motto: "Right",
                uniqueId: "001",
                figureString: "ch-00-00"
            });
        }
        HabboApi.getProfile = (id: string) => {
            return Promise.resolve({
                groups: [{id: "002"}]
            });
        }
        let validation = await ref.check("test");
        expect(validation.errors).toHaveLength(1);
        expect(validation.errors).toContain("ERR_HABBO_GROUP_NOT_FOUND");
    });
    it('wrong uniform', async () => {
        let uni = new Uniform([]);
        jest.spyOn(uni, "getErrors").mockImplementation(() => ["ERROR_UNIFORM"]);
        ref = new HabboChecker({
            missions: ["Right"],
            groupId: "001",
            uniforms: [uni]
        });
        HabboApi.getUserByName = (name: string) => {
            return Promise.resolve({
                motto: "Right",
                uniqueId: "001",
                figureString: "ch-00-00"
            });
        }
        HabboApi.getProfile = (id: string) => {
            return Promise.resolve({
                groups: [{id: "001"}]
            });
        }
        
        let validation = await ref.check("test");
        expect(validation.errors).toHaveLength(1);
        expect(validation.errors).toContain("ERROR_UNIFORM");
    });
    it('wrong 2 uniform', async () => {
        let uni1 = new Uniform([]);
        jest.spyOn(uni1, "getErrors").mockImplementation(() => ["ERROR1_UNIFORM1"]);
        let uni2 = new Uniform([]);
        jest.spyOn(uni2, "getErrors").mockImplementation(() => ["ERROR1_UNIFORM2", "ERROR2_UNIFORM2"]);
        ref = new HabboChecker({
            missions: ["Right"],
            groupId: "001",
            uniforms: [uni1, uni2]
        });
        HabboApi.getUserByName = (name: string) => {
            return Promise.resolve({
                motto: "Right",
                uniqueId: "001",
                figureString: "ch-00-00"
            });
        }
        HabboApi.getProfile = (id: string) => {
            return Promise.resolve({
                groups: [{id: "001"}]
            });
        }
        let validation = await ref.check("test");
        expect(validation.errors).toHaveLength(1);
        expect(validation.errors).toContain("ERROR1_UNIFORM1");
    });
});