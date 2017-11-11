import {TypeManager} from "../../../../../types/type-manager";
import {FormManager} from "../../forms/form-manager";
import {entityEditFields} from "./entity-edit-fields";

export class EntityEditForm extends FormManager {
    private entity: any;

    constructor(types: TypeManager, entity: any) {
        super(`entityedit:${entity._id}`, "put", `/_api/entity/${entity._id}`, entityEditFields(types, entity), entity);
        this.entity = true;
    }

    public onSubmitSuccess(data: any) {
        console.log(data);
    }
}
