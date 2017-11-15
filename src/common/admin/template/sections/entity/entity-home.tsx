import {observer} from "mobx-react";
import * as React from "react";
import {currentEntityI, CurrentEntityProps} from "../base-components/current-entity";
import {EntityEditForm} from "../../logic/custom-forms/entity-edit/entity-edit-form";
import {TypeManager} from "../../../../types/type-manager";
import {FormStore} from "../../logic/forms/form-store";
import {Form} from "../../widgets/forms/form";

export interface EntityHomeProps extends CurrentEntityProps {
    types?: TypeManager;
    forms?: FormStore;
}

@currentEntityI("forms", "types")
@observer
export class EntityHome extends React.Component<EntityHomeProps> {
    public componentWillMount() {
        this.prepareForm();
    }

    public componentWillReceiveProps(nextProps: CurrentEntityProps) {
        if (this.props.currentEntity !== nextProps.currentEntity) {
            this.prepareForm(nextProps);
        }
    }

    public componentWillUnmount() {
        const formId = this.formId();
        if (formId) {
            this.props.forms!.clearForm(formId);
        }
    }

    public render(): JSX.Element {
        const formId = this.formId();
        const form = formId ? this.props.forms!.getForm(formId) : null;

        if (form === null) {
            return <div>no entity</div>;
        }

        return (
            <Form formManager={form}/>
        );
    }

    private formId(props: EntityHomeProps = this.props): string | null {
        const {loading, entity} = this.props.currentEntity!;
        return entity && !loading ? `entityedit:${entity._id}` : null;
    }

    private prepareForm(props: EntityHomeProps = this.props) {
        const {currentEntity, forms, types} = props;
        if (currentEntity && currentEntity.entity && currentEntity.entity._data) {
            forms!.initForm(new EntityEditForm(types!, currentEntity.entity));
        }
    }
}
