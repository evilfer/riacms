import axios, {AxiosResponse} from "axios";
import {action, computed, observable, runInAction} from "mobx";
import {LocationStore} from "../../../bundles/location/location-data";
import {queryPath} from "../../../bundles/location/location-utils";

export type ValueKey = "type" | "name" | "path";

function nameToPath(name: string): string {
    return name.replace(/[^0-9a-zA-Z_\-\s]/g, "")
        .replace(/\s/g, "-");
}

export class NewPageFormStore {

    @observable public error: null | Error = null;
    @observable public submitting = false;
    @observable public values = new Map<ValueKey, string>();

    private location: LocationStore;
    private parentId: number;
    private autoPath = true;

    constructor(location: LocationStore) {
        this.location = location;
    }

    @action
    public init(parentId: number, type: string) {
        this.parentId = parentId;
        this.autoPath = true;
        this.values.set("type", type);
        this.values.set("name", "");
        this.values.set("path", "");
    }

    @action
    public setValue(key: ValueKey, value: string) {
        this.values.set(key, value);
        if (key === "path") {
            this.autoPath = !value;
        } else if (key === "name" && this.autoPath) {
            this.values.set("path", nameToPath(value));
        }
    }

    @computed
    get pathFormatError(): null | string {
        return this.values.has("path") && !this.values.get("path")!.match(/^[a-zA-Z0-9_\-]*$/) ?
            "Path must contain only alphanumeric characters, \"-\" and \"_\"." : null;
    }

    @computed
    get canSubmit(): boolean {
        return !this.submitting &&
            !!this.values.get("type") &&
            !!this.values.get("name") &&
            !!this.values.get("path") &&
            !this.pathFormatError;
    }

    @action
    public submit(): void {
        this.submitting = true;

        axios.post(`/_api/sitetree/${this.parentId}`, {
            name: this.values.get("name"),
            path: this.values.get("path"),
            type: this.values.get("type"),
        }).then((response: AxiosResponse) => {
            runInAction(() => {
                this.submitting = false;
                this.error = null;

                const id = response.data.id;
                const path = queryPath(this.location, {eid: `${id}`, ev: null}, false);
                this.location.goto(path);
            });
        }).catch(e => {
            runInAction(() => {
                this.submitting = false;
                this.error = e;
            });
        });
    }
}
