import React , {useState} from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LogInCSS from './LogIn.module.css';
const bcrypt = require('bcryptjs');
const LogIn = () => {
    const [userExisted, setIsUserExisted] = useState(false);
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
                            console.log(!registeredUserList, 'registeredUserList');
                            let usersValue = [];
                            if (registeredUserList !== null) {
                                usersValue = JSON.parse(registeredUserList);
                                let isUserExisted = usersValue.filter(u => u.email === values.email);
                                if (isUserExisted.length > 0) {
                                    setIsUserExisted(true);
                                    return;
                                }
                            }
                            const {confirmPassword, ...userValues} = values;
                            usersValue.push({
                                ...userValues,
                                password: bcrypt.hashSync(userValues.password, bcrypt.genSaltSync())
                            })
                            localStorage.setItem('registeredUserList', JSON.stringify(usersValue))
                            // console.log(bcrypt.hashSync(values.password, bcrypt.genSaltSync()));
                            
                        } catch (error) {
                            console.log(error)
                        }
                        // const doesPasswordMatch = bcrypt.compareSync("Niket@8184", bcrypt.hashSync(values.password, bcrypt.genSaltSync()))
                        // console.log(doesPasswordMatch);

                    }}
                >
                {({ errors, touched }) => (
                    <Form>
                        <Container className="mt-5">
                            <h1 className="mt-2 mb-5">User Registeration Form</h1>
                            {
                                formInputControl.map((input, index) => {
                                    return (
                                        <Row key={index} className="mt-2">
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
                                userExisted ?  <p className={["m-2", LogInCSS.errormsg].join(" ")}>email id is already existed</p> : null
                            }
                            <button type="submit" className='btn-primary btn mt-3'>Submit</button>
                        </Container>
                    </Form>
                )}
                </Formik>
            </div>
        </>
    )
}
export default LogIn;