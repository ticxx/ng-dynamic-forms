import { FormGroup, FormControl } from "@angular/forms";
import { DynamicFormControlModel } from "../model/dynamic-form-control.model";
import {
    DynamicFormControlRelation,
    DynamicFormControlRelationGroup,
    DYNAMIC_FORM_CONTROL_ACTION_DISABLE,
    DYNAMIC_FORM_CONTROL_ACTION_ENABLE,
    DYNAMIC_FORM_CONTROL_CONNECTIVE_AND,
    DYNAMIC_FORM_CONTROL_CONNECTIVE_OR
} from "../model/misc/dynamic-form-control-relation.model";
import { AbstractControl } from "@angular/forms/src/model";

export class RelationUtils {

    static findActivationRelation(relGroups: DynamicFormControlRelationGroup[]): DynamicFormControlRelationGroup | null {

        let rel = relGroups.find(rel => {
            return rel.action === DYNAMIC_FORM_CONTROL_ACTION_DISABLE || rel.action === DYNAMIC_FORM_CONTROL_ACTION_ENABLE;
        });

        return rel !== undefined ? rel : null;
    }

    static getRelatedFormControls(model: DynamicFormControlModel, controlGroup: FormGroup): FormControl[] {

        let controls: FormControl[] = [];

        model.relation.forEach(relGroup => relGroup.when.forEach(rel => {

            if (model.id === rel.id) {
                throw new Error(`FormControl ${model.id} cannot depend on itself`);
            }

            let control = controlGroup.get(rel.id) as FormControl;

            // OK dbconn Ergänzung wir wollen auch auf Controls aus anderen Tabs verweisen können.
            // Wir können dies relativ entspann tun, da unsere Control Ids unique sind.
            if( !control && controlGroup.parent && controlGroup.parent instanceof FormGroup) {
                control = this.findControlInOtherTabs( controlGroup, rel.id);
            }

            if (control && !controls.some(controlElement => controlElement === control)) {
                controls.push(control);
            }
        }));

        return controls;
    }

    // Eigentlich wäre hier eine rekursive Lösung gut aber uns reichen zur Zeit die Controls unter den Tabs
    static findControlInOtherTabs ( currentTab: FormGroup, key: string ) {
      //  if( currentTab.parent && currentTab.parent instanceof FormGroup) {
            const pGroup = <FormGroup> currentTab.parent;
            let _control = pGroup.get(key) as FormControl;
            if (!_control) {
                Object.keys(pGroup.controls).forEach(_key => {
                    // eigentlich wollen wir die Schleife verlassen wenn wir das Cintrol gefunden haben ...
                    // break wirft einen ts Fehler ???
                    if (!_control) {
                        const child = <AbstractControl> pGroup.get( _key );
                        _control = child.get( key ) as FormControl;
                    }
                });
            }
            return _control;


    }

    static isFormControlToBeDisabled(relGroup: DynamicFormControlRelationGroup, _formGroup: FormGroup): boolean {

        let formGroup: FormGroup = _formGroup;

        return relGroup.when.reduce((toBeDisabled: boolean, rel: DynamicFormControlRelation, index: number) => {

            let control = formGroup.get(rel.id);
            if( !control && formGroup.parent && formGroup.parent instanceof FormGroup) {
                control = this.findControlInOtherTabs( formGroup, rel.id);
            }

            if (control && relGroup.action === DYNAMIC_FORM_CONTROL_ACTION_DISABLE) {

                if (index > 0 && relGroup.connective === DYNAMIC_FORM_CONTROL_CONNECTIVE_AND && !toBeDisabled) {
                    return false;
                }

                if (index > 0 && relGroup.connective === DYNAMIC_FORM_CONTROL_CONNECTIVE_OR && toBeDisabled) {
                    return true;
                }

                return rel.value === control.value || rel.status === control.status;
            }

            if (control && relGroup.action === DYNAMIC_FORM_CONTROL_ACTION_ENABLE) {

                if (index > 0 && relGroup.connective === DYNAMIC_FORM_CONTROL_CONNECTIVE_AND && toBeDisabled) {
                    return true;
                }

                if (index > 0 && relGroup.connective === DYNAMIC_FORM_CONTROL_CONNECTIVE_OR && !toBeDisabled) {
                    return false;
                }

                return !(rel.value === control.value || rel.status === control.status);
            }

            return false;

        }, false);
    }
}