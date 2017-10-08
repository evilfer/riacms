import * as React from "react";
import Icon from "../icon/icon";
import Menu from "../menu/menu";
import {default as MenuItem, MenuItemProps} from "../menu/menu-item";
import {PopupController, PopupControllerProps} from "../popup/popup-controller";
import {inject, observer} from "mobx-react";

export interface PopupMenuProps extends PopupControllerProps {
    menuItems: () => MenuItemProps[];
}

@inject<PopupControllerProps>("popups")
@observer
export default class PopupMenu extends PopupController<PopupMenuProps> {
    public getClassNames(): string {
        return "popup-menu";
    }

    public renderContent(): any  {
        console.log("render content");
        return <Icon name="ellipsis-v" onClick={() => this.showPopup()}/>;
    }

    public renderPopup(): any {
        const items = this.props.menuItems().map((itemProps, i) =>
            <MenuItem key={i} {...itemProps}/>
        );
        return <Menu>{items}</Menu>;
    }
}
