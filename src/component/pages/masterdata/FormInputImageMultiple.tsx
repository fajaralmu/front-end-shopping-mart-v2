
import React, { Fragment, Component } from 'react';
import { toBase64v2 } from '../../../utils/ComponentUtil';
import AnchorButton from '../../navigation/AnchorButton';
import EntityElement from '../../../models/EntityElement';
interface IState {
    previewData: Map<number, string>,
    inputElements: number[]
}
export default class FormInputImageMultiple extends Component<any, IState>
{
    state: IState = {
        previewData: new Map(),
        inputElements: [1]
    }
    ref: React.RefObject<any> = React.createRef();
    constructor(props: any) {
        super(props);
    }
    setImageData = (e, index) => {
        const app = this;
        toBase64v2(e.target).then(function (data) {
            const previewData = app.state.previewData;
            previewData.set(index, data);
            app.setState({ previewData: previewData });
        })
    }
     
    addInputElement = (e) => {
        const element = this.state.inputElements;
        element.push(element[element.length - 1]+1);
        this.setState({ inputElements: element });
    }
    removeInputElement = (removedIndex:number) => {
        const element = this.state.inputElements;
        for (let i = 0; i < element.length; i++) {
            const index = element[i];
            if (index == removedIndex) {
                element.splice(i, 1);
            }
        }
        this.setState({ inputElements: element });
    }
    getEntityElement(): EntityElement {
        return this.props.element;
    }
    render() {
        const element: EntityElement = this.getEntityElement();
        
        return (
            <React.Fragment>
                {this.state.inputElements.map(index => {
                    return <Fragment><input
                        onChange={(e) => this.setImageData(e, index)} type="file" accept="image/*" 
                        name={element.id} className='form-control' />
                        <ImagePreview imageData={this.state.previewData.get(index)} />
                        <AnchorButton show={this.state.previewData != undefined} 
                           onClick={(e)=>this.removeInputElement(index)} iconClassName="fas fa-times" className="btn btn-danger btn-sm">remove {index}</AnchorButton>
                    </Fragment>
                })}
                <p></p>
                <AnchorButton iconClassName="fas fa-plus" onClick={this.addInputElement}>Add</AnchorButton>
            </React.Fragment>
        )
    }

}
const ImagePreview = (props) => {
    if (props.show == false || !props.imageData) return null;
    return <img className="image" style={{ margin: '3px' }} src={props.imageData} width="50" height="50" />
}
