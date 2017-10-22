import * as React from "react";

const IS_BROWSER = typeof document !== "undefined";

export default abstract class DocumentEventsComponent<E> extends React.Component<E> {
    private listeners: {
        [event: string]: any[],
    } = {};

    private mounted: boolean = false;

    public componentWillMount() {
        if (IS_BROWSER) {
            this.mounted = true;
            Object.keys(this.listeners).forEach(event =>
                this.listeners[event].forEach(listener =>
                    document.addEventListener(event, listener, false)));
        }
    }

    public componentWillUnmount() {
        if (IS_BROWSER) {
            Object.keys(this.listeners).forEach(event =>
                this.listeners[event].forEach(listener =>
                    document.removeEventListener(event, listener, false)));
        }
    }

    protected unregisterListeners(...events: string[]) {
        if (IS_BROWSER) {
            events.forEach(event => {
                if (this.listeners[event]) {
                    this.listeners[event].forEach(listener => document.removeEventListener(event, listener, false));
                    this.listeners[event] = [];
                }
            });
        }
    }

    protected unregisterListener(event: string, listener: any) {
        if (IS_BROWSER) {
            if (this.listeners[event]) {
                const index = this.listeners[event].indexOf(listener);
                if (index >= 0) {
                    this.listeners[event].splice(index, 1);
                    document.removeEventListener(event, listener, false);
                }
            }
        }
    }

    protected registerListener(event: string, listener: any) {
        if (IS_BROWSER) {
            if (!this.listeners[event]) {
                this.listeners[event] = [];
            }

            this.listeners[event].push(listener);
            if (this.mounted) {
                document.addEventListener(event, listener, false);
            }
        }
    }
}
