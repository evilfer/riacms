/* tslint:disable */
import {inject} from "mobx-react";
import * as React from "react";
import {ResolvedPageData} from "../../../../src/common/bundles/page-resolver/resolved-page-data";
import {dynamicDataMode} from "../../../../src/common/bundles/site-renderer/dynamic-data-wrapper";
import {Template} from "../../../../src/common/bundles/site-renderer/template";

export function R1() {
    return <div>Hello world</div>;
}

export class R2 extends React.Component<{ resolvedPage: ResolvedPageData }> {
    public render() {
        const {resolvedPage} = this.props;

        const related = resolvedPage.page.relatedPage && <p>Related page: {resolvedPage.page.relatedPage.name}</p>;

        return (
            <main>
                <h1>{resolvedPage.page.name}</h1>
                <p>At: {resolvedPage.site.name}</p>
                {related}
            </main>
        );
    }
}

@dynamicDataMode
export class R3Browser extends React.Component<{}> {
    render() {
        return <div>browser only</div>;
    }
}

export class R3All extends React.Component<{}> {
    render() {
        return <div>all contexts</div>;
    }
}

export class R3 extends React.Component<{}> {
    render() {
        return (
            <div>
                <R3All/>
                <R3Browser/>
            </div>
        );
    }
}

export default {
    r1: {
        component: R1,
        options: {},
        stores: ["resolvedPage"],
    },
    r2: {
        component: inject("resolvedPage")(R2),
        options: {},
        stores: ["resolvedPage"],
    },
    r3: {
        component: R3,
        options: {},
        stores: ["resolvedPage", "renderingContext", "dynamicData"],
    },
} as { [name: string]: Template };
