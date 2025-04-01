import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react'; 
import { useMutation } from '@apollo/client';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { LOGIN_USER } from '../../shared/gql/authentication.gql';

const LoginComponent = () => {
    const navigate = useNavigate();
    
    //#region States
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [ token, setToken ] = useState(sessionStorage.getItem("token") || 'auth');
    //#endregion

    //#region GQL
    const [ loginUser ] = useMutation(LOGIN_USER)
    //#endregion

    /**
     * TODO: Missing error message display.
     */
    const authenticateUser = async () => {
        try {
            const res = await loginUser({ variables: { username, password } }); 
            sessionStorage.setItem("token", res?.data?.loginUser[0]);
            sessionStorage.setItem("uid", res?.data?.loginUser[1]);
            sessionStorage.setItem("username", res?.data?.loginUser[2]);
            sessionStorage.setItem("type", res?.data.loginUser[3]);
            setToken(sessionStorage.getItem("token"));
            navigate("/dashboard")
            window.postMessage({ type: 'LOGIN_IN' }, '*');
        } catch(error) {
            console.error(`An error occurred while authenticating the user: `, error);
            throw error;
        }
    }    

    useEffect(() => {
        window.addEventListener('message', (event) => {
            if (event.data.type === 'SESSION_CLEARED') {            
              setToken(sessionStorage.getItem("token"));
            }
          });
     }, [])

    return (
        <> {
            token === "auth" && 
            <>
            <div className='text-center' style={{position: "relative", zIndex: 0}}>
            <h2 className='justify-content-center text-center pt-4'>Login</h2>
                    <div>
                        <Form className='pt-4 mt-2 mb-2 mr-2 ml-2 rounded d-flex flex-column align-items-center' style={{zIndex: 1 }}>
                            <Form.Group size="lg">
                                <Form.Label>Username</Form.Label>
                                <Form.Control 
                                    className='w-100'
                                    type="text"
                                    name="username"
                                    id="username"
                                    placeholder="Username"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group size="lg">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                    className='w-100'
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </Form.Group>
                            <Button className="login-button mt-4 mb-4" size="lg" variant="primary" type="Button" onClick={authenticateUser}>
                                Login
                            </Button>
                        </Form>
                    </div>
            </div>
            </>
        }        
        </>
    )

}

export default LoginComponent;