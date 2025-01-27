import React from "react"
import {Menubar} from "primereact/menubar";
import {useNavigate} from "react-router-dom";

export const Navbar = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/')
    }

    const items = [
        {
            label: 'Logout',
            command: () => {
                logout();
            }
        },
        {
            label: 'Favorites',
            command: () => {
                navigate('/fav');;
            }
        },
        {
            label: 'Recommendations',
            command: () => {
                navigate('/movies');
            }
        }
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <Menubar model={items} />
        </div>
    );
};