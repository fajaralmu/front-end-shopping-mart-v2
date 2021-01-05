
import React, { Component } from 'react';
import './Spinner.css';
export default class Spinner extends Component<any, any>{
    constructor(props) {
        super(props);
    }

    render() {
        return (

            <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>

        )
    }
}