import {ClientDataError} from "./client-data-error";

export type ClientErrorReporter = () => null | ClientDataError | ClientDataError[];

export class ClientErrorManager {

    private reporters: ClientErrorReporter[];

    constructor() {
        this.reporters = [];
    }

    public registerErrorReporter(reporter: ClientErrorReporter) {
        this.reporters.push(reporter);
    }

    public unregisterErrorReporter(reporter: ClientErrorReporter) {
        const index = this.reporters.indexOf(reporter);
        if (index >= 0) {
            this.reporters.splice(index, 1);
        }
    }

    public getErrorsAndReset(): ClientDataError[] {
        const errors: ClientDataError[] = [];

        this.reporters.forEach(reporter => {
            const reporterErrors = reporter();
            if (reporterErrors !== null) {
                if (reporterErrors.constructor === Array) {
                    (reporterErrors as ClientDataError[]).forEach(e => errors.push(e));
                } else {
                    errors.push(reporterErrors as ClientDataError);
                }
            }
        });

        return errors;
    }
}
