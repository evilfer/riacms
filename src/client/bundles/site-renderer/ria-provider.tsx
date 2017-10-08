import {autorunAsync} from "mobx";
import {Provider} from "mobx-react";
import * as React from "react";
import {LocationStore} from "../../../common/bundles/location/location-data";
import {ClientContext} from "../../app/client-context";
import {dataLoader} from "./data-loader";

export interface RiaProviderProps {
    context: ClientContext;
    stores: {
        location: LocationStore;
        [name: string]: any;
    };
}

export class RiaProvider extends React.Component<RiaProviderProps> {
    public componentDidMount() {
        autorunAsync(dataLoader(this.props.stores.location, this.props.context));
    }

    public render() {
        return (
            <Provider {...this.props.stores}>
                {this.props.children}
            </Provider>
        );
    }
}
