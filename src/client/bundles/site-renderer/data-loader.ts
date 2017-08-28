import axios from "axios";
import {LocationStore} from "../../../common/bundles/location/location-data";
import {ClientContext} from "../../app/client-context";
import {map2query} from "../../../common/utils/object-to-query";

export function dataLoader(location: LocationStore, context: ClientContext): () => void {
    return () => {
        const url = `/_api/render${location.path}${map2query(location.query)}`;
        const errors = context.errors.getErrorsAndReset();
        console.log("autorun", url, errors.length);

        if (errors.length > 0) {
            axios.get(`/_api/render${url}`)
                .then(response => {
                    context.cache.loadEntities(response.data.e);
                    context.bundles.loadStoreData(response.data.s);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };
}
