import {Template} from "../../bundles/site-renderer/template";
import {AdminMain} from "./admin-main";

export const adminTemplate: Template = {
    component: AdminMain,
    options: {
        jsScripts: [
            "/admin/libs.js",
            "/admin/admin-index.js",
        ],
    },
};
