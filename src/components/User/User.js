import React , {useState} from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import userCSS from './user.module.css';
import { addMonths } from 'date-fns';
const User = (props) => {
    const formInputControl = [
        {
            label: 'New Password',
            id: "password",
            formikKey: 'password',
            inputType: "password",
            placeholder: 'Please Enter New Password'
        },
    ]
    const [isChangePWD, setIsChangePWD] = useState(false);
    console.log(props, 'props')
    const logout = () => {
        document.cookie = `logged_in_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }
    return (
        <>
            <Container>
                <Row>
                    <Col md={2}>Username</Col>
                    <Col md={3}>
                        <input type="text" value={props.loggedInUser.email} disabled className="form-control" />
                    </Col>
                </Row>
                {
                    !isChangePWD ? 
                        <Row>
                            <Col md={2}>Password</Col>
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
                                console.log(props.loggedInUser, 'props.userDetails');
                                let updatedUserDetails = props.loggedInUser;
                                let encrypted = props.encryptPassword(values.password)
                                updatedUserDetails.password = encrypted.password;
                                updatedUserDetails.cp = encrypted.cp;

                                let registeredUserList = JSON.parse(localStorage.getItem('registeredUserList'));
                                console.log(registeredUserList, 'registeredUserList', updatedUserDetails);
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
                                            <Row key={index} className="mt-4">
                                                <Col md={2}>
                                                    <label htmlFor={input.id} className="w-100 h-100 d-flex align-items-center justify-content-end">{input.label}</label>
                                                </Col>
                                                <Col md={3}>
                                                    <Field name={input.formikKey} className="form-control" placeholder={input.placeholder} id={input.id} type={input.inputType} />
                                                    
                                                </Col>
                                                <Row>
                                                    <Col md={4}></Col>
                                                    <Col md={4}>{errors[input.formikKey] && touched[input.formikKey] ? (
                                                        <p className={["text-start","m-2", userCSS.errormsg].join(" ")}>{errors[input.formikKey]}</p>
                                                    ) : null}</Col>
                                                </Row>
                                            </Row>
                                        )
                                    })
                                }
                                 {isChangePWD ?  <button type="submit" className='btn-primary btn mt-3'>Save Password</button> :null}
                            </Form>
                        )}
                    </Formik>
                }
               {!isChangePWD ? <button className='btn-secondary btn mt-3' onClick={() => setIsChangePWD(true)}>Change Password</button> : null}
               <button className='btn-secondary btn mt-3' onClick={logout}>Logout</button>
            </Container>
        </>
    )
}
export default User;