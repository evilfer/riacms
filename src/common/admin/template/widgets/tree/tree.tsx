import * as React from "react";
import Icon from "../icon/icon";
import {MenuItemProps} from "../menu/menu-item";
import PopupMenu from "../popup-menu/popup-menu";

export interface TreeDataItem {
    key: string | number;
    label: string;
    children: null | TreeDataItem[];
    menu?: () => MenuItemProps[];
}

export interface TreeItemProps {
    item: TreeDataItem;
    onChange: (key: string | number, open: boolean) => void;
}

export interface TreeProps {
    items: TreeDataItem[];
    onChange: (key: string | number, open: boolean) => void;
}

function TreeItem({item, onChange}: TreeItemProps): JSX.Element {
    const isOpen = !!item.children;
    const iconName = isOpen ? "minus" : "plus";
    const icon = <Icon name={iconName} onClick={onChange.bind(null, item.key, !isOpen)}/>;

    const children = isOpen && (
        <div className="tree__item__children">
            <TreeItems items={item.children!} onChange={onChange}/>
        </div>
    );

    const menu = item.menu && (
        <div className="tree__item__menu">
            <PopupMenu menuItems={item.menu}/>
        </div>
    );

    return (
        <div className="tree__item">
            <div className="tree__item__row">
                {icon}
                <div className="tree__item__label">{item.label}</div>
                {menu}
            </div>
            {children}
        </div>
    );
}

function TreeItems({onChange, items}: TreeProps): JSX.Element {
    return (
        <div className="tree__items">
            {items.map((item, i) => <TreeItem key={item.key} item={item} onChange={onChange}/>)}
        </div>
    );
}

export function Tree(props: TreeProps): JSX.Element {
    return <div className="tree"><TreeItems {...props}/></div>;
}
