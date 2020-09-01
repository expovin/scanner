import React, {Component} from 'react';
import {Col, Row, Button, Form, Container} from 'react-bootstrap';

class Opzioni extends Component {


    formData = {
        Formato:"tiff",
        Risoluzione: 150,
        Colore:"Gray",
        Profondita:8
    }

    handleChange = (event) => {
        this.formData[event.target.name]=event.target.value
        this.props.changeOpzione(this.formData);
    }  

    render(){

        return(
            <div id="Opzioni">
                <Container>
                    <Row>
                    <Col>
                    <Form>
                        <Form.Group controlId="Formato">
                        <Form.Label>Formato File</Form.Label>
                        <Form.Control as="select" name="Formato" onChange={this.handleChange} custom disabled={this.props.numFile > 0 ? true : false}>
                            <option>tiff</option>
                            <option>pnm</option>
                            <option>png</option>
                            <option>jpeg</option>
                        </Form.Control>
                        </Form.Group>
                    </Form>            
                    </Col>

                    <Col>
                    <Form>
                        <Form.Group controlId="Risoluzione">
                        <Form.Label>Risoluzione</Form.Label>
                        <Form.Control as="select" name="Risoluzione" onChange={this.handleChange} custom>
                            <option>75</option>
                            <option>100</option>
                            <option>150</option>
                            <option>300</option>
                            <option>600</option>
                            <option>1200</option>
                            <option>2400</option>
                            <option>4800</option>
                        </Form.Control>
                        </Form.Group>
                    </Form>            
                    </Col>      
                    </Row>

                    <Row>
                    <Col>
                    <Form>
                        <Form.Group controlId="Colore">
                        <Form.Label>Colore</Form.Label>
                        <Form.Control as="select" name="Colore" onChange={this.handleChange} custom>
                            <option>Gray</option>
                            <option>Color</option>
                            <option>Lineart</option>
                        </Form.Control>
                        </Form.Group>
                    </Form>            
                    </Col>    

                    <Col>
                    <Form>
                        <Form.Group controlId="Profondita">
                        <Form.Label>Profondita in bit</Form.Label>
                        <Form.Control as="select" name="Profondita" onChange={this.handleChange} custom>
                            <option>8</option>
                            <option>16</option>
                        </Form.Control>
                        </Form.Group>
                    </Form>            
                    </Col>             
                    </Row>              
                </Container>
            </div>

        )
    }
}

export default Opzioni;