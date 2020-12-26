
import React, { Component, Fragment } from 'react';
import Card from '../../../container/Card';
import WebResponse from './../../../../models/WebResponse';
import Filter from './../../../../models/Filter';
import FormGroup from '../../../form/FormGroup';
import Cashflow from './../../../../models/Cashflow';
import { beautifyNominal } from '../../../../utils/StringUtil';
import { uniqueId } from './../../../../utils/StringUtil';
import { transform } from 'typescript';
import CashflowBarChart from './CashflowBarChart';
interface IProps {
    cashflowData: WebResponse
}
export default class CashflowChart extends Component<IProps, any>
{
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
        return filter.month + "/" + filter.year + " - " + filter.monthTo + "/" + filter.yearTo;
    }
    render() {
        const cashflowData = this.getCashflowData()
        return (
            <Card title="Cashflow">
                <FormGroup label="Period" >{this.getPeriodString()}</FormGroup>
                <div className="container-fluid" >
                    <h4>Selling</h4>
                    <CashflowBarChart dataSet={cashflowData.sellings ?? []} />
                    <h4>Purchasing</h4>
                    <CashflowBarChart dataSet={cashflowData.purchasings ?? []} />
                </div>
            </Card>
        )
    }
}
 