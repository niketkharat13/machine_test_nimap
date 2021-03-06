import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
const Dropdown = (props) => {
    return(
        <>
            <Row>
                <Col md={4}>
                    <select className="form-control mt-5" value={props.dropDownVal} onChange={(e) => props.onChangeDropDown(e.target.value)}>
                        {
                            props.DropDownInformation.map((dropdown, index) => {
                                return (
                                    <option value={dropdown.id} defaultValue={dropdown.selected} disabled={dropdown.isDisabled} key={index}>{dropdown.optionName}</option>
                                )
                            })
                        }
                    </select>
                </Col>
            </Row>
           
        </>
    )
}
export default Dropdown;