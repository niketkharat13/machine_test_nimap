import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import {NavLink} from 'react-router-dom';
const Dropdown = React.lazy(() => import('../Dropdown/dropdown'));
const Information = React.lazy(() => import('../Information/Information'));
const NavBar = (props) => {
    console.log(props.DropDownInformation, 'props.DropDownInformation', props.isHomePage);
    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand>
                        Machine Test - Nimap
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <NavLink
                            activeClassName="selected"
                            className="nav-link"
                            to="/"
                        >Home</NavLink>
                        <NavLink
                            className='nav-link'
                            to="/task"
                        >Tasks</NavLink>
                        <NavLink
                            className='nav-link'
                            to="/user"
                        >User</NavLink>
                    </Nav>
                    
                </Container>
            </Navbar>
            {
                props.isHomePage ? 
                <>
                    <Container>
                        <Dropdown 
                            isHomePage={true}
                            DropDownInformation={props.DropDownInformation}
                            dropDownVal={props.dropDownVal}
                            onChangeDropDown={props.onChangeDropDown}
                        />
                        <Information 
                            selectedOptionObj={props.selectedOptionObj} 
                        />
                    </Container>
                   
                </> : null
            }
        </>
    )
}
export default NavBar;