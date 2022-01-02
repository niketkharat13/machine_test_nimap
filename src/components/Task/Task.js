import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Formik, Form, Field } from 'formik';
import NavBar from '../navbar/navbar';
import * as Yup from 'yup';
import taskListCss from './task.module.css';
import {useNavigate} from 'react-router-dom';
import { Icon } from '@iconify/react';
const Task = (props) => {
    const navigate = useNavigate();
    const [tasklist, setTasklist] = useState([]);
    const [addTaskShow, setAddTaskShow] = useState(false)
    useEffect(() => {
        try {
            let taskList = [];
            console.log(localStorage.getItem('task_list'));
            if (localStorage.getItem('task_list') == null) {
                // console.log('task_list', localStorage.getItem('task_list'));
                axios.get('http://jsonplaceholder.typicode.com/todos').then(data => {
                    // console.log(data, 'api then')
                    taskList = data.data.filter(task => task.userId == props.loggedInUser.id);
                    localStorage.setItem('task_list', JSON.stringify(taskList));
                    setTasklist(taskList);
                }).catch(err => {
                    console.log(err, 'error');
                });
            } else {
                taskList = JSON.parse(localStorage.getItem('task_list'));
                setTasklist(taskList);
            }
        } catch (error) {
            console.log(error, 'error');            
        }
    }, []);
    useEffect(() => {
        if (props.loggedInUser == null) {
            navigate('/login');
        }
    }, [props.loggedInUser]);
    useEffect(() => {
    }, [tasklist]);
    console.log(tasklist, 'tasklist');
    // console.log(props, 'props');
    const deleteTask = (id) => {
        let updatedTaskList = [...tasklist];
        let index = tasklist.findIndex(task => task.id === id);
        updatedTaskList.splice(index, 1);
        localStorage.setItem('task_list', JSON.stringify(updatedTaskList));
        setTasklist(updatedTaskList)
    }
    return (
        <>
            <NavBar/>
            <Container className="mt-5">
                <h3 className={taskListCss.tasklistHeading}>Task List</h3>
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Task</th>
                            <th>Completed Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tasklist.map((task, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{task.title}</td>
                                        <td>{task.completed?.toString()}</td>
                                        <td>
                                            <Icon icon="carbon:delete" style={{
                                                fontSize: '24px',
                                                cursor: 'pointer',
                                                color: 'red'
                                            }} onClick={() => deleteTask(task.id)} />
                                            {/* <button className='btn btn-danger' onClick={() => deleteTask(task.id)}>Delete</button> */}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <div className='d-flex mt-4 mb-5'>
                    <button className={['btn','btn-primary', taskListCss.addButton].join(' ')} onClick={() => setAddTaskShow(true)}>Add Task</button>
                </div>
            </Container>
            <Modal show={addTaskShow} onHide={() => setAddTaskShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Task</Modal.Title>
                </Modal.Header>
                <Formik
                    initialValues={{
                        taskName: '',
                        taskStatus: '-1',
                        notSelectedValue: '-1'
                    }}
                    validationSchema={
                        Yup.object().shape({
                            taskName: Yup.string()
                                .required('Please Task Name'),
                            taskStatus: Yup.string()
                                .notOneOf([Yup.ref('notSelectedValue'), null], 'Please select status')
                                .required('Status is required'),                      
                        })
                    }
                    onSubmit={values => {
                        try {
                            let updatedTaskList = [...tasklist];
                            updatedTaskList.push({
                                id: updatedTaskList.length + 1,
                                userId: props.loggedInUser.id,
                                title: values.taskName,
                                completed: values.taskStatus
                            });
                            localStorage.setItem('task_list', JSON.stringify(updatedTaskList));
                            setAddTaskShow(false);
                            setTasklist(updatedTaskList)
                            // setIsTaskAdd
                        } catch (error) {
                            console.log(error)
                        }
                    }}
                >
                    {({ errors, touched }) => (
                        <Form>
                            {
                                <>
                                    <div className="modal-body">
                                        <Row className="mt-4">
                                            <Col md={3}>
                                                <label htmlFor="task_name" className="w-100 h-100 d-flex align-items-center justify-content-end">Task Name</label>
                                            </Col>
                                            <Col md={8}>
                                                <Field name="taskName" className={["form-control ","w-100", errors.taskName && touched.taskName ? taskListCss.addErrorTextBox : ''].join(' ')} placeholder="Please enter task name" id="task_name" type="text" />
                                            </Col>
                                            <Row>
                                                <Col md={3}></Col>
                                                <Col md={8}>{errors.taskName && touched.taskName ? (
                                                    <p className={["text-start","m-2", taskListCss.addTaskError].join(" ")}>{errors.taskName}</p>
                                                ) : null}</Col>
                                            </Row>
                                        </Row>
                                        <Row className="mt-4">
                                            <Col md={3}>
                                                <label htmlFor="task_status" className="w-100 h-100 d-flex align-items-center justify-content-end">Task Name</label>
                                            </Col>
                                            <Col md={8}>
                                                <Field name="taskStatus" className={["form-control", errors.taskStatus && touched.taskStatus ?taskListCss.addErrorTextBox : ''].join(' ')} id="task_name" as="select">
                                                    <option disabled value="-1">
                                                        Select Status
                                                    </option>
                                                    <option value="true">
                                                        Completed
                                                    </option>
                                                    <option value="false">
                                                        Not Completed
                                                    </option>
                                                </Field>
                                            </Col>
                                            <Row>
                                                <Col md={3}></Col>
                                                <Col md={8}>{errors.taskStatus && touched.taskStatus ? (
                                                    <p className={["text-start","m-2", taskListCss.addTaskError].join(" ")}>{errors.taskStatus}</p>
                                                ) : null}</Col>
                                            </Row>
                                        </Row>
                                    </div>
                                    <div className='modal-footer'>
                                        <Button type='submit' variant="primary">
                                            Add Task
                                        </Button>
                                        <Button type='submit' variant="secondary" onClick={() => setAddTaskShow(false)}>
                                            Close
                                        </Button>
                                    </div>
                                </>
                            }
                        </Form>
                    )}
                </Formik>
                    
            </Modal>
        </>
    )
}
export default Task;