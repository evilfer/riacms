import * as extend from "extend";
import {FormStore} from "./logic/forms/form-store";
import {initWidgetStores} from "./widgets/widget-stores";

export function initStores(dataStore: { [name: string]: any }): { [name: string]: any } {
    return extend({}, initWidgetStores(), {
        forms: new FormStore(),
    });
}
