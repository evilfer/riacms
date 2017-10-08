import * as classNames from "classnames";
import * as React from "react";
import Icon from "../icon/icon";

export interface MenuItemProps {
    label: string;
    icon: string;
    disabled?: boolean;
    onClick?: () => void;
}

export default class MenuItem extends React.Component<MenuItemProps> {
    public render() {
        const {label, icon, disabled = false, onClick} = this.props;

        return (
            <div className={classNames("menu__item", {disabled})}
                 onClick={onClick}>
                {icon && <Icon name={icon}/>}
                {label}
            </div>
        );
    }
}
