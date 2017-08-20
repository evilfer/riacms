import * as React from "react";
import {Helmet} from "react-helmet";

const ASSET_PATH = "/_assets/admin";

export function AdminHead() {
    return (
        <Helmet>
            <title>admin</title>
            <link rel="icon" href={`${ASSET_PATH}/img/favicon.ico`} type="image/x-icon"/>
            <link rel="stylesheet" type="text/css" href={`${ASSET_PATH}/index.css`}/>
        </Helmet>
    );
}
