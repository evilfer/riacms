import {BaseWidgetStore} from "./base-widget-store";
import DocumentEventsComponent from "./document-events-component";

export interface BaseWidgetProps {
    id?: string;
}

export abstract class BaseWidget<E, P extends BaseWidgetProps> extends DocumentEventsComponent<P> {

    private hasDynamicId: boolean;
    private widgetId: string;

    public componentWillMount() {
        super.componentWillMount();

        if (typeof this.props.id === "string") {
            this.hasDynamicId = false;
            this.widgetId = this.props.id;
        } else {
            this.hasDynamicId = true;
            this.widgetId = this.getStore().getDynamicId();
        }
    }

    public componentWillUnmount() {
        super.componentWillUnmount();

        if (this.hasDynamicId) {
            this.getStore().unmount(this.widgetId);
        }
    }

    protected getData(): E | null {
        return this.getStore().getData(this.widgetId);
    }

    protected setData(data: E | null) {
        return this.getStore().setData(this.widgetId, data);
    }

    protected abstract getStore(): BaseWidgetStore<E>;
}
