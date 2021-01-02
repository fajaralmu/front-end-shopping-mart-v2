import React from 'react';
import BaseComponent from '../../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import TransactionHistoryService from '../../../../services/TransactionHistoryService';
import Filter from './../../../../models/Filter';
import WebResponse from './../../../../models/WebResponse';
import DashboardFilter from './../DashboardFilter';
import ProductSales from './../../../../models/ProductSales';
import DashboardBarChart from './../statistic/DashboardBarChart';
import FormGroup from './../../../form/FormGroup';
import { beautifyNominal } from '../../../../utils/StringUtil';
import AnchorButton from '../../../navigation/AnchorButton';
import Modal from './../../../container/Modal';
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
    loadMore = () => {
        const filter = this.state.filter;
        filter.limit = (filter.limit ?? 0) + 50;
        this.setState({ filter: filter });
        this.loadSales();
    }
    salesDataLoaded = (response: WebResponse) => {
        this.setState({ salesData: response });
    }
    salesDataNotLoaded = (e: any) => {
        console.error(e);
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
    render() {
        const salesData = this.state.salesData;
        if (!salesData) {
            return <div className="container-fluid">Please wait</div>
        }
        return (
            <div className="container-fluid">
                <h2>Product Sales</h2>
                <DashboardFilter onChange={this.updatePeriodFilter} transactionYears={salesData && salesData.transactionYears ? salesData.transactionYears : []}
                    onSubmit={this.filter} filter={this.state.filter} />
                <Modal title="Options">
                    <div className="btn-group">
                        <AnchorButton className="btn btn-primary">Loaded Product <span className="badge badge-light">{salesData.entities?.length}</span></AnchorButton>
                        <AnchorButton iconClassName="fas fa-angle-double-right" onClick={this.loadMore}>Load more</AnchorButton>
                    </div>
                </Modal>
                <DashboardBarChart
                    onHover={this.setActiveSalesData} onUnHover={this.unSelectSalesData}
                    updated={salesData.date ?? new Date()} dataSet={ProductSales.toDataSets(salesData?.entities ?? [])} />
                <ProductSalesDetail productSales={this.getActiveSalesData()} />
            </div>
        )
    }
}

const ProductSalesDetail = (props: { productSales?: ProductSales }) => {
    const cashflow: ProductSales | undefined = props.productSales;
    if (!cashflow) return <div className="container-fluid" style={{ minHeight: '120px' }}>
        <div className="alert alert-info">Hover over chart to see detail</div>
    </div>;

    return (<div className="row" style={{ minHeight: '120px' }}>
        <div className="col-md-6"><FormGroup label="Name">{cashflow.product ? cashflow.product.name : ""}</FormGroup></div>
        <div className="col-md-6"> <FormGroup label="Count">{beautifyNominal(cashflow.sales)}</FormGroup></div>
    </div >)
}
export default withRouter(connect(
    mapCommonUserStateToProps,
    // mapDispatchToProps
)(ProductSalesPage))