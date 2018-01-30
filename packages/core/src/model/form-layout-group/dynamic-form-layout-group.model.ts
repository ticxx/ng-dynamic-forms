import {
    DynamicFormControlModel,
    DynamicFormControlModelConfig
} from "../dynamic-form-control.model";
import { serializable } from "../../decorator/serializable.decorator";
import { DynamicFormGroupModel } from "../form-group/dynamic-form-group.model";
import { FormGroup } from "@angular/forms";
import { DynamicFormControlLayout } from "../misc/dynamic-form-control-layout.model";

export const enum LayoutGroupLayoutType {
    tab = "tab",
    card = "card",
    card_with_header = "card_with_header",
    card_with_title = "card_with_title",
}

export const DYNAMIC_FORM_CONTROL_TYPE_LAYOUT_GROUP = "LAYOUT_GROUP";

export interface DynamicFormLayoutGroupModelConfig extends DynamicFormControlModelConfig {

    caption?: string;
    group?: DynamicFormControlModel[];
    layoutGroup?: DynamicFormControlModel[];
    layoutType?: LayoutGroupLayoutType;
    layoutProperties?: any;
    angularFormGroup?: FormGroup;
}

export class DynamicFormLayoutGroupModel extends DynamicFormControlModel {
    @serializable() group: DynamicFormControlModel[] = [];
    @serializable() layoutGroup: DynamicFormControlModel[] = [];
    @serializable() caption: string | null;
    @serializable() layoutType: LayoutGroupLayoutType | null;
    @serializable() layoutProperties: any;
    @serializable() angularFormGroup: FormGroup | undefined;

    @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_LAYOUT_GROUP;

    constructor(config: DynamicFormLayoutGroupModelConfig, layout?: DynamicFormControlLayout) {

        super(config, layout);
        this.group = Array.isArray(config.group) ? config.group : [];
        this.layoutGroup = Array.isArray(config.layoutGroup) ? config.layoutGroup : [];
        this.caption = config.caption || null;
        this.layoutType = config.layoutType || null;
        this.layoutProperties = config.layoutProperties || null;
        this.angularFormGroup=config.angularFormGroup;
    }

    size(): number {
        return this.layoutGroup.length;
    }
}
