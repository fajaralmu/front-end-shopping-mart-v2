
import React, { Component, Fragment } from 'react';
import Card from '../../../container/Card';
import WebResponse from './../../../../models/WebResponse';
import Filter from './../../../../models/Filter';
import FormGroup from '../../../form/FormGroup';
import Cashflow from './../../../../models/Cashflow';
import { beautifyNominal } from '../../../../utils/StringUtil';
import { uniqueId } from './../../../../utils/StringUtil';
import { transform } from 'typescript';
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
                    <BarChart dataSet={cashflowData.sellings ?? []} />
                    <h4>Purchasing</h4>
                    <BarChart dataSet={cashflowData.purchasings ?? []} />
                </div>
            </Card>
        )
    }
}


const BarChart = (props: { dataSet: Cashflow[] }) => {
    const maxValue = Cashflow.maxAmount(props.dataSet);
    const middleYAxisValue = maxValue * 2 / 3, bottomYAxisValue = maxValue * 1 / 3;
    const offsetX = 100, offsetY = 50;
    const baseYIndex = 200, baseHeight = 150;
    const lineWidth = (23) * (props.dataSet.length);
    return (
        <div style={{ height: '300px', overflowX: 'scroll' }}>
            <svg className="bg-light border" version="1.1" baseProfile="full" width={offsetX * 2 + (23) * (props.dataSet.length)} height={300} xmlns="http://www.w3.org/2000/svg">
                
                {props.dataSet.map((data, i) => {
                    const percentage = (data.amount / maxValue) * baseHeight;
                    const labelY = baseYIndex + 15, labelX = offsetX + 10 + (23) * (i);
                    const xTranslated = 0, yTranslated = 0;
                    const transform = "translate(" + xTranslated + "," + yTranslated + ") rotate(-30," + labelX + "," + labelY + ")";
                    return (
                        <g key={uniqueId() + "-" + i}>
                            <rect fill="green" x={offsetX + (23) * (i)} y={baseYIndex - percentage} height={percentage} width={20} ></rect>
                            <text textAnchor="end" fontSize={10} x={labelX} y={labelY} transform={transform}>{data.month}-{data.year}</text>
                            <circle cx={offsetX + (23) * (i+1)} cy={baseYIndex} r="3" fill="red" />
                        </g>
                    )
                })}
                <rect name="base_axis_x" x={offsetX} y={baseYIndex} height={2} width={lineWidth} />
                <rect name="helper_line_top" fill="rgb(100,100,100)" x={offsetX} y={offsetY} height={1} width={lineWidth} />
                <rect name="helper_line_middle" fill="rgb(100,100,100)" x={offsetX} y={offsetY + baseHeight * 1 / 3} height={1} width={lineWidth} />
                <rect name="helper_line_bottom" fill="rgb(100,100,100)" x={offsetX} y={offsetY + baseHeight * 2 / 3} height={1} width={lineWidth} />
                <rect name="base_axis_y" x={offsetX} y={offsetY} height={baseHeight} width={2} />

                <text textAnchor="end" name="top_val" fontSize={10} x={offsetX} y={offsetY}>{beautifyNominal(maxValue)}</text>
                <text textAnchor="end" name="middle_val" fontSize={10} x={offsetX} y={offsetY + baseHeight * 1 / 3}>{beautifyNominal(middleYAxisValue)}</text>
                <text textAnchor="end" name="bottom_val" fontSize={10} x={offsetX} y={offsetY + baseHeight * 2 / 3}>{beautifyNominal(bottomYAxisValue)}</text>
            </svg>

        </div>
    )
}