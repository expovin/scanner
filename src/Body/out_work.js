import React, {Component} from 'react';
import {FormControl, Row, InputGroup, Form, Container, FormFile} from 'react-bootstrap';
import './body.css';


class OutWork extends Component {

    nomeFile="";

    handleChange = (event) => {
        this.nomeFile=event.target.value+".PDF"
        this.props.nomePdfFile(this.nomeFile);
    }  

    render(){

        return(
            <div id="OutWork">
                <Container>
                    <Row> 
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="OutputFile">PDF File</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl aria-label="Large" aria-describedby="NomeFile" onChange={this.handleChange}/>
                        
                        </InputGroup>       
                    </Row>           
                </Container>
            </div>

        )
    }
}

export default OutWork;