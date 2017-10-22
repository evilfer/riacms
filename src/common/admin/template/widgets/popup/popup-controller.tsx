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

export abstract class PopupController<E extends PopupControllerProps> extends BaseWidget<PopupStoreData, E> {
    public render() {
        const content = this.renderContent();
        const popup = this.isShown() && this.renderPopup();

        return <div className={this.getClassNames()}>{content}{popup}</div>;
    }

    public abstract getClassNames(): string | undefined;

    public abstract renderContent(): any;

    protected abstract renderPopup(): any;

    protected getStore(): BaseWidgetStore<PopupStoreData> {
        return this.props.popups! as BaseWidgetStore<PopupStoreData>;
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
