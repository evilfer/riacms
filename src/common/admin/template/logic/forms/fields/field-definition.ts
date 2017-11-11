import {FieldPresentation} from "./field-presentation";

export interface BaseFieldDefinition {
    name: string;
    presentation: FieldPresentation;
    multiple: boolean;
    min?: number;
    max?: number;
}

export interface LiteralFieldDefinition extends BaseFieldDefinition {
    type: "string" | "boolean" | "number";
}

export interface NestedFieldDefinition extends BaseFieldDefinition {
    type: "nested";
    nestedFields: FieldDefinition[];
}

export interface RelatedFieldDefinition extends BaseFieldDefinition {
    type: "related";
    relatedType: string;
    allowSubtypes: boolean;
}

export type FieldDefinition = LiteralFieldDefinition | NestedFieldDefinition | RelatedFieldDefinition;
