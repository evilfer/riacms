import {action, observable} from "mobx";

export class BaseWidgetStore<E> {
    @observable protected data = new Map<string, E>();

    private nextId = 1;

    @action
    public getDynamicId(): string {
        return `__${this.nextId++}`;
    }

    @action
    public setData(id: string, data: E | null) {
        if (data !== null) {
            this.data.set(id, data);
        } else {
            this.data.delete(id);
        }
    }

    @action
    public unmount(id: string) {
        this.data.delete(id);
    }

    public getData(id: string): E | null {
        return this.data.get(id) || null;
    }
}
