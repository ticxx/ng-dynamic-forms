import {
    DynamicDateControlModel,
    DynamicDateControlModelConfig,
    DynamicDateControlValue
} from "../dynamic-date-control.model";
import { DynamicFormControlLayout } from "../misc/dynamic-form-control-layout.model";
import { serializable } from "../../decorator/serializable.decorator";

export const DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER = "DATEPICKER";

export interface DynamicDatePickerModelConfig extends DynamicDateControlModelConfig {

    focusedDate?: DynamicDateControlValue;
    inline?: boolean;
    toggleIcon?: string;
    toggleLabel?: string;
}

export class DynamicDatePickerModel extends DynamicDateControlModel {

    @serializable() focusedDate: DynamicDateControlValue | null;
    @serializable() inline: boolean;
    @serializable() toggleIcon: string | null;
    @serializable() toggleLabel: string | null;

    @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER;

    constructor(config: DynamicDatePickerModelConfig, layout?: DynamicFormControlLayout) {

        super(config, layout);

        this.focusedDate = config.focusedDate || null;
        this.inline = typeof config.inline === "boolean" ? config.inline : false;
        this.toggleIcon = typeof config.toggleIcon === "string" ? config.toggleIcon : null;
        this.toggleLabel = typeof config.toggleLabel === "string" ? config.toggleLabel : null;
    }
}