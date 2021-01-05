
import React, { Component } from 'react';
import './Spinner.css';
export default class Spinner extends Component<any, any>{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{width:'85px', height:'85px', display:'block'}} className="container-fluid text-center" >
                 <div style={{visibility:this.props.show == false?'hidden':'visible'}} className="lds-spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        )
    }
}