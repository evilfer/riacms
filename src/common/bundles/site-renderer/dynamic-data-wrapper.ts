import {inject} from "mobx-react";
import {RenderingContextStore} from "../rendering-context/rendering-context-store";
import {DynamicDataModeStore, DynamicDataUUID} from "./dynamic-data";

export interface DynamicDataModeProps {
    renderingContext?: RenderingContextStore;
    dynamicData?: DynamicDataModeStore;
}

export function dynamicDataMode<T extends {
    new(...args: any[]): React.Component<DynamicDataModeProps>;
}>(constructor: T) {

    let dduuid: DynamicDataUUID = 0;
    let ddv: number = 0;

    return inject("renderingContext", "dynamicData")(class BrowserOnlyMode extends constructor {

        public componentWillMount() {
            const {renderingContext, dynamicData} = this.props;
            if (renderingContext!.context === "client") {
                dduuid = dynamicData!.generateUUID();
            }
        }

        public componentWillReceiveProps(props: DynamicDataModeProps) {
            ddv = props.dynamicData!.getBlockDataVersion(dduuid);
        }

        public render() {
            const {renderingContext, dynamicData} = this.props;

            if (renderingContext!.context === "server") {
                return null;
            }

            dynamicData!.enterDynamicBlock(dduuid);
            const output = super.render();
            dynamicData!.exitDynamicBlock();
            return output;
        }
    });
}
