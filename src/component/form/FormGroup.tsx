
import React, { Component } from 'react';
export default class FormGroup extends Component<any, any>
{
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div className="form-group">
                <label>{this.props.label?this.props.label:"Label"}</label>
                {this.props.children}
            </div>
        )
    }
}