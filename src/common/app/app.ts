import {Bundle} from "../bundles/bundle";
import {TypeManager} from "../types/type-manager";
import {TypeManagerBuilder} from "../types/type-manager-builder";

export class CmsApp<E extends Bundle> {
    protected bundles: E[];
    protected types: TypeManager;

    public constructor(bundles: E[]) {
        this.bundles = bundles;

        this.prepareTypes();
    }

    private prepareTypes() {
        const builder = new TypeManagerBuilder();
        this.bundles.forEach(bundle => bundle.applyTypes(builder));
        this.types = builder.build();
    }
}
