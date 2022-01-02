import React , {useState, useEffect} from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import userCSS from './user.module.css';
import { addMonths } from 'date-fns';
import NavBar from '../navbar/navbar';
import {useNavigate} from 'react-router-dom';
const User = (props) => {
    const navigate = useNavigate();
    const formInputControl = [
        {
            label: 'New Password',
            id: "password",
            formikKey: 'password',
            inputType: "password",
            placeholder: 'Please Enter New Password'
        },
    ]
    useEffect(() => {
        if (props.loggedInUser == null) {
            navigate('/login');
        }
    }, [props.loggedInUser]);
    const [isChangePWD, setIsChangePWD] = useState(false);
    console.log(props, 'props')
    const logout = () => {
        try {
            document.cookie = `logged_in_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
            props.setIsLoggedInUSer(null);
            props.setIsLoggedIn(false);
            navigate('/login');
        } catch (error) {
            console.log(error, 'error');
        }
    }
    const logoutBtn = (<button className='btn-danger btn mt-3' onClick={logout}>Logout</button>);
    return (
        <>
            {
                props.loggedInUser != null ? 
                <>
                    <NavBar/>
                    <Container className="mt-5">
                        <h3 className='m-3 text-start mb-5'>User Details</h3>
                        <Row className="mr-3 mb-3">
                            <Col md={2}>
                                Username
                            </Col>
                            <Col md={3}>
                                <input type="text" value={props.loggedInUser.email} disabled className="form-control" />
                            </Col>
                        </Row>
                        {
                            !isChangePWD ? 
                                <Row className="mt-3 mb-3">
                                    <Col md={2}>Password
                                    </Col>
                                    <Col md={3}>
                                        <input type="password" value={props.loggedInUser.decryptedPassword} disabled className="form-control" />
                                    </Col>
                                </Row> : 
                                <Formik
                                    initialValues={{
                                        password: '',
                                    }}
                                    validationSchema={
                                        Yup.object().shape({
                                            password: Yup.string()
                                                .min(8, 'Too Short!')
                                                .max(15, 'Too Long!')
                                                .required('Password is required'),                    
                                        })
                                    }
                                    onSubmit={values => {
                                        try {
                                            let updatedUserDetails = props.loggedInUser;
                                            let encrypted = props.encryptPassword(values.password)
                                            updatedUserDetails.password = encrypted.password;
                                            updatedUserDetails.cp = encrypted.cp;

                                            let registeredUserList = JSON.parse(localStorage.getItem('registeredUserList'));
                                            let userIndex = registeredUserList.findIndex((u) => u.email === updatedUserDetails.email);
                                            registeredUserList[userIndex] = updatedUserDetails;
                                            localStorage.setItem('registeredUserList', JSON.stringify(registeredUserList));
                                            document.cookie = `logged_in_user=${JSON.stringify(updatedUserDetails)}; expires=${addMonths(new Date(), 1)}; path=/`;
                                        } catch (error) {
                                            console.log("error==>",error);
                                        }
                                    }}
                                >
                                {({ errors, touched }) => (
                                    <Form>
                                        {
                                            formInputControl.map((input, index) => {
                                                return (
                                                    <Row key={index} className="mt-4 mb-3">
                                                        <Col md={2}>{input.label}</Col>
                                                        <Col md={3}>
                                                            <Field name={input.formikKey} className="form-control" placeholder={input.placeholder} id={input.id} type={input.inputType} />
                                                            
                                                        </Col>
                                                        <Row>
                                                            <Col md={2}></Col>
                                                            <Col md={3}>{errors[input.formikKey] && touched[input.formikKey] ? (
                                                                <p className={["text-start","m-2", userCSS.errormsg].join(" ")}>{errors[input.formikKey]}</p>
                                                            ) : null}</Col>
                                                        </Row>
                                                    </Row>
                                                )
                                            })
                                        }
                                        {isChangePWD ?  <Row>
                                            <Col md={2}>
                                                <button type="submit" className='btn-success btn mt-3'>Save Password</button>
                                            </Col>
                                            <Col md={1}>
                                                {logoutBtn}
                                            </Col>
                                        </Row> :null}
                                    </Form>
                                )}
                            </Formik>
                        }
                        
                    {!isChangePWD ? 
                            <Row> 
                                <Col md={2}>
                                    <button className='btn-warning btn mt-3 text-white' onClick={() => setIsChangePWD(true)}>Change Password</button>
                                </Col>
                                <Col md={1}>
                                    {logoutBtn} 
                                </Col> 
                        </Row>: null
                        }
                    
                    </Container>
                </> : null
            }
            
        </>
    )
}
export default User;