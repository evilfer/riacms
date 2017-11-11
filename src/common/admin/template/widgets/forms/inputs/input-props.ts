import {LiteralValueSingleFieldManager} from "../../../logic/forms/field-managers/literal-single-field-manager";

export interface InputProps {
    id: string;
}

export interface LiteralInputProps extends InputProps {
    fm: LiteralValueSingleFieldManager;
}
