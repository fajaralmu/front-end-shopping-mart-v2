
import React, { Component } from 'react';
export default class FormGroup extends Component<any, any>
{
    constructor(props) {
        super(props);
    }
    render() {
        const orientation = this.props.orientation == 'vertical' ? 'vertical' : 'horizontal';
        return (
            <div className={"form-group " + (orientation == 'vertical' ? '' : 'row')}>
                <label className={(orientation == 'vertical' ? '' : 'col-sm-2')}><strong>{this.props.label ? this.props.label : "Label"}</strong></label>
                <div className={(orientation == 'vertical' ? '' : 'col-sm-10')}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}