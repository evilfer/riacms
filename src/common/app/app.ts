import {Bundle} from "../bundles/bundle";
import {TypeManager} from "../types/type-manager";
import {TypeManagerBuilder} from "../types/type-manager-builder";

export abstract class CmsApp<E extends TypeManagerBuilder, T extends Bundle<E>> {
    protected bundles: T[];
    protected types: TypeManager;

    public constructor(bundles: T[]) {
        this.bundles = bundles;
        this.initTypes();
    }

    public getTypes(): TypeManager {
        return this.types;
    }

    protected abstract prepareTypeBuilder(): E;

    private initTypes() {
        const builder = this.prepareTypeBuilder();
        this.bundles.forEach(bundle => bundle.applyTypes(builder));
        this.types = builder.build();
    }

}
