import React, {Component} from 'react';
import {Alert} from 'react-bootstrap';
import './body.css';


class AlertMessages extends Component {

    render(){

        return(
            this.props.alert.show?
                <Alert id="myAlert" variant={this.props.alert.variant} onClose={this.props.closeAlert} dismissible>
                    <Alert.Heading>{this.props.alert.heading}</Alert.Heading>
                    <p>{this.props.alert.text}</p>
                </Alert> : null



        )
    }
}


export default AlertMessages;