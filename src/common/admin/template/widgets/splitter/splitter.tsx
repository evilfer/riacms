import * as classNames from "classnames";
import {inject, observer} from "mobx-react";
import * as React from "react";
import {BaseWidget, BaseWidgetProps} from "../base-widget/base-widget";
import {BaseWidgetStore} from "../base-widget/base-widget-store";
import {registerWidgetStore} from "../widget-stores";

export interface SplitterStoreData {
    position: number | null;
    moving: boolean;
}

registerWidgetStore("splitters", () => new BaseWidgetStore<SplitterStoreData>());

export interface SplitterProps extends BaseWidgetProps {
    splitters?: BaseWidgetStore<SplitterStoreData>;
    horizontal?: boolean;
    vertical?: boolean;
    bottom?: boolean;
    top?: boolean;
    right?: boolean;
    left?: boolean;
}

@inject("splitters")
@observer
export default class Splitter extends BaseWidget<SplitterStoreData, SplitterProps> {
    private container: any;

    public render() {
        const {children, vertical, top, left} = this.props;
        const childrenArray = React.Children.toArray(children);

        if (childrenArray.length !== 2) {
            throw new Error("splitter requires 2 children");
        }

        const className = classNames("splitter", {
            "splitter--bottom": vertical && !top,
            "splitter--left": !vertical && left,
            "splitter--right": !vertical && !left,
            "splitter--top": vertical && top,
        });

        const data = this.getData();
        const hasPosition = data && data.position !== null;
        const positionKey = vertical ? "height" : "width";
        const secondaryPanelStyle = hasPosition ? {
            [positionKey]: `${data!.position}px`,
        } : undefined;
        const firstIsMain = (vertical && top) || (!vertical && left);
        const firstPanelStyle = firstIsMain ? undefined : secondaryPanelStyle;
        const secondPanelStyle = firstIsMain ? secondaryPanelStyle : undefined;

        const handleStyle = data && data.moving ? {
            background: "red",
        } : undefined;

        return (
            <div className={className} ref={element => this.container = element}>
                <div className="splitter__pane"
                     style={firstPanelStyle}>
                    {childrenArray[0]}
                </div>
                <div className="splitter__handle"
                     style={handleStyle}
                     onMouseDown={() => this.setMoving(true)}/>
                <div className="splitter__pane"
                     style={secondPanelStyle}>
                    {childrenArray[1]}
                </div>
            </div>
        );
    }

    protected setMoving(moving: boolean) {
        const data = this.getData();
        this.setData({moving, position: data ? data.position : null});
        if (moving) {
            this.registerListener("mouseup", () => this.setMoving(false));
            this.registerListener("mousemove", (evt: any) => {
                evt.preventDefault();
                this.move(evt);
            });
        } else {
            this.unregisterListeners("mouseup", "mousemove");
        }
    }

    protected move(evt: any) {
        const position = this.props.vertical ?
            evt.clientY - this.container.clientTop :
            evt.clientX - this.container.clientLeft;

        const data = this.getData();
        this.setData({moving: data && data.moving || false, position});
    }

    protected getStore(): BaseWidgetStore<SplitterStoreData> {
        return this.props.splitters!;
    }
}
