//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ORDRA_API.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Stock_Take_Product
    {
        public int StockTakeProductID { get; set; }
        public Nullable<int> StockTakeID { get; set; }
        public Nullable<int> ProductID { get; set; }
        public Nullable<int> STProductCount { get; set; }
    
        public virtual Product Product { get; set; }
        public virtual Stock_Take Stock_Take { get; set; }
    }
}
