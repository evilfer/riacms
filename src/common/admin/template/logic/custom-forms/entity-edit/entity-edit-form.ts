import {TypeManager} from "../../../../../types/type-manager";
import {FormManager} from "../../forms/form-manager";
import {entityEditFields} from "./entity-edit-fields";

export class EntityEditForm extends FormManager {
    private entity: any;

    constructor(types: TypeManager, entity: any) {
        const formId = `entityedit:${entity._id}`;
        const apiEndpoint = `/_api/entity/${entity._id}`;
        const fields = entityEditFields(types, entity);
        const values = entity._data[0];
        super(formId, "put", apiEndpoint, fields, values);
        this.entity = true;
    }

    public onSubmitSuccess(data: any) {
        console.log(data);
    }
}
