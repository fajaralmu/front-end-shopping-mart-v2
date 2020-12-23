

import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from './../../../BaseComponent';
import { mapCommonUserStateToProps } from './../../../../constant/stores';
import '../Catalog.css';
import CatalogService from './../../../../services/CatalogService';
import Product from './../../../../models/Product';
import Filter from './../../../../models/Filter';
import WebResponse from './../../../../models/WebResponse';
import Modal from '../../../container/Modal';
import FormGroup from '../../../form/FormGroup';
import Category from './../../../../models/Category';
import { baseImageUrl } from '../../../../constant/Url';
import { beautifyNominal } from '../../../../utils/StringUtil';
import NavigationButtons from '../../../navigation/NavigationButtons';
class IState {
    products: Product[] = [];
    filter: Filter = {
        limit: 20,
        page: 0,
        useExistingFilterPage: false,
    };
    fieldsFilter: {} = {
        withStock: true,
        withCategories: true,
    };
    categories: Category[] = [];
    totalData: number = 0;
    dataNotFound: boolean = false;
}
class ProductCatalog extends BaseComponent {
    catalogService: CatalogService = CatalogService.getInstance();
    state: IState = new IState();
    constructor(props: any) {
        super(props, false);
    }
    productNotLoaded = (e: any) => {
        this.setState({ totalData: 0, products: [], dataNotFound: true });
    }
    productsLoaded = (response: WebResponse) => {
        if (response.entities == undefined) {
            this.productNotLoaded(response);
            return;
        }
        if (this.state.fieldsFilter['withCategories'] == true) {
            this.setState({ totalData: response.totalData, dataNotFound: false, products: response.entities, categories: response.generalList });
        } else {
            this.setState({ totalData: response.totalData, dataNotFound: false, products: response.entities });
        }
    }
    loadProducts(page: number | undefined = 0) {
        const filter = this.state.filter;
        if (page != undefined && this.state.filter.useExistingFilterPage == false) {
            filter.page = page;
        }
        filter.fieldsFilter = this.state.fieldsFilter;
       const withProgess = filter.fieldsFilter['withStock'] == true;
            
        this.doAjax(
            this.catalogService.getProductList, withProgess,
            this.productsLoaded, this.productNotLoaded,
            filter,
        )
        filter.useExistingFilterPage = false;
        this.setState({ filter: filter });
    }
    componentDidMount() {
        document.title = "Product Catalog";
        this.loadProducts(0);
    }
    filter = (e) => {
        e.preventDefault();
        this.loadProducts(0);
    }
    setFieldsFilterValue = (e) => {
        const input: HTMLInputElement = e.target;
        let name: string = input.name;
        let value: any;
        
        if (input.type == 'checkbox') {
            value = input.checked == true;
        } else {
            value = input.value;
        }
        const fieldsFilter = this.state.fieldsFilter;
        if (value == undefined || new String(value).trim() == "") {
            if (fieldsFilter[name])
                delete fieldsFilter[name];
        } else {
            fieldsFilter[name] = value;
        }
        this.setState({ fieldsFilter: fieldsFilter });
    }
    setFilterPage = (value: any) => {
        const page = parseInt(value);
        const filter = this.state.filter;
        filter.page = page;
        filter.useExistingFilterPage = true;
        this.setState({ filter: filter });
    }
    setLimit = (limit:number) => {
        const filter = this.state.filter;
        filter.limit = limit;
        this.setState({ filter: filter });
    }

    render() {
        const products: Product[] = this.state.products;
        return (
            <div id="ProductCatalog" className="container-fluid">
                <h2>Product Catalog</h2>
                <form onSubmit={this.filter} >
                    <Modal title="Filter" footerContent={
                        <Fragment>
                            <input type="submit" className="btn btn-primary" />
                            <input type="reset" className="btn btn-warning" />
                        </Fragment>
                    }>
                        <div className="row">
                            <FormGroup orientation="vertical" className="col-md-6" label="Name">
                                <input onChange={this.setFieldsFilterValue} defaultValue={this.state.fieldsFilter['name']} name="name" placeholder="Product Name" className="form-control" />
                            </FormGroup>
                            <FormGroup orientation="vertical" className="col-md-6" label="Category">
                                <select onChange={this.setFieldsFilterValue} defaultValue={this.state.fieldsFilter['category,id[EXACTS]']} className="form-control" name="category,id[EXACTS]">
                                    <option value="">All</option>
                                    {this.state.categories.map(category => {
                                        return <option value={category.id}>{category.name}</option>
                                    })}
                                </select>
                            </FormGroup>
                            <FormGroup orientation="vertical" className="col-md-3" label="With Stock">
                                <input onChange={this.setFieldsFilterValue} defaultChecked={this.state.fieldsFilter['withStock'] == true} type="checkbox" name="withStock" />
                                <label style={{ paddingLeft: '5px' }}>{this.state.fieldsFilter['withStock'] == true ? "Yes" : "No"}</label>
                            </FormGroup>
                            <FormGroup orientation="vertical" className="col-md-3" label="Go To Page">
                                <input name="page" min="1" type="number" onChange={
                                    (e) => this.setFilterPage(parseInt(e.target.value) - 1)
                                } defaultValue={(this.state.filter.page ?? 0) + 1} className="form-control" />
                            </FormGroup>
                            <FormGroup orientation="vertical" className="col-md-3" label="Displayed Item">
                                <input name="limit" min="1" type="number" onChange={
                                    (e) => this.setLimit(parseInt(e.target.value))
                                } defaultValue={this.state.filter.limit } className="form-control" />
                            </FormGroup>
                            <FormGroup orientation="vertical" className="col-md-3" label="Total Data">
                                <label>{this.state.totalData}</label>
                            </FormGroup>
                        </div>
                    </Modal>
                </form>
                <DataNotFound show={this.state.dataNotFound} />
                <NavigationButtons limit={this.state.filter.limit ?? 20} activePage={this.state.filter.page ?? 0}
                    totalData={this.state.totalData} onClick={(page) => this.loadProducts(page)} />
                <ProductList products={this.state.products} withStock={this.state.fieldsFilter['withStock']} />
            </div>
        )
    }
}

const ProductList = (props: { products: Product[], withStock: boolean }) => {

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

const DataNotFound = (props) => {
    if (props.show == false) return null;
    return (
        <div className="alert alert-warning">Data not found</div>
    )
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(ProductCatalog))