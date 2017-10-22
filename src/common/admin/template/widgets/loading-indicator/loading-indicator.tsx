import * as React from "react";
import {Icon} from "../icon/icon";

export interface LoadingIndicatorProps {
    loading: boolean;
}

export class LoadingIndicator extends React.Component<LoadingIndicatorProps> {
    public render() {
        return this.props.loading && <Icon name="circle-o-notch" spin/>;
    }
}
