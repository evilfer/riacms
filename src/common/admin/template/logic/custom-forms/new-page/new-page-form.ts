import {LocationStore} from "../../../../../bundles/location/location-data";
import {queryPath} from "../../../../../bundles/location/location-utils";
import {TypeManager} from "../../../../../types/type-manager";
import {FieldManager} from "../../forms/field-managers/abstract-field-manager";
import {FormManager} from "../../forms/form-manager";
import {newPageFields} from "./new-page-fields";

function nameToPath(name: string): string {
    return name.replace(/[^0-9a-zA-Z_\-\s]/g, "")
        .replace(/\s/g, "-");
}

export class NewPageForm extends FormManager {
    private location: LocationStore;
    private autoPath: boolean;

    constructor(types: TypeManager, location: LocationStore, parentId: number) {
        super("newpage", "post", `/_api/sitetree/${parentId}`, newPageFields(types), {type: "page"});
        this.location = location;
        this.autoPath = true;
    }

    public onSubmitSuccess(data: any) {
        const id = data.id;
        const path = queryPath(this.location, {eid: `${id}`, ev: null}, false);
        this.location.goto(path);
    }

    public childrenValueChanged(fm: FieldManager<any>): void {
        switch (fm.def.name) {
            case "path":
                this.autoPath = !fm.value;
                break;
            case "name":
                if (this.autoPath) {
                    this.fieldMap.get("path")!.updateValue(nameToPath(fm.value));
                }
                break;
        }
    }
}
