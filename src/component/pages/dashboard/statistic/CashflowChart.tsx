
import React, { Component, Fragment, RefObject } from 'react';
import Card from '../../../container/Card';
import WebResponse from './../../../../models/WebResponse';
import Filter from './../../../../models/Filter';
import FormGroup from '../../../form/FormGroup';
import Cashflow from './../../../../models/Cashflow';
import { beautifyNominal } from '../../../../utils/StringUtil';
import { uniqueId } from './../../../../utils/StringUtil';
import { transform } from 'typescript';
import CashflowBarChart from './CashflowBarChart';
import { MONTHS } from './../../../../utils/DateUtil';
interface IProps {
    cashflowData: WebResponse
}
class IState {
    activeSellingIndex:number = -1;
    activePurchasingIndex:number = -1;
}
export default class CashflowChart extends Component<IProps, IState>
{
    state:IState = new IState();
    constructor(props: IProps) {
        super(props);
    }
    getCashflowData = (): WebResponse => {
        return this.props.cashflowData;
    }
    getPeriodString = () => {
        const cashflowData = this.getCashflowData();
        if (!cashflowData.filter) return "";
        let filter: Filter = cashflowData.filter;
        return MONTHS[(filter.month ?? 1) - 1] + " " + filter.year + " - " + MONTHS[(filter.monthTo ?? 1) - 1] + " " + filter.yearTo;
    }
    getSellingData = (): Cashflow | undefined => {
        if (this.state.activeSellingIndex < 0) return undefined;
        const list: Cashflow[] = this.props.cashflowData.sellings ?? [];
        for (let i = 0; i < list.length; i++) {
            if (i == this.state.activeSellingIndex) return list[i];
        }
        return undefined;
    }
    getPurchasingData = (): Cashflow | undefined => {
        if (this.state.activePurchasingIndex < 0) return undefined;
        const list: Cashflow[] = this.props.cashflowData.purchasings ?? [];
        for (let i = 0; i < list.length; i++) {
            if (i == this.state.activePurchasingIndex) return list[i];
        }
        return undefined;
    }
    setActiveSellingData = (i:number) => {
        this.setState({activeSellingIndex:i});
    }
    unSelectSellingData = () => {
        this.setState({activeSellingIndex:-1});
    }
    setActivePurchasingData = (i:number) => {
        this.setState({activePurchasingIndex:i});
    }
    unSelectPurchasingData = () => {
        this.setState({activePurchasingIndex:-1});
    }
    componentDidUpdate() {

    }
    render() {
        const cashflowData = this.getCashflowData()
        return (
            <Card title="Cashflow">
                <FormGroup label="Period" >{this.getPeriodString()}</FormGroup>
                <div className="container-fluid" >
                    <h4>Selling</h4>
                    <CashflowBarChart 
                        onHover={this.setActiveSellingData} onUnHover={this.unSelectSellingData}
                        updated={cashflowData.date ?? new Date()} dataSet={Cashflow.toDataSets(cashflowData.sellings ?? [])} />
                    <CashflowDetail cashflow={this.getSellingData()} />
                    <h4>Purchasing</h4>
                    <CashflowBarChart 
                        onHover={this.setActivePurchasingData} onUnHover={this.unSelectPurchasingData}
                        updated={cashflowData.date ?? new Date()} dataSet={Cashflow.toDataSets(cashflowData.purchasings ?? [])} />
                     <CashflowDetail cashflow={this.getPurchasingData()} />
                </div>
            </Card>
        )
    }
}

const CashflowDetail = (props: { cashflow?: Cashflow }) => {
    const cashflow: Cashflow | undefined = props.cashflow;
    if (!cashflow) return <div className="container-fluid" style={{ minHeight: '120px' }}>
        <div className="alert alert-info">Hover over chart to see detail</div>
    </div>;

    return (<div className="row" style={{ minHeight: '120px' }}>
        <div className="col-md-6"><FormGroup label="Module"> {cashflow.module}</FormGroup></div>
        <div className="col-md-6"><FormGroup label="Period">{MONTHS[cashflow.month - 1]} {cashflow.year}</FormGroup></div>
        <div className="col-md-6"> <FormGroup label="Count">{beautifyNominal(cashflow.count)}</FormGroup></div>
        <div className="col-md-6"> <FormGroup label="Amount">{beautifyNominal(cashflow.amount)}</FormGroup> </div>
    </div >)
}
