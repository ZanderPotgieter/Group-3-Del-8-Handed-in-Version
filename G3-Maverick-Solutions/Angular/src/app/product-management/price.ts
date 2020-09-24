import { Product } from '../product-management/product';


export class Price {
    PriceID : number;
	ProductID : number;
	UPriceR : number;
	PriceStartDate :Date;
	PriceEndDate : Date;
	CPriceR : number;
	Product: Product;
}
