import React, {useEffect, useState} from "react"
import {Movie} from "./Movie";
import {MovieService} from "./MovieService";

export const FavoritesPage = () => {
    const [favorites, setFavorites] = useState<Movie[]>([]);

    const fetchFavoriteMovieList = async () => {
        const favorites = await MovieService.getFavoritesMovieList();
        if (favorites) {
            setFavorites(favorites);
        }
    };

    useEffect(() => {
        fetchFavoriteMovieList()
    }, []);

    return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

            <h2 style={{ marginBottom: "1.5rem" }}>Your favorite movies</h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "1.5rem",
                    width: "100%",
                    padding: "0 1rem",
                    boxSizing: "border-box",
                    marginBottom: "2rem",
                }}
            >
                {favorites.map((movie) => (
                    <div
                        key={movie.id}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            border: "1px solid #ddd",
                            borderRadius: "12px",
                            padding: "1.5rem",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            backgroundColor: "#fff",
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)";
                            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
                        }}
                    >
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            style={{
                                width: "80%",
                                height: "auto",
                                borderRadius: "8px",
                                marginBottom: "1rem",
                            }}
                        />
                        <h3 style={{ fontSize: "1.2rem", textAlign: "center" }}>{movie.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};