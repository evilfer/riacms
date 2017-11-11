import axios, {AxiosResponse} from "axios";
import {action, observable, runInAction} from "mobx";
import {FieldGroupManager} from "./field-managers/field-group-manager";
import {FieldDefinition} from "./fields/field-definition";

export class FormManager extends FieldGroupManager {
    public id: string;
    @observable public method: "post" | "put";
    @observable public action: string;
    @observable public submitting = false;
    @observable public submitError: null | Error = null;

    constructor(id: string, method: "post" | "put", formAction: string, fields: FieldDefinition[], values: { [key: string]: any }) {
        super(fields, values);
        this.id = id;
        this.method = method;
        this.action = formAction;
    }

    @action
    public submit(): void {
        this.submitting = true;

        axios[this.method](this.action, this.value).then((response: AxiosResponse) => {
            runInAction(() => {
                this.submitting = false;
                this.submitError = null;

                this.onSubmitSuccess(response.data);
            });
        }).catch(e => {
            runInAction(() => {
                this.submitting = false;
                this.submitError = e;
            });
        });
    }

    protected onSubmitSuccess(data: any): void {
        return;
    }
}
