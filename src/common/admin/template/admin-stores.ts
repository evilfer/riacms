import * as extend from "extend";
import {NewPageFormStore} from "./logic/new-page-form-store";
import {initWidgetStores} from "./widgets/widget-stores";

export function initStores(dataStore: { [name: string]: any }): { [name: string]: any } {
    return extend({}, initWidgetStores(), {
        newPageForm: new NewPageFormStore(dataStore.location),
    });
}
