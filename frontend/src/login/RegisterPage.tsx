import React, {useState} from "react"
import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import {AuthenticationService} from "./AuthenticationService";
import {useNavigate} from "react-router-dom";

export const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        const loginData = {
            username: username,
            password: password
        };

        const isRegistered = await AuthenticationService.register(loginData);

        if (isRegistered) {
            navigate('/')

        } else {
            console.log('Login failed');
        }
    };

    return (
        <>
            <div className="login-container">
                <Card title="Creating account" className="login-card">
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
                            />
                        </div>
                        <Button label="Create" onClick={handleRegister}/>
                    </div>
                </Card>
            </div>
        </>
    )
}