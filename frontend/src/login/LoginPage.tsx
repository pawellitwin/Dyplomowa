import React, {useState} from "react"
import {InputText} from "primereact/inputtext";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {Password} from "primereact/password";
import "./login-page.css"
import {AuthenticationService} from "./AuthenticationService";
import {useNavigate} from "react-router-dom";
export const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleLogin = async () => {
        const loginData = {
            username: username,
            password: password
        };

        const token = await AuthenticationService.login(loginData);

        if (token) {
            localStorage.setItem("token", token)
            navigate('/movies')
        } else {
            console.log('Login failed');
        }
    };

    const handleRegister = () => {
        navigate('/register')
    }

    return (
        <div className="login-container">
            <Card title="Login" className="login-card">
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="username">Username</label>
                        <InputText
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="password">Password</label>
                        <Password
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            toggleMask
                            feedback={false}
                        />
                    </div>
                    <Button label="Login" onClick={handleLogin} />
                    <Button
                        className="register-button"
                        label="Register" onClick={handleRegister} />
                </div>
            </Card>
        </div>
    );
};