import {inject, observer} from "mobx-react";
import * as React from "react";
import {EntityByIdData, EntityFinderStore} from "../../../../bundles/entity-finder/entity-finder-data";
import {LocationStore} from "../../../../bundles/location/location-data";
import {ResolvedPageData} from "../../../../bundles/page-resolver/resolved-page-data";

export interface CurrentEntityInnerProps {
    entityFinder?: EntityFinderStore;
    location?: LocationStore;
    resolvedPage?: ResolvedPageData;
}

export interface CurrentEntityProps extends CurrentEntityInnerProps {
    currentEntity?: EntityByIdData;
}

export function currentEntityI<P extends CurrentEntityProps>(...stores: string[]): ((target: any) => typeof target) {
    return (target: any) => {
        const clazz = class extends React.Component<P> {
            public render() {
                const location = this.props.location as LocationStore;
                const entityFinder = this.props.entityFinder as EntityFinderStore;
                const resolvedPage = this.props.resolvedPage as ResolvedPageData;

                const currentEntityData: EntityByIdData = location!.query.has("eid") ?
                    entityFinder!.byId(parseInt(location.query.get("eid") || "", 10)) :
                    {
                        entity: resolvedPage!.page,
                        loading: resolvedPage.loading,
                    };

                const Component = target;
                return <Component {...this.props} currentEntity={currentEntityData}/>;
            }
        };

        return inject("entityFinder", "location", "resolvedPage", ...stores)(observer(clazz));
    };
}

export const currentEntityD = currentEntityI();
