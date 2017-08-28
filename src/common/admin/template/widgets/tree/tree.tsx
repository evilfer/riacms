import * as React from "react";
import {Dropdown, Icon} from "semantic-ui-react";

export interface TreeDataItem {
    key: string | number;
    label: string;
    children: null | TreeDataItem[];
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
    const icon = <Icon name={iconName}
                       circular={true}
                       onClick={onChange.bind(null, item.key, !isOpen)}/>;

    const children = isOpen && (
        <div className="tree__item__children">
            <TreeItems items={item.children!} onChange={onChange}/>
        </div>
    );

    return (
        <div className="tree_item">
            {icon}
            <div className="tree__item__label">{item.label}</div>
            <div className="tree__item__menu">
                <Dropdown icon="bars">
                    <Dropdown.Menu>
                        <Dropdown.Header icon="tags" content="Tag Label"/>
                        <Dropdown.Menu scrolling>
                            <Dropdown.Item value="1" content="Option 1"/>
                        </Dropdown.Menu>
                    </Dropdown.Menu>
                </Dropdown>
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
