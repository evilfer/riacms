export type TypeFieldTypes =
    "string" | "string[]" |
    "number" | "number[]" |
    "boolean" | "boolean[]" |
    "related" | "related[]" |
    "object" | "object[]" |
    "json";

export interface BaseTypeField {
    name: string;
    type: TypeFieldTypes;
    computed?: boolean;
}

export interface LiteralArrayTypeField extends BaseTypeField {
    type: "string[]" | "number[]" | "boolean[]";
}

export interface LiteralTypeField extends BaseTypeField {
    type: "string" | "number" | "boolean" | "json";
    defaultValue: null | string;
}

export interface RelatedTypeField extends BaseTypeField {
    relatedType: string;
    inverseField: null | string;
}

export interface SingleRelatedTypeField extends RelatedTypeField {
    type: "related";
}

export interface MultipleRelatedTypeField extends RelatedTypeField {
    type: "related[]";
}

export interface ObjectTypeField extends BaseTypeField {
    nestedType: string;
}

export interface SingleObjectTypeField extends ObjectTypeField {
    type: "object";
}

export interface MultipleObjectTypeField extends ObjectTypeField {
    type: "object[]";
}

export type TypeField =
    LiteralTypeField |
    LiteralArrayTypeField |
    SingleRelatedTypeField |
    MultipleRelatedTypeField |
    SingleObjectTypeField |
    MultipleObjectTypeField;

export interface TypeDefinition {
    canCreate: boolean;
    implementedTypes: string[];
    extendedBy: string[];
    implementedBy: string[];
    fields: TypeField[];
    fieldMap: { [field: string]: TypeField };
}

export interface TypeDefinitionMap {
    [name: string]: TypeDefinition;
}
