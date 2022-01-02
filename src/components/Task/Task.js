import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
const Task = (props) => {
    const [tasklist, setTasklist] = useState([]);
    const [addTaskShow, setAddTaskShow] = useState(false)
    useEffect(() => {
        try {
            let taskList = [];
            console.log(localStorage.getItem('task_list'));
            if (localStorage.getItem('task_list') == null) {
                console.log('task_list', localStorage.getItem('task_list'));
                axios.get('http://jsonplaceholder.typicode.com/todos').then(data => {
                    console.log(data, 'api then')
                    taskList = data.data.filter(task => task.userId == props.userDetails.id);
                    localStorage.setItem('task_list', JSON.stringify(taskList));
                }).catch(err => {
                    console.log(err, 'error');
                });
            } else {
                taskList = JSON.parse(localStorage.getItem('task_list'))
            }
            setTasklist(taskList);
        } catch (error) {
            console.log(error, 'error');            
        }
    }, []);
    // console.log(tasklist, 'tasklist');
    const deleteTask = (id) => {
        let updatedTaskList = [...tasklist];
        let index = tasklist.findIndex(task => task.id === id);
        updatedTaskList.splice(index, 1);
        localStorage.setItem('task_list', JSON.stringify(updatedTaskList));
        setTasklist(updatedTaskList)
    }
    return (
        <>
            <Container>
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
                                console.log(task);
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{task.title}</td>
                                        <td>{task.completed?.toString()}</td>
                                        <td>
                                            <button className='btn btn-danger' onClick={() => deleteTask(task.id)}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <button className='btn btn-primary' onClick={() => setAddTaskShow(true)}>Add Task</button>
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
                                userId: props.userDetails.id,
                                title: values.taskName,
                                completed: values.taskStatus
                            });
                            localStorage.setItem('task_list', JSON.stringify(updatedTaskList));
                            setAddTaskShow(false);
                            setTasklist(updatedTaskList)
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
                                                <Field name="taskName" className="form-control w-100" placeholder="Please enter task name" id="task_name" type="text" />
                                            </Col>
                                            <Row>
                                                <Col md={3}></Col>
                                                <Col md={8}>{errors.taskName && touched.taskName ? (
                                                    <p className={["text-start","m-2"].join(" ")}>{errors.taskName}</p>
                                                ) : null}</Col>
                                            </Row>
                                        </Row>
                                        <Row className="mt-4">
                                            <Col md={3}>
                                                <label htmlFor="task_status" className="w-100 h-100 d-flex align-items-center justify-content-end">Task Name</label>
                                            </Col>
                                            <Col md={8}>
                                                <Field name="taskStatus" className="form-control" id="task_name" as="select">
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
                                                    <p className={["text-start","m-2"].join(" ")}>{errors.taskStatus}</p>
                                                ) : null}</Col>
                                            </Row>
                                        </Row>
                                    </div>
                                    <div className='modal-footer'>
                                        <Button type='submit' variant="primary">
                                            Add Task
                                        </Button>
                                        <Button type='submit' variant="secondary" onClick={() => setAddTaskShow(false)}>
                                            close
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