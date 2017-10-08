import {inject, observer} from "mobx-react";
import * as React from "react";
import {BaseWidget, BaseWidgetProps} from "../base-widget/base-widget";
import {BaseWidgetStore} from "../base-widget/base-widget-store";
import {registerWidgetStore} from "../widget-stores";

export interface PopupStoreData {
    shown: boolean;
}

registerWidgetStore("popups", () => new BaseWidgetStore<PopupStoreData>());

export interface PopupControllerProps extends BaseWidgetProps {
    popups?: BaseWidgetStore<PopupStoreData>;
}

@inject<PopupControllerProps>("popups")
@observer
export class PopupController extends BaseWidget<PopupStoreData, PopupControllerProps> {
    public render() {
        const content = this.renderContent();
        const popup = this.isShown() && this.renderPopup();

        return <div className={this.getClassNames()}>{content}{popup}</div>;
    }

    protected getClassNames(): string | undefined {
        return undefined;
    }

    protected renderContent(): any {
        return null;
    }

    protected renderPopup(): any {
        return null;
    }

    protected getStore(): BaseWidgetStore<PopupStoreData> {
        return this.props.popups!;
    }

    protected showPopup() {
        this.setData({shown: true});
        this.registerListener("click", () => this.hidePopup());
    }

    protected hidePopup() {
        this.setData({shown: false});
        this.unregisterListeners("click");
    }

    private isShown() {
        return this.getData() && this.getData()!.shown;
    }
}
