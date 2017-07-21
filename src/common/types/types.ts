export type TypeFieldTypes =
    "string" | "string[]" |
    "number" | "number[]" |
    "boolean" | "boolean[]" |
    "related" | "related[]" |
    "object" | "object[]";

export interface BaseTypeField {
    name: string;
    type: TypeFieldTypes;
}

export interface LiteralTypeField extends BaseTypeField {
    type: "string" | "number" | "boolean" | "string[]" | "number[]" | "boolean[]";
}

export interface RelatedTypeField extends BaseTypeField {
    relatedType: string;
    inverseField: null | string;
}

export interface SingleRelatedTypeField extends RelatedTypeField {
    type: "related";
}

export interface MultipleRelatedTypeField extends BaseTypeField {
    type: "related[]";
}

export interface ObjectTypeField extends BaseTypeField {
    nestedFields: TypeDefinition;
}

export interface SingleObjectTypeField extends ObjectTypeField {
    type: "object";
}

export interface MultipleObjectTypeField extends ObjectTypeField {
    type: "object[]";
}

export type TypeField =
    LiteralTypeField |
    SingleRelatedTypeField |
    MultipleRelatedTypeField |
    SingleObjectTypeField |
    MultipleObjectTypeField;

export type TypeDefinition = TypeField[];

export interface TypeDefinitionMap {
    [name: string]: TypeDefinition;
}
