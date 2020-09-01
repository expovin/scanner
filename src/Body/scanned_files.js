import React, {Component} from 'react';
import {Col, Row, Button, ListGroup, Container, Card} from 'react-bootstrap';
import './body.css';


function bytesToSize(bytes) {
    var sizes = ['Byte', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
 }


class ScannedFiles extends Component {


    fileList = () => {
        let total = 0;
        const f = this.props.fileList.map((ele,idx) => {
            total += parseInt(ele.dimensione);          
            if(idx < this.props.fileList.length-1)
                return <ListGroup.Item key={idx}>{bytesToSize(ele.dimensione)+' '+ele.nome}</ListGroup.Item>
            else
                return <ListGroup.Item key={idx} id="lastFileScanned">{bytesToSize(ele.dimensione)+'\t'+ele.nome}</ListGroup.Item>
        })

        this.props.setbigFiles(total)
        return ({"content":f,"total":bytesToSize(total)})
    }

    render(){

        return(
            <div id="ScannedFile">
                <Container>
                    <Row> 
                        <Col>
                            <Row>
                                <Button variant="primary" size="lg" onClick={this.props.scan}>Scan</Button>              
                            </Row>
                            <Row>
                                <Button variant="warning" size="lg" onClick={this.props.convertToPDF}>Converto to PDF</Button>     
                            </Row>                            
                            <Row>
                                <Button variant="danger" size="lg" onClick={this.props.copy}>Copy</Button>     
                            </Row>

                        </Col>

                        <Col>      
                            <Card id="FileScansionati">
                                <Card.Header><h6>File</h6></Card.Header>
                                <Card.Body>
                                    <ListGroup variant="flush" className="fileList">
                                        {this.fileList().content}                                  
                                    </ListGroup>
                                </Card.Body>
                                
                            </Card>
                            <div id="dimTotale"><h6>{this.fileList().total}</h6></div>
                        </Col>          
                    </Row>             
                </Container>
            </div>

        )
    }
}

export default ScannedFiles;