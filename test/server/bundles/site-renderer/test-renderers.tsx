import {inject} from "mobx-react";
import * as React from "react";
import {ResolvedPageData} from "../../../../src/common/bundles/page-resolver/resolved-page-data";
import {TemplateRenderer} from "../../../../src/server/bundles/basic-renderer-resolver/basic-renderer-resolver-bundle";

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

export default {
    r1: R1,
    r2: inject<{ resolvedPage: ResolvedPageData }>("resolvedPage")(R2),
} as { [name: string]: TemplateRenderer };
