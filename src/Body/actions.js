import React, {Component} from 'react';
import {Row, Col, Button, Container, InputGroup, FormControl} from 'react-bootstrap';
import './body.css';


class Actions extends Component {

    recipients="";

    handleChange = (event) => {
        this.recipients=event.target.value;
    }      

    stdView = () =>{
        return (
            <div id="Actions">
                <Container>
                    <Row> 
                        <Col><Button variant="success" onClick={() => this.props.sendEmail("expovin@gmail.com")} disabled={this.props.bigFiles? true:false}>Send to Vince</Button></Col>
                        <Col><Button variant="success" onClick={() => this.props.sendEmail("zuccherofarina@gmail.com")} disabled={this.props.bigFiles? true:false}>Send to Julia</Button></Col>
                    </Row>             
                    <Row>
                        <Col><Button variant="info" onClick={() => this.props.changeStdView(false)} disabled={this.props.bigFiles? true:false}>Send to Others</Button></Col>
                        <Col><Button variant="primary" onClick={this.props.saveToDisk}>Save to disk</Button></Col>
                    </Row>
                </Container>
            </div>            
        )
    }

    emailView = () =>{
        return (
            <div id="Actions">
                <Container>
                    <Row> 
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="OutputFile">To:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl aria-label="Large" aria-describedby="Recipients" onChange={this.handleChange}/>
                        </InputGroup>       
                    </Row>         
                    <Row>
                        <Col><Button variant="primary" onClick={() => this.props.sendEmail(this.recipients)}>Send</Button></Col>
                        <Col><Button variant="info" onClick={() => this.props.changeStdView(true)}>Back</Button></Col>
                    </Row>
                </Container>
            </div>            
        )
    }


    render(){

        return(
            this.props.stdView? this.stdView() : this.emailView()
        )
    }
}

export default Actions;