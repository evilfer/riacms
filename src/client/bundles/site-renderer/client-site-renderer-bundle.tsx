import * as React from "react";
import {render} from "react-dom";
import {LocationStore} from "../../../common/bundles/location/location-data";
import {Template, TemplateComponent} from "../../../common/bundles/site-renderer/template";
import {ClientBundle} from "../client-bundle";
import {RiaProvider} from "./ria-provider";

export class ClientSiteRendererBundle extends ClientBundle {
    private template: Template;

    constructor(template: Template) {
        super();
        this.template = template;
    }

    public getName(): string {
        return "siteRenderer";
    }

    public launch(): void {
        const stores: { location: LocationStore, [name: string]: any } =
            this.clientContext.bundles.getStores() as { location: LocationStore, [name: string]: any };
        const Component: TemplateComponent = this.template.component;

        render((
            <RiaProvider context={this.clientContext} stores={stores}>
                <Component/>
            </RiaProvider>
        ), document.getElementById("root"));
    }
}
