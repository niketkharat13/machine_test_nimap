import React , {useState} from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import signupCSS from './signup.module.css';
const SignUp = (props) => {
    const [userExisted, setIsUserExisted] = useState(false);
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
                            confirmPassword: Yup.string().required('please')
                               .oneOf([Yup.ref('password'), null], 'Passwords must match')                          
                        })
                    }
                    onSubmit={values => {
                        console.log(values, 'values')
                        // same shape as initial values
                        try {
                            let registeredUserList = localStorage.getItem('registeredUserList');
                            console.log(!registeredUserList, 'registeredUserList');
                            let usersValue = [];
                            if (registeredUserList !== null) {
                                console.log("inside")
                                usersValue = JSON.parse(registeredUserList);
                                console.log(usersValue, 'usersValue');
                                let isUserExisted = usersValue.filter(u => u.email === values.email);
                                if (isUserExisted.length > 0) {
                                    setIsUserExisted(true);
                                    return;
                                }
                            }
                            const {confirmPassword, ...userValues} = values;
                            let encrypted = props.encryptPassword(values.password);
                            usersValue.push({
                                ...userValues,
                                password:  encrypted.password,
                                cp: encrypted.cp
                            })
                            localStorage.setItem('registeredUserList', JSON.stringify(usersValue))
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
                                            <Row className="test">
                                                <Col md={4}></Col>
                                                <Col md={4}>{errors[input.formikKey] && touched[input.formikKey] ? (
                                                    <p className={["text-start","m-2", signupCSS.errormsg].join(" ")}>{errors[input.formikKey]}</p>
                                                ) : null}</Col>
                                            </Row>
                                        </Row>
                                    )
                                })
                            }
                            {
                                userExisted ?  <p className={["m-2", signupCSS.errormsg].join(" ")}>email id is already existed</p> : null
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
export default SignUp;