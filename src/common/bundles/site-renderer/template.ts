import {IWrappedComponent} from "mobx-react";
import {Component} from "react";

export type TemplateComponent = any | Component<{}, undefined> | (() => JSX.Element) | IWrappedComponent<any>;

export interface Template {
    component: TemplateComponent;
    options: {
        styledComponents?: boolean,
        jsScripts?: string[],
        simpleHtml?: boolean,
    };
    stores: string[];
}
