import {observer} from "mobx-react";
import * as React from "react";
import {TypeManager} from "../../../../types/type-manager";
import {NewPageFormStore} from "../../logic/new-page-form-store";
import {LoadingIndicator} from "../../widgets";
import {currentEntityI, CurrentEntityProps} from "../base-components/current-entity";

export interface EntityNewPageProps extends CurrentEntityProps {
    types?: TypeManager;
    newPageForm?: NewPageFormStore;
}

@currentEntityI("types", "newPageForm")
@observer
export class EntityNewPage extends React.Component<EntityNewPageProps> {
    public componentWillMount() {
        console.log("m");
        if (this.props.currentEntity) {
            this.props.newPageForm!.init(this.props.currentEntity.entity._id, "page");
        }
    }

    public componentWillReceiveProps(nextProps: EntityNewPageProps) {
        console.log(nextProps);
        if (nextProps.currentEntity && this.props.currentEntity !== nextProps.currentEntity) {
            console.log("if on rp");
            nextProps.newPageForm!.init(nextProps.currentEntity.entity._id, "page");
        }
    }

    public render(): JSX.Element {
        const {types, currentEntity} = this.props;
        const {loading, entity} = currentEntity!;

        if (!entity) {
            return <div>no entity</div>;
        }

        if (!types!.isA(entity, "site_tree_parent")) {
            return <div>Cannot create page under {entity._id} ({entity._type}).</div>;
        }

        const form = this.props.newPageForm!;
        const error = form.error && <p>{form.error.message}</p>;
        const pathError = form.pathFormatError && <p>{form.pathFormatError}</p>;

        return (
            <div>
                <p>Create new page under "{entity.name}" ({entity._id}, {entity._type}).</p>
                {error}
                <select name="type"
                        value={form.values.get("type")}
                        onChange={evt => form.setValue("type", evt.target.value)}
                        disabled={form.submitting}>
                    {types!.getImplementedBy("page").map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                <input type="text" name="name" value={form.values.get("name")}
                       onChange={evt => {
                           form.setValue("name", evt.target.value);
                       }}
                       disabled={form.submitting}/>
                <input type="text" name="path" value={form.values.get("path")}
                       onChange={evt => form.setValue("path", evt.target.value)}
                       disabled={form.submitting}/>
                {pathError}
                <button disabled={!form.canSubmit} onClick={() => form.submit()}>Create</button>
                <LoadingIndicator loading={form.submitting}/>
            </div>
        );
    }
}
