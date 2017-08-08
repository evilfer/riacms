import {IWrappedComponent} from "mobx-react";
import {Component} from "react";

export interface Template {
    component: Component<{}, undefined> | (() => JSX.Element) | IWrappedComponent<any>;
    options: { [name: string]: any };
}
