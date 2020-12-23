
import React, { Component } from 'react';
import { baseImageUrl } from '../../../../constant/Url';
import { beautifyNominal } from '../../../../utils/StringUtil';
import Product from './../../../../models/Product';
import Modal from './../../../container/Modal';

interface IProps {
    products:Product[],
    withStock:boolean
}
export default class ProductCatalogList extends Component<IProps,any>
{
    constructor(props) {
        super(props);
    }
    render() {
        const props:IProps = this.props;
        return (
            <Modal title="Product List">
                <div className="row">
                    {props.products.map(product => {
                        const imgName = product.imageUrl ? product.imageUrl.split("~")[0] ?? 'Default.bmp' : 'Default.bmp';
                        return (
                            <div className="col-md-2 catalog-item rounded border">
                                <img className="rounded img-fluid" src={baseImageUrl + imgName} />
                                <h6>{product.name}</h6>
                                <span className="text-info"><strong>{beautifyNominal(product.price)}</strong></span>
                                {props.withStock ? <span style={{ marginLeft: '5px' }} className='badge badge-dark'>{product.count}</span> : null}
                            </div>
                        )
                    })}
                </div>
            </Modal>
        )
    }
}