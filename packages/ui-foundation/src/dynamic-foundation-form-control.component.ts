import {
    ChangeDetectorRef,
    Component,
    ContentChildren,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    QueryList,
    SimpleChanges
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import {
    DynamicFormArrayGroupModel,
    DynamicFormControlComponent,
    DynamicFormControlEvent,
    DynamicFormControlModel,
    DynamicFormLayout,
    DynamicFormLayoutService,
    DynamicFormValidationService,
    DynamicTemplateDirective,
    DYNAMIC_FORM_CONTROL_TYPE_ARRAY,
    DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX,
    DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP,
    DYNAMIC_FORM_CONTROL_TYPE_GROUP,
    DYNAMIC_FORM_CONTROL_TYPE_INPUT,
    DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP,
    DYNAMIC_FORM_CONTROL_TYPE_SELECT,
    DYNAMIC_FORM_CONTROL_TYPE_SWITCH,
    DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA
} from "@ng-dynamic-forms/core";

export const enum FoundationFormControlType {

    Array = 1, //"ARRAY",
    Checkbox = 2, //"CHECKBOX",
    Group = 3, //"GROUP",
    Input = 4, //"INPUT",
    RadioGroup = 5, //"RADIO_GROUP",
    Select = 6, //"SELECT",
    Switch = 7, //"SWITCH",
    TextArea = 8, //"TEXTAREA"
}

@Component({
    selector: "dynamic-foundation-form-control,dynamic-form-foundation-sites-control",
    templateUrl: "./dynamic-foundation-form-control.component.html"
})
export class DynamicFoundationFormControlComponent extends DynamicFormControlComponent implements OnChanges {

    @ContentChildren(DynamicTemplateDirective) contentTemplateList: QueryList<DynamicTemplateDirective>;
    @Input("templates") inputTemplateList: QueryList<DynamicTemplateDirective>;

    @Input() bindId: boolean = true;
    @Input() context: DynamicFormArrayGroupModel | null = null;
    @Input() group: FormGroup;
    @Input() hasErrorMessaging: boolean = false;
    @Input() layout: DynamicFormLayout;
    @Input() model: DynamicFormControlModel;

    @Output("dfBlur") blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
    @Output("dfChange") change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
    @Output("dfFocus") focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

    type: FoundationFormControlType | null;

    constructor(protected changeDetectorRef: ChangeDetectorRef, protected layoutService: DynamicFormLayoutService,
                protected validationService: DynamicFormValidationService) {

        super(changeDetectorRef, layoutService, validationService);
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);

        if (changes["model"]) {
            this.type = DynamicFoundationFormControlComponent.getFormControlType(this.model);
        }
    }

    static getFormControlType(model: DynamicFormControlModel): FoundationFormControlType | null {

        switch (model.type) {

            case DYNAMIC_FORM_CONTROL_TYPE_ARRAY:
                return FoundationFormControlType.Array;

            case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX:
                return FoundationFormControlType.Checkbox;

            case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP:
            case DYNAMIC_FORM_CONTROL_TYPE_GROUP:
                return FoundationFormControlType.Group;

            case DYNAMIC_FORM_CONTROL_TYPE_INPUT:
                return FoundationFormControlType.Input;

            case DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP:
                return FoundationFormControlType.RadioGroup;

            case DYNAMIC_FORM_CONTROL_TYPE_SELECT:
                return FoundationFormControlType.Select;

            case DYNAMIC_FORM_CONTROL_TYPE_SWITCH:
                return FoundationFormControlType.Switch;

            case DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA:
                return FoundationFormControlType.TextArea;

            default:
                return null;
        }
    }
}