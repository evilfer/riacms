import {Template} from "../../bundles/site-renderer/template";
import {AdminMain} from "./admin-main";
import {initStores} from "./widgets/widget-stores";

export const adminTemplate: Template = {
    component: AdminMain,
    options: {
        jsScripts: [
            "/admin/libs.js",
            "/admin/admin-index.js",
        ],
    },
    stores: ["location", "entityFinder", "resolvedPage"],
    uiStores: initStores,
};
