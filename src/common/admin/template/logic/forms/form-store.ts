import {action, observable} from "mobx";
import {FormManager} from "./form-manager";

export class FormStore {
    @observable
    private forms = new Map<string, FormManager>();

    @action
    public initForm(form: FormManager) {
        this.forms.set(form.id, form);
    }

    public getForm(id: string): null | FormManager {
        return this.forms.get(id) || null;
    }

    @action
    public clearForm(id: string): void {
        this.forms.delete(id);
    }
}
