import{Payment} from './payment';
import {ProductSale} from './product-sale';
import{User} from '../login-subsystem/user/model/user.model';

export class Sale {
    SaleID: number;
    UserID: number;
    SaleDate: Date;
    Payments: Payment[];
    Product_Sale: ProductSale[];
    User: User[]
}
