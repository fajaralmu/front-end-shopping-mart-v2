
import BaseComponent from './../../../BaseComponent';
import React from 'react';
import { withRouter } from 'react-router-dom';
import CatalogService from './../../../../services/CatalogService';
import SimpleError from './../../../alert/SimpleError';
import Product from './../../../../models/Product';
import WebResponse from './../../../../models/WebResponse';
import Modal from './../../../container/Modal';
import { baseImageUrl } from '../../../../constant/Url';
import AnchorWithIcon from '../../../navigation/AnchorWithIcon';
import Carousel from './../../../container/Carousel';
interface IState { product?:Product, notFound:boolean }
class ProductCatalogDetail extends BaseComponent {
    catalogService:CatalogService = CatalogService.getInstance();
    state:IState = {notFound:false}
    constructor(props: any) {
        super(props, false);
    }
    getCode():string {
        return this.props.match.params.code;
    }
    recordLoaded = (response:WebResponse) => {
        if (response.entities == undefined || response.entities.length  == 0){
            throw new Error("not found");
        }
        this.setState({
            product:response.entities[0], notFound:true
        })
        document.title = this.state.product?.name??"Detail";
    }
    recordNotLoaded = (e:any) => {
        console.error(e);
        this.setState({notFound:true});
    }
    loadProductDetail = () => {
        this.commonAjax(
            this.catalogService.getProductDetail,
            this.recordLoaded,
            this.recordNotLoaded,
            this.getCode()
        )
    }
    componentDidMount() {
        this.loadProductDetail();
    }
    render() {
        if (!this.getCode() || this.getCode() == "") {
            return <SimpleError>Not Found</SimpleError>
        }
        return (<div className="container-fluid">
            <h2>Product Detail</h2>
            {this.state.product?
            <Modal title={this.state.product.name}>
                <Carousel imageUrls={Product.getPictureNames(this.state.product, baseImageUrl)} />
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Unit</th>
                            <th>Category</th>
                            <th>Current Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{this.state.product.name}</td>
                            <td>{this.state.product.unit?.name}</td>
                            <td>{this.state.product.category?.name}</td>
                            <td>{this.state.product.count}</td>
                        </tr>
                    </tbody>
                </table>
            </Modal>
            : <SimpleError  >Not Found</SimpleError>}
            <AnchorWithIcon iconClassName="fas fa-angle-left" to="/catalog/product">Back</AnchorWithIcon>
        </div>)
    }
}

export default withRouter(ProductCatalogDetail);