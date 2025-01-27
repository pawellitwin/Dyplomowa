import React, {useEffect, useState} from "react"
import {MovieService} from "./MovieService";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";
import {Movie} from "./Movie";

export const MoviesPage = () => {
    const [titles, setTitles] = useState<string[]>([]);
    const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
    const [recommendations, setRecommendations] = useState<Movie[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);

    const addFavorite = async (movieId: number) => {
        const updatedFavorites = await MovieService.addFavorite(movieId);
        if (updatedFavorites) {
            setFavorites(updatedFavorites);
        }
    };

    const fetchFavorites = async () => {
        const favorites = await MovieService.getFavorites();
        if (favorites) {
            setFavorites(favorites);
        }
    };

    const fetchMovies = async () => {
        const movieList = await MovieService.getMovies();
        if (movieList) {
            setTitles(movieList);
        }
    };

    const fetchRecommendations = async () => {
        if (selectedTitle) {
            const recommendations = await MovieService.getRecommendations(selectedTitle);
            if (recommendations) {
                console.log(recommendations)
                setRecommendations(recommendations);
            }
        }
    };

    useEffect(() => {
        fetchMovies();
        fetchFavorites();
    }, []);

    useEffect(() => {
      fetchRecommendations()
    }, [favorites]);


    const handleChange = (e: any) => {
        setSelectedTitle(e.value);
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
            }}
        >
            <h2 style={{ marginBottom: "1rem" }}>Select a Movie</h2>
            <Dropdown
                value={selectedTitle}
                options={titles}
                onChange={handleChange}
                placeholder="Select a movie"
                style={{ width: "300px", marginBottom: "1rem" }}
            />
            <Button label="Show Recommendations" onClick={fetchRecommendations} />
            {selectedTitle && recommendations.length > 0 && <p style={{ marginTop: "1rem" }}>Movies like: {selectedTitle}</p>}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "1.5rem",
                    marginTop: "2rem",
                    width: "100%",
                    maxWidth: "1200px",
                }}
            >
                {recommendations.map((movie) => (
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
                            backgroundColor: favorites.includes(movie.id.toString()) ? "#d4edda" : "#fff",
                            cursor: "pointer",
                        }}
                        onClick={() => addFavorite(movie.id)}
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
