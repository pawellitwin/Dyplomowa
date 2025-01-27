import React from "react";
import {Route, Routes} from "react-router-dom";
import {LoginPage} from "./login/LoginPage";
import {RegisterPage} from "./login/RegisterPage";
import {MoviesPage} from "./movies/MoviesPage";
import {NavbarContainer} from "./NavbarContainer";
import {FavoritesPage} from "./movies/FavoritesPage";

export const AppRouter = () => {

    return (
        <Routes>
            <Route path="/" element={<LoginPage />}></Route>
            <Route path="/register" element={<RegisterPage />}></Route>

            <Route element={<NavbarContainer />}>

                <Route path="/movies" element={<MoviesPage />}></Route>
                <Route path="/fav" element={<FavoritesPage />}></Route>

            </Route>
        </Routes>
    )
}