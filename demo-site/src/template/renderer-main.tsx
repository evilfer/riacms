import {inject} from "mobx-react";
import * as React from "react";
import {ResolvedPageData} from "../../../src/common/bundles/page-resolver/resolved-page-data";
import {TemplateHead} from "./renderer-head";

export interface RendererMainProps {
    resolvedPage: ResolvedPageData;
}

export function MainContent({resolvedPage}: RendererMainProps) {
    if (!resolvedPage.found) {
        return <div>404</div>;
    }

    const nav = resolvedPage.site.childLinks.map((link: any) => (
        <li key={link.child._id}>{link.child.name}, {link.child._id}</li>
    ));

    const pageNav = resolvedPage.page.childLinks.map((link: any) => (
        <li key={link.child._id}>{link.child.name}, {link.child._id}</li>
    ));

    return (
        <div>
            <h1>site: {resolvedPage.site.name}</h1>
            <ul>{nav}</ul>
            <h2>page children</h2>
            <ul>{pageNav}</ul>
            <p>{JSON.stringify(resolvedPage)}</p>
        </div>
    );
}

export function RendererMain({resolvedPage}: RendererMainProps) {
    return (
        <div>
            <TemplateHead/>
            <MainContent resolvedPage={resolvedPage}/>
        </div>
    );
}

const WrappedRendererMain = inject("resolvedPage")(RendererMain);

export {WrappedRendererMain};
