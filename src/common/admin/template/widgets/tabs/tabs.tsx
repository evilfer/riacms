import * as classNames from "classnames";
import * as React from "react";
import {Icon} from "../icon/icon";
import {Link} from "../links/link";

export interface TabData {
    icon?: string;
    label: string;
    action: string | (() => void);
    active?: boolean;
}

export interface TabsProps {
    tabs: TabData[];
}

export class Tabs extends React.Component<TabsProps> {
    public render() {
        const tabs = this.props.tabs.map(({icon, label, action, active = false}, i) => {
            if (typeof action === "string") {
                return (
                    <Link key={i}
                          className={classNames("tabs__item", {active})}
                          href={action}>
                        {icon && <Icon name={icon}/>}
                        {label}
                    </Link>
                );
            } else {
                return (
                    <button key={i}
                            className={classNames("tabs__item", {active})}
                            onClick={evt => {
                                evt.preventDefault();
                                action();
                            }}>
                        {icon && <Icon name={icon}/>}
                        {label}
                    </button>
                );
            }
        });

        return <div className="tabs">{tabs}</div>;
    }
}
