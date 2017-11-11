import {inject, observer} from "mobx-react";
import * as React from "react";
import {LocationStore} from "../../../../bundles/location/location-data";

export interface QueryNavWrapperProps {
    param: string;
    content: { [value: string]: () => JSX.Element };
    location?: LocationStore;
}

@inject("location")
@observer
export class QueryNavWrapper extends React.Component<QueryNavWrapperProps> {
    public render() {
        const {param, content, location} = this.props;
        const currentValue = location!.query.get(param) || "";
        const contentGen = content[currentValue] || content[""] || (() => null);
        return contentGen();
    }
}
