import {observer} from "mobx-react";
import * as React from "react";
import {TypeManager} from "../../../../types/type-manager";
import {NewPageFormStore} from "../../logic/new-page-form-store";
import {currentEntity, CurrentEntityProps} from "../base-components/current-entity";

export interface EntityNewPageProps extends CurrentEntityProps {
    types?: TypeManager;
    newPageForm?: NewPageFormStore;
}

@currentEntity
@observer
export class EntityHome extends React.Component<EntityNewPageProps> {
    public render(): JSX.Element {
        const {loading, entity} = this.props.currentEntity!;

        if (!entity) {
            return <div>no entity</div>;
        }

        return (
            <div>
                <p>Viewing {entity._id}, {entity._type}.</p>
            </div>
        );
    }
}
