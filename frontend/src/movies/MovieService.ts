import axios from "axios";
import {AppSettings} from "../AppSettings";

export class MovieService {

    static getMovies = async () => {
        try {
            const response = await axios.get(AppSettings.HOST + '/movies', {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            return response.data
        } catch (error) {
            console.error('Error during login:', error);
            return null;
        }
    }

    static getRecommendations = async (movie: string) => {
        try {
            const response = await axios.get(AppSettings.HOST + '/recommendations', {
                params: { movie },
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            return null;
        }
    }

    static getFavorites = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error('No token found');
                return null;
            }

            const response = await axios.get(AppSettings.HOST + '/favorites', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            return response.data.favorite_movies || null;
        } catch (error) {
            console.error('Error fetching favorites:', error);
            return null;
        }
    }

    static getFavoritesMovieList = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error('No token found');
                return null;
            }

            const response = await axios.get(AppSettings.HOST + '/favorite_movies', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            return response.data.favorite_movies || null;
        } catch (error) {
            console.error('Error fetching favorites:', error);
            return null;
        }
    }

    static addFavorite = async (movieId: number) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error('No token found');
                return null;
            }

            console.log(token)
            const response = await axios.post(
                `${AppSettings.HOST}/favorites?movie_id=${movieId}`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data.favorite_movies || null;
        } catch (error) {
            console.error('Error fetching favorites:', error);
            return null;
        }
    }
}