import axios from "axios";
import {LocationStore} from "../../../common/bundles/location/location-data";
import {map2query} from "../../../common/utils/object-to-query";
import {ClientContext} from "../../app/client-context";
import {runInAction} from "mobx";

export function dataLoader(location: LocationStore, context: ClientContext): () => void {
    return () => {
        const url = `/_api/render${location.path}${map2query(location.query)}`;
        const errors = context.errors.getErrorsAndReset();
        console.log("autorun", url, errors);

        if (errors.length > 0) {
            axios.get(url)
                .then(response => {
                    runInAction(() => {
                        context.cache.loadEntities(response.data.e);
                        context.bundles.loadStoreData(response.data.s);
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };
}
