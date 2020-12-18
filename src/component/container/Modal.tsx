
import React, { Component } from 'react';
export default class Modal extends Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const title = this.props.title?? "Title";
        return (
            <div className="modal-content ">
                <div className="modal-header">
                    <h5 className="modal-title">{title}</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    {this.props.children}
                </div>
                {this.props.showFooter == true?
                <div className="modal-footer">
                    {this.props.footerContent}
                </div>
                :null}
            </div>
        )
    }

}