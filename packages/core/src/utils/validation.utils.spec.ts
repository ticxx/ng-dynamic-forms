import { ValidationUtils } from "./validation.utils";

describe("Validation Utils test suite", () => {

    it("should detect a validator configuration correctly", () => {

        let testConfig1: any = {name: "test"},
            testConfig2: any = {args: null},
            testConfig3: any = {name: "test", args: null},
            testConfig4 = null;

        expect(ValidationUtils.isExpandedValidatorConfig(testConfig1)).toBe(false);
        expect(ValidationUtils.isExpandedValidatorConfig(testConfig2)).toBe(false);
        expect(ValidationUtils.isExpandedValidatorConfig(testConfig3)).toBe(true);
        expect(ValidationUtils.isExpandedValidatorConfig(testConfig4)).toBe(false);
    });
});