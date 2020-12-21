
import React, { Component } from 'react';
export default class Modal extends Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const title = this.props.title?? "Title"; 
        const props = (({ footerContent, ...props }) => props)(this.props) // remove b and c
        return (
            <div {...props} className="modal-content " style={{marginBottom:'10px'}}>
                <div className="modal-header">
                    <h5 className="modal-title">{title}</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    {this.props.children}
                </div>
                {this.props.footerContent || this.props.showFooter == true?
                <div className="modal-footer">
                    {this.props.footerContent}
                </div>
                :null}
            </div>
        )
    }

}