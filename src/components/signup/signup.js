import React , {useState,useEffect} from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import signupCSS from './signup.module.css';
import {Link, useNavigate} from 'react-router-dom';
const SignUp = (props) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (props.loggedInUser != null) {
            navigate('/');
        }
    }, [props.loggedInUser]);
    const [userExisted, setIsUserExisted] = useState(false);
    const [isUserCreated, setIsUserCreated] = useState(false);
    const formInputControl = [
        {
            label: 'First Name',
            id: "fName",
            formikKey: 'firstName',
            inputType: "text",
            placeholder: 'Please Enter First Name'
        },
        {
            label: 'Last Name',
            id: "lName",
            formikKey: 'lastName',
            inputType: "text",
            placeholder: 'Please Enter Last Name'
        },
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
        {
            label: 'Confirm Password',
            id: "cPassword",
            formikKey: 'confirmPassword',
            inputType: "password",
            placeholder: 'Please Re-Enter Password'
        },
    ]
    return (
        <>
            <div className="mt-5">
                
                <Formik
                    initialValues={{
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        confirmPassword: ''
                    }}
                    validationSchema={
                        Yup.object().shape({
                            firstName: Yup.string()
                                .min(2, 'Too Short!')
                                .max(50, 'Too Long!')
                                .matches(/^[aA-zZ]+$/, "please enter valid first name")
                                .required('Please enter First Name'),
                            lastName: Yup.string()
                                .min(2, 'Too Short!')
                                .max(50, 'Too Long!')
                                .matches(/^[aA-zZ]+$/, "please enter valid last name")
                                .required('Please enter Last Name'),
                            email: Yup.string().email('Invalid email').required('Please Enter Email Id'),
                            password: Yup.string()
                                .min(8, 'Too Short!')
                                .max(15, 'Too Long!')
                                .required('Password is required'),
                            confirmPassword: Yup.string().required('Please Enter Confirm Password')
                               .oneOf([Yup.ref('password'), null], 'Passwords must match')                          
                        })
                    }
                    onSubmit={values => {
                        // console.log(values, 'values')
                        // same shape as initial values
                        try {
                            let registeredUserList = localStorage.getItem('registeredUserList');
                            // console.log(!registeredUserList, 'registeredUserList');
                            let usersValue = [];
                            if (registeredUserList !== null) {
                                // console.log("inside")
                                usersValue = JSON.parse(registeredUserList);
                                // console.log(usersValue, 'usersValue');
                                let isUserExisted = usersValue.filter(u => u.email === values.email);
                                if (isUserExisted.length > 0) {
                                    setIsUserExisted(true);
                                    setTimeout(() => {
                                        setIsUserExisted(false);
                                    }, 5000);
                                    return;
                                }
                            }
                            const {confirmPassword, ...userValues} = values;
                            let encrypted = props.encryptPassword(values.password);
                            usersValue.push({
                                id: usersValue.length + 1,
                                ...userValues,
                                password:  encrypted.password,
                                cp: encrypted.cp
                            })
                            localStorage.setItem('registeredUserList', JSON.stringify(usersValue))
                            setIsUserCreated(true);
                            setTimeout(() => {
                                setIsUserCreated(false);
                                navigate('/login');
                            }, 5000);
                        } catch (error) {
                            console.log(error)
                        }
                    }}
                >
                {({ errors, touched }) => (
                    <Form>
                        <Container className="mt-5">
                            <h1 className="mt-2 mb-5">User Registeration Form</h1>
                            {
                                formInputControl.map((input, index) => {
                                    return (
                                        <Row key={index} className="mt-3">
                                            <Col md={2}>
                                                <label htmlFor={input.id} className="w-100 h-100 d-flex align-items-center">{input.label}</label>
                                            </Col>
                                            <Col md={4}>
                                                <Field name={input.formikKey} className="form-control" placeholder={input.placeholder} id={input.id} type={input.inputType} />
                                            </Col>
                                            <Row className="test">
                                                <Col md={2}></Col>
                                                <Col md={4}>{errors[input.formikKey] && touched[input.formikKey] ? (
                                                    <p className={["text-start","m-2", signupCSS.errormsg].join(" ")}>{errors[input.formikKey]}</p>
                                                ) : null}</Col>
                                            </Row>
                                        </Row>
                                    )
                                })
                            }
                            <Row>
                                <Col md={2}></Col>
                                <Col md={4}>
                                    {
                                        userExisted ?  <p className={["m-2", signupCSS.errormsg].join(" ")}>Email ID is Already Existed</p> : null
                                    }
                                    {
                                        isUserCreated ? <p className={["m-2", "text-success"].join(' ')}>
                                            User Successfully Created !!
                                        </p> : null
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col md={2}></Col>
                                <Col md={4}>
                                    <div className='mt-3'>
                                        <button type="submit" className='btn-success btn mt-3 m-3'>Signup</button>
                                        <Link to="/login" className={[signupCSS.loginLink, 'btn-warning btn' ,'mt-3' ,'m-3'].join(' ')}>Login</Link>
                                    </div>
                                </Col>
                            </Row>
                            
                        </Container>
                    </Form>
                )}
                </Formik>
            </div>
        </>
    )
}
export default SignUp;