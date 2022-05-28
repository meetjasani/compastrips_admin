import React, { useEffect, useState } from 'react'
import { Button, Container, Row, Col, Form } from 'react-bootstrap'
import "./Login.css"
import { ApiPost } from '../../helper/API/ApiData';
import Auth from '../../config/Auth';
import { useHistory } from 'react-router';


function Login() {

    const history = useHistory();


    const Errors = {
        emailFormat: '',
        emailError: '',
        passwordError: ''
    }
    const [limitError, setlimitError] = useState('');
    const [state, setState] = useState(Errors);

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isSubmited, setIsSubmited] = useState(false);

    const handleSubmit = () => {

        let Err = {
            emailFormat: '',
            emailError: '',
            passwordError: ''
        }

        let emailFormat = new RegExp('^(([^<>()\\[\\]\\\\.,;:\\s@]+(\\.[^<>()\\[\\]\\\\.,;:\\s@]+)*)|(.+))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');

        if (!email) {
            Err.emailError = '관리자 이메일 아이디를 입력해 주세요.'
        }

        if (!password) {
            Err.passwordError = '비밀번호를 입력해 주세요.'
        }

        if (email && !emailFormat.test(email)) {
            Err.emailFormat = '이메일 주소 형식에 맞게 입력해주세요.'
        }

        setState(Err);

        if (!Err.emailError && !Err.passwordError && !Err.emailFormat) {
            return true;
        }
        return false;
    }

    const [isDisabled, setIsDisabled] = useState(false)

    const Login = () => {
        setIsSubmited(true)
        setIsDisabled(true)
        if (!handleSubmit()) {
            setIsDisabled(false)
            return
        }
        ApiPost('admin/auth/login', {
            email: email,
            password: password
        }).then((res: any) => {
            Auth.setAuthToken(res.data.token)
            setIsDisabled(false)
            history.push("/");
        }).catch((err:any) =>{
            setIsDisabled(false)
            if(err){
                setlimitError(err);
            }            
        })
    }

    useEffect(() => {
        if (isSubmited) {
            handleSubmit();
        }

    }, [email, password])

    useEffect(()=> {
        if(Auth.isUserAuthenticated()){
            history.push("/")
        }
    },[]);

    return (

        <Container>
            <Row className="justify-content-center mt-5">
                <Col md={7}>
                    <div className="bg-white">
                        <div className="login-form">
                            <Form >
                                <h1 className="font-weight-bold title-color  text-center">관리자 로그인</h1>
                                <div className="mt-5">
                                    <input type="text" placeholder="관리자 이메일 아이디" className="custom-input form-control" onChange={(e) => setEmail(e.target.value)} />
                                    {state.emailError && <p className="error mb-16" > {state.emailError} </p>}
                                    {state.emailFormat && <div className="error mb-16" > {state.emailFormat} </div>}
                                    <input type="password" placeholder="비밀번호" className="custom-input form-control" onChange={(e) => setPassword(e.target.value)} />
                                    {state.passwordError && <p className="error mb-16"> {state.passwordError} </p>}

                                    <Button type="button" className="loginreg-btn" disabled={isDisabled} onClick={Login}>로그인</Button>
                                    
                                    {limitError && <p className="error mt-16"> {limitError} </p>}


                                </div>
                            </Form>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default Login
