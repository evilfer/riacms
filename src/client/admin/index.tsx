import {DatePicker} from "antd";

import {observer} from "mobx-react";
import * as React from "react";
import {Ac} from "./c/a";

const a = () => {
    alert("!");
};

@observer
class Ko extends React.Component {
    public render() {
        return (
            <div>
                <p>Hello world</p>
                <Ac/>
                <DatePicker/>
            </div>
        );
    }
}

new Ko().render();
