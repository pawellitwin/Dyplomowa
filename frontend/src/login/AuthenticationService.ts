import axios from "axios";
import {AppSettings} from "../AppSettings";

interface LoginCredentials {
    username: string,
    password: string
}
export class AuthenticationService {

    static register = async (credentials: LoginCredentials) => {
        try {
            const response = await axios.post(AppSettings.HOST + '/register', credentials, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 201) {
                return true;
            } else {

                return false;
            }
        } catch (error) {
            console.error('Error during login:', error);
            return null;
        }
    }

    static login = async (credentials: LoginCredentials) => {
        try {
            const response = await axios.post(AppSettings.HOST + '/login', credentials, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.data.access_token) {
                console.log('Login successful, token:', response.data.access_token);
                return response.data.access_token;
            } else {
                console.log('Login failed');
                return null;
            }
        } catch (error) {
            console.error('Error during login:', error);
            return null;
        }
    }
}