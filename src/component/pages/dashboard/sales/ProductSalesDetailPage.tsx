import React, { Fragment } from 'react';
import BaseComponent from '../../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import TransactionHistoryService from '../../../../services/TransactionHistoryService';
import Filter from '../../../../models/Filter';
import WebResponse from '../../../../models/WebResponse';
import DashboardFilter from '../DashboardFilter';
import ProductSales from '../../../../models/ProductSales';
import DashboardBarChart from '../DashboardBarChart';
import FormGroup from '../../../form/FormGroup';
import { beautifyNominal } from '../../../../utils/StringUtil';
import AnchorButton from '../../../navigation/AnchorButton';
import Modal from '../../../container/Modal';
import Carousel from '../../../container/Carousel';
import Product from '../../../../models/Product';
import { baseImageUrl } from '../../../../constant/Url';
import Spinner from '../../../loader/Spinner';
import SimpleError from '../../../alert/SimpleError';
const date: Date = new Date();
const DEFAULT_LIMIT: number = 50;
class IState {
    filter: Filter = {
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        monthTo: date.getMonth() + 1,
        yearTo: date.getFullYear(),
        page: 0,
        limit: DEFAULT_LIMIT
    };
    sortType: string = "asc";
    activeSalesDataIndex: number = -1;
    salesData?: WebResponse = undefined;
    notFound:boolean = false;
}
class ProductSalesDetailPage extends BaseComponent {
    transactionHistoryService: TransactionHistoryService;
    state = new IState();
    constructor(props) {
        super(props, true);
        this.transactionHistoryService = this.getServices().transactionHistoryService;
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
    salesDataLoaded = (response: WebResponse) => {
        this.setState({ salesData: response, notFound: false });
    }
    salesDataNotLoaded = (e: any) => {
        console.error(e);
        this.setState({ salesData:undefined, notFound: true});
        this.validateLoginStatus();
    }
    getProductId = (): number => {
        return this.props.match.params.id;
    }
    getProduct = (): Product | undefined => {
        if (!this.state.salesData || !this.state.salesData.entity) {
            return undefined;
        }
        const product = this.state.salesData?.entity;
        return Object.assign(new Product(), product);
    }
    loadSales = () => {
        this.commonAjaxWithProgress(
            this.transactionHistoryService.getProductSalesDetail,
            this.salesDataLoaded,
            this.salesDataNotLoaded,
            this.getProductId(),
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
        if (this.state.notFound) {
            return <SimpleError>Not Found</SimpleError>
        }
        const salesData = this.state.salesData;
        const product: Product | undefined = this.getProduct();
        if (!salesData || !product) {
            return <div className="container-fluid" >
                <h2>Product Sales : Loading</h2>
                <Spinner />
            </div>
        }
        return (
            <div className="container-fluid" style={{ paddingBottom: '10px' }}>
                <h2>Product Sales : {product.name}</h2>
                <DashboardFilter onChange={this.updatePeriodFilter} transactionYears={salesData && salesData.transactionYears ? salesData.transactionYears : []}
                    onSubmit={this.filter} filter={this.state.filter} />

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
    if (!productSales)
        return (<div className="container-fluid" style={{ minHeight: '120px' }}>
            <div className="alert alert-info"><i className="fas fa-hand-point-up" /> Click the chart to see detail</div>
        </div>);

    return (<div  style={{ minHeight: '120px' }}>
        <FormGroup label="Period">{productSales.monthName} {productSales.year}</FormGroup>
        <FormGroup label="Sales">{beautifyNominal(productSales.sales)}</FormGroup>

    </div>)
}
export default withRouter(connect(
    mapCommonUserStateToProps,
    // mapDispatchToProps
)(ProductSalesDetailPage))