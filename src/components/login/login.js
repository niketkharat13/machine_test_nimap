import React , {useState} from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LogInCSS from './login.module.css';
const bcrypt = require('bcryptjs');
const LogIn = () => {
    const [isWrongPassword, setIsWrongPassword] = useState(false);
    const [isNot_A_User, setIsNot_A_User] = useState(false);
    const formInputControl = [
        {
            label: 'Email',
            id: "email",
            formikKey: 'email',
            inputType: "text",
            placeholder: 'Please Enter Email'
        },
        {
            label: 'Password',
            id: "password",
            formikKey: 'password',
            inputType: "password",
            placeholder: 'Please Enter Password'
        },
    ]
    return (
        <>
            <div className="mt-5">
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                    }}
                    validationSchema={
                        Yup.object().shape({
                            email: Yup.string().email('Invalid email').required('Please Enter Email Id'),
                            password: Yup.string()
                                .min(8, 'Too Short!')
                                .max(15, 'Too Long!')
                                .required('Password is required'),                      
                        })
                    }
                    onSubmit={values => {
                        try {
                            let registeredUserList = localStorage.getItem('registeredUserList');
                            if (registeredUserList !== null) {
                                registeredUserList = JSON.parse(registeredUserList);
                                let userDetails = registeredUserList.filter(u => u.email === values.email);
                                if (userDetails.length > 0) {
                                    let doesPasswordMatch = bcrypt.compareSync(values.password, bcrypt.hashSync(userDetails.password, bcrypt.genSaltSync()));
                                    if (doesPasswordMatch) {
                                        console.log("password match")
                                    } else {
                                        setIsWrongPassword(true);
                                    }
                                } else {
                                    setIsNot_A_User(true);
                                }
                            }
                        } catch (error) {
                            console.log(error)
                        }
                    }}
                >
                {({ errors, touched }) => (
                    <Form>
                        <Container className="mt-5">
                            <h1 className="mt-2 mb-5">Login</h1>
                            {
                                formInputControl.map((input, index) => {
                                    return (
                                        <Row key={index} className="mt-4">
                                            <Col md={4}>
                                                <label htmlFor={input.id} className="w-100 h-100 d-flex align-items-center justify-content-end">{input.label}</label>
                                            </Col>
                                            <Col md={4}>
                                                <Field name={input.formikKey} className="form-control" placeholder={input.placeholder} id={input.id} type={input.inputType} />
                                                
                                            </Col>
                                            <Row>
                                                <Col md={4}></Col>
                                                <Col md={4}>{errors[input.formikKey] && touched[input.formikKey] ? (
                                                    <p className={["text-start","m-2", LogInCSS.errormsg].join(" ")}>{errors[input.formikKey]}</p>
                                                ) : null}</Col>
                                            </Row>
                                        </Row>
                                    )
                                })
                            }
                            {
                                isWrongPassword ? 'password wrong' : isNot_A_User ? 'not a user' : ""
                            }
                            <button type="submit" className='btn-primary btn mt-3'>Login</button>
                            <button className='btn-secondary btn mt-3'>Sign Up</button>
                        </Container>
                    </Form>
                )}
                </Formik>
            </div>
        </>
    )
}
export default LogIn;