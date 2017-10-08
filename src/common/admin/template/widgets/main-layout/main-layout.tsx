import * as React from "react";

export interface MainLayoutProps {
    children: any;
}

export default function MainLayout({children}: MainLayoutProps) {
    return (
        <div className="main-layout">
            <div>header</div>
            {children}
            <div>status</div>
        </div>
    );
}
