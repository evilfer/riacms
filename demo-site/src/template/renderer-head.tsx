import * as React from "react";
import {Helmet} from "react-helmet";

export function TemplateHead() {
    return (
        <Helmet>
            <title>demo site</title>
            <link rel="icon" href="/_assets/img/favicon.ico" type="image/x-icon"/>
            <link rel="stylesheet" type="text/css" href="/_assets/css/theme.css"/>
        </Helmet>
    );
}
