import { Payment } from './payment';

export class SearchedSale {
    SaleID: String;
    SaleDate: string;
    CashierName: string;
    Payments: Payment[];
}
