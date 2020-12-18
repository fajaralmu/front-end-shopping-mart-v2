
import React, { Fragment, Component } from 'react';
import { toBase64v2 } from '../../../utils/ComponentUtil';
import AnchorButton from './../../navigation/AnchorButton';
import EntityElement from './../../../models/EntityElement';
interface IState {
    singlePreviewData?: string,
    inputElements: number[]
}
export default class FormInputImage extends Component<any, IState>
{
    state: IState = {
        singlePreviewData: undefined,
        inputElements: [1]
    }
    ref: React.RefObject<any> = React.createRef();
    constructor(props: any) {
        super(props);
    }
    changeSingleImageData = (e) => {
        const app = this;
        toBase64v2(e.target).then(function (data) {
            app.setState({ singlePreviewData: data });
        })
    }
    removeSingleImageData = (e) => {
        if (this.ref.current) {
            this.ref.current.value = null;
        }
        this.setState({ singlePreviewData: undefined });
    }
    addInputElement = (e) => {
        const element = this.state.inputElements;
        element.push(element[element.length - 1]);
        this.setState({ inputElements: element });
    }
    popInputElement = (e) => {
        const element = this.state.inputElements;
        element.pop();
        this.setState({ inputElements: element });
    }
    getEntityElement(): EntityElement {
        return this.props.element;
    }
    render() {
        const element: EntityElement = this.getEntityElement();
        return (
            <React.Fragment>
                <input ref={this.ref}
                    onChange={this.changeSingleImageData} type="file" accept="image/*" name={element.id} className='form-control' />
                <ImagePreview imageData={this.state.singlePreviewData} />
                <AnchorButton show={this.state.singlePreviewData != undefined} onClick={this.removeSingleImageData} iconClassName="fas fa-times" className="btn btn-danger btn-sm">remove</AnchorButton>
            </React.Fragment>
        )
    }

}
const ImagePreview = (props) => {
    if (props.show == false || !props.imageData) return null;
    return <img className="image" style={{ margin: '3px' }} src={props.imageData} width="50" height="50" />
}
