export interface SizeProps {
    small?: boolean;
    medium?: boolean;
    large?: boolean;
}

export function sizeProps(props: SizeProps): SizeProps {
    return {
        large: props.large,
        medium: props.medium,
        small: props.small,
    };
}

export const SIZE_PROP_KEYS = ["small", "medium", "large"];
