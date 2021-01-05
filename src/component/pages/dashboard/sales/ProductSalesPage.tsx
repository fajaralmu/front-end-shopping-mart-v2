import React, { Fragment } from 'react';
import BaseComponent from '../../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import TransactionHistoryService from '../../../../services/TransactionHistoryService';
import Filter from './../../../../models/Filter';
import WebResponse from './../../../../models/WebResponse';
import DashboardFilter from './../DashboardFilter';
import ProductSales from './../../../../models/ProductSales';
import DashboardBarChart from '../DashboardBarChart';
import FormGroup from './../../../form/FormGroup';
import { beautifyNominal } from '../../../../utils/StringUtil';
import AnchorButton from '../../../navigation/AnchorButton';
import Modal from './../../../container/Modal';
import Carousel from '../../../container/Carousel';
import Product from '../../../../models/Product';
import { baseImageUrl } from '../../../../constant/Url';
import Spinner from './../../../loader/Spinner';
const date: Date = new Date();
const DEFAULT_LIMIT: number = 50;
class IState {
    filter: Filter = {
        month: date.getMonth() + 1,
        year: 2017,//date.getFullYear(),
        monthTo: date.getMonth() + 1,
        yearTo: date.getFullYear(),
        page: 0,
        limit: DEFAULT_LIMIT
    };
    sortType: string = "asc";
    activeSalesDataIndex: number = -1;
    salesData?: WebResponse = undefined
}
class ProductSalesPage extends BaseComponent {
    transactionHistoryService: TransactionHistoryService = TransactionHistoryService.getInstance();
    state = new IState();
    constructor(props) {
        super(props, true);
    }
    updatePeriodFilter = (e) => {
        const name = e.target.name;
        const filter = this.state.filter;
        filter[name] = parseInt(e.target.value);
        this.setState({ filter: filter });
    }
    filter = (e) => {
        e.preventDefault();
        const filter = this.state.filter;
        filter.limit = DEFAULT_LIMIT;
        this.setState({ filter: filter });
        this.loadSales();
    }
    reload = (e) => {
        e.preventDefault();
        // const filter = this.state.filter;
        // filter.limit = (filter.limit ?? 0) + 50;
        // this.setState({ filter: filter });
        this.loadSales();
    }
    salesDataLoaded = (response: WebResponse) => {
        response.entities = ProductSales.sortBySalesDesc(response.entities ?? []);
        this.setState({ salesData: response });
    }
    salesDataNotLoaded = (e: any) => {
        console.error(e);
        this.validateLoginStatus();
    }
    loadSales = () => {
        this.commonAjaxWithProgress(
            this.transactionHistoryService.getProductSales,
            this.salesDataLoaded,
            this.salesDataNotLoaded,
            this.state.filter
        )
    }
    componentDidMount() {
        this.validateLoginStatus();
        this.loadSales();
    }
    setActiveSalesData = (i: number) => {
        this.setState({ activeSalesDataIndex: i });
    }
    unSelectSalesData = () => {
        this.setState({ activeSalesDataIndex: -1 });
    }
    getActiveSalesData = () => {
        const salesList = this.state.salesData ? this.state.salesData.entities : undefined;
        if (!salesList) {
            return undefined;
        }
        for (let i = 0; i < salesList.length; i++) {
            const element = salesList[i];
            if (this.state.activeSalesDataIndex == i) return element;
        }
        return undefined;
    }
    sort = (e) => {
        const salesData = this.state.salesData;
        if (!salesData) {
            return;
        }
        const salesList = salesData ? salesData.entities : undefined;
        if (!salesList) {
            return;
        }
        let sortType: string;
        if (this.state.sortType == "asc") {
            salesData.entities = ProductSales.sortBySales(salesList);
            sortType = "desc";
        } else {
            salesData.entities = ProductSales.sortBySalesDesc(salesList);
            sortType = "asc";
        }
        this.setState({ salesData: salesData, sortType: sortType, activeSalesDataIndex: -1 });
    }
    render() {
        const salesData = this.state.salesData;
        if (!salesData) {
            return <div className="container-fluid" >
                <h2>Product Sales</h2>
                <Spinner/>
                </div>
        }
        const showBtnLoadMore = (this.state.filter?.limit ?? 0) < (this.state.salesData?.totalData ?? 0) + 1;
        const btnSortIconClass = this.state.sortType == "asc" ? "fas fa-sort-amount-down-alt" : "fas fa-sort-amount-up";
        return (
            <div className="container-fluid" style={{ paddingBottom: '10px' }}>
                <h2>Product Sales</h2>
                <DashboardFilter onChange={this.updatePeriodFilter} transactionYears={salesData && salesData.transactionYears ? salesData.transactionYears : []}
                    onSubmit={this.filter} filter={this.state.filter} />
                <Modal title="Options">
                    <div className="inline-buttons-parent">
                        <AnchorButton className="btn btn-secondary btn-sm">Loaded Product <span className="badge badge-light">{salesData.entities?.length}</span></AnchorButton>
                        <AnchorButton className="btn btn-secondary btn-sm">Total Product <span className="badge badge-light">{salesData.totalData}</span></AnchorButton>
                        <AnchorButton className="btn btn-dark btn-sm" iconClassName={btnSortIconClass} onClick={this.sort} >Sort</AnchorButton>
                        <form style={{marginTop:'10px'}} className="input-group" onSubmit={this.reload} >
                            <input placeholder="record count" name="limit" onChange={this.updatePeriodFilter} value={this.state.filter.limit} type="number" min={1} max={this.state.salesData?.totalData} className="form-control" />
                           {showBtnLoadMore? <button type="submit"  className="btn btn-dark btn-sm" ><i className="fas fa-angle-double-right"/> Load more</button>
                           :null}
                        </form>
                    </div>
                </Modal>
                <DashboardBarChart
                    onClick={this.setActiveSalesData} onUnHover={this.unSelectSalesData}
                    updated={salesData.date ?? new Date()} dataSet={ProductSales.toDataSets(salesData?.entities ?? [])} />
                <ProductSalesDetail productSales={this.getActiveSalesData()} />
            </div>
        )
    }
}

const ProductSalesDetail = (props: { productSales?: ProductSales }) => {
    const productSales: ProductSales | undefined = props.productSales;
    if (!productSales || !productSales.product) return <div className="container-fluid" style={{ minHeight: '120px' }}>
        <div className="alert alert-info"><i className="fas fa-hand-point-up" /> Click the chart to see detail</div>
    </div>;

    return (<div className="row" style={{ minHeight: '120px' }}>
        <div className="col-md-6">
            <Carousel imageUrls={Product.getPictureNames(productSales.product, baseImageUrl)} />
        </div>
        <div className="col-md-6 row">
            <div className="col-md-12"><FormGroup label="Name">{productSales.product ? productSales.product.name : ""}</FormGroup></div>
            <div className="col-md-12"> <FormGroup label="Count">{beautifyNominal(productSales.sales)}</FormGroup></div>

        </div>
    </div >)
}
export default withRouter(connect(
    mapCommonUserStateToProps,
    // mapDispatchToProps
)(ProductSalesPage))