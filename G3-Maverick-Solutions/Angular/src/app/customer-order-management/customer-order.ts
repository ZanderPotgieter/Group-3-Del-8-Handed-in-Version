import {ProductOrderLine} from '../customer-order-management/product-order-line';
export class CustomerOrder {
    CustomerOrderID : number;
    CustomerID : number;
    UserID: number;
    CustomerOrderStatusID : number;
    CusOrdNumber: string;
    CusOrdDate: Date;
    PaymentID : number;
    Product_OrderLine: ProductOrderLine[] = [];
}

