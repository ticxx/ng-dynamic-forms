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
    DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER,
    DYNAMIC_FORM_CONTROL_TYPE_GROUP,
    DYNAMIC_FORM_CONTROL_TYPE_INPUT,
    DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP,
    DYNAMIC_FORM_CONTROL_TYPE_SELECT,
    DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA,
    DYNAMIC_FORM_CONTROL_TYPE_TIMEPICKER,
    DynamicDatePickerModel,
    DynamicFormGroupModel,
    DYNAMIC_FORM_CONTROL_TYPE_LAYOUT_GROUP,
    DynamicFormLayoutGroupModel,
    LayoutGroupLayoutType,
    GroupLayoutType
} from "@ng-dynamic-forms/core";

export const enum NGBootstrapFormControlType {

    Array = 1, //"ARRAY",
    Calendar = 2, //"CALENDAR",
    Checkbox = 3, //"CHECKBOX",
    CheckboxGroup = 4, // "CHECKBOX_GROUP",
    DatePicker = 5, //"DATEPICKER",
    Group = 6, //"GROUP",
    Input = 7, //"INPUT",
    RadioGroup = 8, //"RADIO_GROUP",
    Select = 9, //"SELECT",
    TextArea = 10, //"TEXTAREA",
    TimePicker = 11, //"TIMEPICKER"

    LayoutGroupCardLayout= 80,
    GroupCardLayout= 90

}

@Component({
    selector: "dynamic-ng-bootstrap-form-control,dynamic-form-ng-bootstrap-control",
    templateUrl: "./dynamic-ng-bootstrap-form-control.component.html"
})
export class DynamicNGBootstrapFormControlComponent extends DynamicFormControlComponent implements OnChanges {

    @ContentChildren(DynamicTemplateDirective) contentTemplateList: QueryList<DynamicTemplateDirective>;
    @Input("templates") inputTemplateList: QueryList<DynamicTemplateDirective>;

    @Input() asBootstrapFormGroup: boolean = true;
    @Input() bindId: boolean = true;
    @Input() context: DynamicFormArrayGroupModel | null = null;
    @Input() group: FormGroup;
    @Input() hasErrorMessaging: boolean = false;
    @Input() layout: DynamicFormLayout;
    @Input() model: DynamicFormControlModel;

    @Output("dfBlur") blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
    @Output("dfChange") change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
    @Output("dfFocus") focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
    @Output("ngbEvent") customEvent: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

    type: NGBootstrapFormControlType | null;

    constructor(protected changeDetectorRef: ChangeDetectorRef, protected layoutService: DynamicFormLayoutService,
                protected validationService: DynamicFormValidationService) {

        super(changeDetectorRef, layoutService, validationService);
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);

        if (changes["model"]) {
            this.type = DynamicNGBootstrapFormControlComponent.getFormControlType(this.model);
        }
    }

    static getFormControlType(model: DynamicFormControlModel): NGBootstrapFormControlType | null {

        switch (model.type) {

            case DYNAMIC_FORM_CONTROL_TYPE_ARRAY:
                return NGBootstrapFormControlType.Array;

            case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX:
                return NGBootstrapFormControlType.Checkbox;

            case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP:
                return NGBootstrapFormControlType.CheckboxGroup;

            case DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER:
                let datepickerModel = model as DynamicDatePickerModel;

                return datepickerModel.inline ? NGBootstrapFormControlType.Calendar : NGBootstrapFormControlType.DatePicker;

            // case DYNAMIC_FORM_CONTROL_TYPE_GROUP:
            //     return NGBootstrapFormControlType.Group;

            case DYNAMIC_FORM_CONTROL_TYPE_INPUT:
                return NGBootstrapFormControlType.Input;

            case DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP:
                return NGBootstrapFormControlType.RadioGroup;

            case DYNAMIC_FORM_CONTROL_TYPE_SELECT:
                return NGBootstrapFormControlType.Select;

            case DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA:
                return NGBootstrapFormControlType.TextArea;

            case DYNAMIC_FORM_CONTROL_TYPE_TIMEPICKER:
                return NGBootstrapFormControlType.TimePicker;

            case DYNAMIC_FORM_CONTROL_TYPE_LAYOUT_GROUP:
                let g: DynamicFormLayoutGroupModel= <DynamicFormLayoutGroupModel>model;
                if(g.layoutType===LayoutGroupLayoutType.card  ||
                    g.layoutType===LayoutGroupLayoutType.card_with_title ||
                    g.layoutType===LayoutGroupLayoutType.card_with_header){
                    return NGBootstrapFormControlType.LayoutGroupCardLayout;
                }else {
                    console.error("No valid LayoutGroupLayoutTyp: " + g.layoutType);
                }

            case DYNAMIC_FORM_CONTROL_TYPE_GROUP:
                let group: DynamicFormGroupModel= <DynamicFormGroupModel>model;
                if(group.layoutType===GroupLayoutType.card  ||
                    group.layoutType===GroupLayoutType.card_with_title ||
                    group.layoutType===GroupLayoutType.card_with_header){
                    return NGBootstrapFormControlType.GroupCardLayout;
                }else{
                    return NGBootstrapFormControlType.Group;
                }

            default:
                return null;
        }
    }
}