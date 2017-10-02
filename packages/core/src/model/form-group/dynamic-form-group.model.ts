import {
    DynamicFormControlModel,
    DynamicFormControlModelConfig,
    DynamicValidatorsMap,
    ClsConfig
} from "../dynamic-form-control.model";
import { serializable } from "../../decorator/serializable.decorator";

export const enum GroupLayoutType {
    tabset = "tabset",
    card = "card",
    card_with_header = "card_with_header",
    card_with_title = "card_with_title",
}

export const DYNAMIC_FORM_CONTROL_TYPE_GROUP = "GROUP";

export interface DynamicFormGroupModelConfig extends DynamicFormControlModelConfig {

    asyncValidator?: DynamicValidatorsMap;
    group?: DynamicFormControlModel[];
    legend?: string;
    validator?: DynamicValidatorsMap;
    layoutType?: GroupLayoutType;
}

export class DynamicFormGroupModel extends DynamicFormControlModel {

    @serializable() asyncValidator: DynamicValidatorsMap | null;
    @serializable() group: DynamicFormControlModel[] = [];
    @serializable() legend: string | null;
    @serializable() validator: DynamicValidatorsMap | null;
    @serializable() layoutType: GroupLayoutType | null;

    @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_GROUP;

    constructor(config: DynamicFormGroupModelConfig, cls?: ClsConfig) {

        super(config, cls);

        this.asyncValidator = config.asyncValidator || null;
        this.group = Array.isArray(config.group) ? config.group : [];
        this.legend = config.legend || null;
        this.validator = config.validator || null;
        this.layoutType = config.layoutType || null;
    }

    get(index: number): DynamicFormControlModel {
        return this.group[index];
    }

    set(index: number, controlModel: DynamicFormControlModel,): void {
        this.group[index] = controlModel;
    }

    add(controlModel: DynamicFormControlModel): void {
        this.group.push(controlModel);
    }

    insert(index: number, controlModel: DynamicFormControlModel): void {
        this.group.splice(index, 0, controlModel);
    }

    move(index: number, step: number): void {
        this.group.splice(index + step, 0, ...this.group.splice(index, 1));
    }

    remove(index: number) {
        this.group.splice(index, 1);
    }

    size(): number {
        return this.group.length;
    }
}