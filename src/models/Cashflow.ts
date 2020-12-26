export default class Cashflow {
    amount: number = 0;
    count: number = 0;
    module: string = 'SELLING';
    year: number = new Date().getFullYear();
    month: number = 1;
    
 static maxAmount = (cashflows: Cashflow[]): number => {
    let max = 0;
    for (let i = 0; i < cashflows.length; i++) {
        const element = cashflows[i];
        if (element.amount > max) {
            max = element.amount;
        }
    }

    return max;
}
}