import React from "react"
import {Navbar} from "./Navbar";
import {Outlet} from "react-router-dom";

export const NavbarContainer = () => {

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <Navbar />
            <Outlet />
        </div>
    )
}