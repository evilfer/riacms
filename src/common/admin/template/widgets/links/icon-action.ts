import * as classNames from "classnames";
import * as extend from "extend";
import * as React from "react";
import {LocationStore} from "../../../../bundles/location/location-data";
import {SIZE_PROP_KEYS, SizeProps} from "../base-widget/common-props";

export const ICON_ACTION_PROP_KEYS = [
    ...SIZE_PROP_KEYS,
    "location",
    "name"];

export interface IconActionProps extends SizeProps, React.AllHTMLAttributes<any> {
    location?: LocationStore;
    name: string;
}

export function iconActionProps(props: IconActionProps): React.AllHTMLAttributes<any> {
    const elProps = extend({}, props);
    ICON_ACTION_PROP_KEYS.forEach((key: string) => {
        delete (elProps as { [key: string]: any })[key];
    });
    return elProps;
}

export function iconActionClassName(base: string, props: IconActionProps) {
    return classNames(base, props.className, {
        [`${base}--small`]: props.small,
        [`${base}--medium`]: !props.small && !props.large,
        [`${base}--large`]: props.large,
    });
}
