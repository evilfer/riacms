import {observer} from "mobx-react";
import * as React from "react";
import {TypeManager} from "../../../../types/type-manager";
import {NewPageForm} from "../../logic/custom-forms/new-page/new-page-form";
import {FormStore} from "../../logic/forms/form-store";
import {Form} from "../../widgets/forms/form";
import {currentEntityI, CurrentEntityProps} from "../base-components/current-entity";

export interface EntityNewPageProps extends CurrentEntityProps {
    types?: TypeManager;
    forms?: FormStore;
}

@currentEntityI("types", "forms", "location")
@observer
export class EntityNewPage extends React.Component<EntityNewPageProps> {
    public componentWillMount() {
        this.prepareForm(this.props);
    }

    public componentWillReceiveProps(nextProps: EntityNewPageProps) {
        if (this.props.currentEntity !== nextProps.currentEntity) {
            this.prepareForm(nextProps);
        }
    }

    public componentWillUnmount() {
        this.props.forms!.clearForm("newpage");
    }

    public render(): JSX.Element {
        const {forms, types, currentEntity} = this.props;
        const {entity} = currentEntity!;

        const form = forms!.getForm("newpage");

        if (!entity || !form) {
            return <div>no entity</div>;
        }

        if (!types!.isA(entity, "site_tree_parent")) {
            return <div>Cannot create page under {entity._id} ({entity._type}).</div>;
        }

        return <Form formManager={form}/>;
    }

    private prepareForm(props: EntityNewPageProps) {
        const {currentEntity, forms, types, location} = props;
        if (currentEntity) {
            forms!.initForm(new NewPageForm(types!, location!, currentEntity.entity._id));
        }
    }
}
