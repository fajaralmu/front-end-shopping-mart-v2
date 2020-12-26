
import React, { Component, Fragment } from 'react';
import Card from '../../../container/Card';
import WebResponse from './../../../../models/WebResponse';
import Filter from './../../../../models/Filter';
import FormGroup from '../../../form/FormGroup';
import Cashflow from './../../../../models/Cashflow';
import { beautifyNominal } from '../../../../utils/StringUtil';
import { uniqueId } from './../../../../utils/StringUtil';
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
                    <BarChart  dataSet={cashflowData.sellings ?? []} />
                    <h4>Purchasing</h4>
                    <BarChart   dataSet={cashflowData.purchasings ?? []} />
                </div>
            </Card>
        )
    }
}

const maxCashflow = (cashflows:Cashflow[]) :number=>{
    let max = 0;
    for (let i = 0; i < cashflows.length; i++) {
        const element = cashflows[i];
        if (element.amount > max) {
            max = element.amount;
        }
    }

    return max;
}

const BarChart = (props: { dataSet: Cashflow[] }) => {
    const maxValue = maxCashflow(props.dataSet); 
    const offsetX = 50;
    return (
        <div style={{ height: '300px', overflowX: 'scroll' }}>
            <svg className="bg-light border" version="1.1"
                baseProfile="full" width={offsetX*2 + (23) * (props.dataSet.length)} height={300} xmlns="http://www.w3.org/2000/svg">
                {props.dataSet.map((data, i) => {
                    const percentage = (data.amount / maxValue) * 150;
                    return (
                        <Fragment key={uniqueId()+"-"+i}>
                            <rect fill="green" x={offsetX + (23) * (i)} y={200 - percentage} height={percentage} width={20} ></rect>
                            <text fontSize={10} x={offsetX + (23) * (i)} y={215}>{i+1}</text>
                        </Fragment>)
                })}
                <rect x={offsetX} y={202} className="bg-info" height={1} width={(23) * (props.dataSet.length)} />
                <rect x={offsetX} y={50} className="bg-info" height={152} width={1}/>
                <text fontSize={10} x={offsetX +1} y={52}>{beautifyNominal(maxValue)}</text>
            </svg>

        </div>
    )
}