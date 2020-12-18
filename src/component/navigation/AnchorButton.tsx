
import React, { Component } from 'react';
export default class AnchorButton extends Component<any, any>
{
    constructor(props:any) {
        super(props);
    }
    render() {
        if (this.props.show == false) return null;
        const btnClassName = this.props.className??"btn btn-outline-secondary";
        return (
            <a style={this.props.style} onClick={this.props.onClick} className={btnClassName} >
                {this.props.iconClassName?
                <span style={{marginRight:'5px'}}><i className={this.props.iconClassName}/></span>
                :
                null}
                {this.props.children}
            </a>
        )
    }
}