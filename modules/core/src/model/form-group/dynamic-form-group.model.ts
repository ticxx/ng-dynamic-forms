import {
    DynamicFormControlModel,
    DynamicFormControlModelConfig,
    DynamicValidatorsConfig,
    ClsConfig
} from "../dynamic-form-control.model";
import {serializable} from "../../decorator/serializable.decorator";
import {getValue} from "../../utils";

export interface DynamicFieldSet {

    legend: string | null;
}

export const DYNAMIC_FORM_CONTROL_TYPE_GROUP = "GROUP";

export interface DynamicFormGroupModelConfig extends DynamicFormControlModelConfig {

    asyncValidator?: DynamicValidatorsConfig;
    group?: Array<DynamicFormControlModel>;
    legend?: string;
    validator?: DynamicValidatorsConfig;
}

export class DynamicFormGroupModel extends DynamicFormControlModel implements DynamicFieldSet {

    @serializable() asyncValidator: DynamicValidatorsConfig | null;
    @serializable() group: Array<DynamicFormControlModel> = [];
    @serializable() legend: string | null;
    @serializable() validator: DynamicValidatorsConfig | null;

    @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_GROUP;

    constructor(config: DynamicFormGroupModelConfig, cls?: ClsConfig) {

        super(config, cls);

        if (!Array.isArray(config["group"])) {
            throw new Error("group array must be specified for DynamicFormGroupModel");
        }

        this.asyncValidator = getValue(config, "asyncValidator", null);
        this.group = getValue(config, "group", []);
        this.legend = getValue(config, "legend", null);
        this.validator = getValue(config, "validator", null);
    }

    get(index: number): DynamicFormControlModel {
        return this.group[index];
    }
}