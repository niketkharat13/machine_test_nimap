import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
const Information = (props) => {
    console.log(props, 'props');
    return (
        <>
            {
                props.selectedOptionObj != null ?
                    <Row className="mt-5">
                        <Col md={8}>
                            <p>
                                {props.selectedOptionObj.informationText}
                            </p> 
                        </Col>
                    </Row>
                    : null
            }
        </>
    )
}
export default Information;