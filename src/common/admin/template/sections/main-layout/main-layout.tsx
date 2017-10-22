import * as React from "react";
import {MainHeader} from "./main-header";

export interface MainLayoutProps {
    children: any;
}

export function MainLayout({children}: MainLayoutProps) {
    return (
        <div className="main-layout">
            <MainHeader/>
            {children}
            <div>status</div>
        </div>
    );
}
