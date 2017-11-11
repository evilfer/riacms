import {inject, observer} from "mobx-react";
import * as React from "react";
import {Menu} from "../menu/menu";
import {MenuItem, MenuItemProps} from "../menu/menu-item";
import {PopupController, PopupControllerProps} from "../popup/popup-controller";
import {IconButton} from "../links/icon-button";
import {SizeProps, sizeProps} from "../base-widget/common-props";

export interface PopupMenuProps extends SizeProps, PopupControllerProps {
    menuItems: () => MenuItemProps[];
}

@inject("popups")
@observer
export class PopupMenu extends PopupController<PopupMenuProps> {
    public getClassNames(): string {
        return "popup-menu";
    }

    public renderContent(): any {
        return <IconButton name={"ellipsis-v"}
                           {...sizeProps(this.props)}
                           onClick={() => this.showPopup()}
        />;
    }

    public renderPopup(): any {
        const items = this.props.menuItems().map((itemProps, i) => <MenuItem key={i} {...itemProps}/>);
        return <Menu>{items}</Menu>;
    }
}
