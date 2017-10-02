import {
    DynamicFormControlModel,
    DynamicFormControlModelConfig,
    DynamicValidatorsMap,
    ClsConfig
} from "../dynamic-form-control.model";
import { serializable } from "../../decorator/serializable.decorator";
import { DynamicFormGroupModel } from "../form-group/dynamic-form-group.model";
import { FormGroup } from "@angular/forms";

export const enum LayoutGroupLayoutType {
    tabset = "tabset",
    tab = "tab",
    card = "card",
    card_with_header = "card_with_header",
    card_with_title = "card_with_title",
}

export const DYNAMIC_FORM_CONTROL_TYPE_LAYOUT_GROUP = "LAYOUT_GROUP";

export interface DynamicFormLayoutGroupModelConfig extends DynamicFormControlModelConfig {

    // asyncValidator?: DynamicValidatorsMap;

    caption?: string;
    layoutGroup?: DynamicFormControlModel[];
    layoutType?: LayoutGroupLayoutType;
    layoutProperties?: any;
    //formGroup: DynamicFormGroupModel;
    angularFormGroup?: FormGroup;

    // validator?: DynamicValidatorsMap;
}

export class DynamicFormLayoutGroupModel extends DynamicFormControlModel {

    // @serializable() asyncValidator: DynamicValidatorsMap | null;
    @serializable() layoutGroup: DynamicFormControlModel[] = [];
    @serializable() caption: string | null;
    @serializable() layoutType: LayoutGroupLayoutType | null;
    @serializable() layoutProperties: any;
   // @serializable() formGroup: DynamicFormGroupModel;
    @serializable() angularFormGroup: FormGroup | null;
    // @serializable() validator: DynamicValidatorsMap | null;

    @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_LAYOUT_GROUP;

    constructor(config: DynamicFormLayoutGroupModelConfig, cls?: ClsConfig) {

        super(config, cls);

        // this.asyncValidator = config.asyncValidator || null;
        this.layoutGroup = Array.isArray(config.layoutGroup) ? config.layoutGroup : [];
        this.caption = config.caption || null;
        this.layoutType = config.layoutType || null;
        this.layoutProperties = config.layoutProperties || null;
        //this.formGroup = config.formGroup;
        this.angularFormGroup=config.angularFormGroup;
        // this.validator = config.validator || null;
    }
    //
    // get(index: number): DynamicFormControlModel {
    //     return this.formGroup[index];
    // }
    //
    // set(index: number, controlModel: DynamicFormControlModel,): void {
    //     this.formGroup[index] = controlModel;
    // }
    //
    // add(controlModel: DynamicFormControlModel): void {
    //     this.group.push(controlModel);
    // }
    //
    // insert(index: number, controlModel: DynamicFormControlModel): void {
    //     this.group.splice(index, 0, controlModel);
    // }
    //
    // move(index: number, step: number): void {
    //     this.group.splice(index + step, 0, ...this.group.splice(index, 1));
    // }
    //
    // remove(index: number) {
    //     this.group.splice(index, 1);
    // }

    size(): number {
        return this.layoutGroup.length;
    }
}
