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
    
    public partial class Price
    {
        public int PriceID { get; set; }
        public Nullable<int> ProductID { get; set; }
        public Nullable<float> UPriceR { get; set; }
        public Nullable<System.DateTime> PriceStartDate { get; set; }
        public Nullable<System.DateTime> PriceEndDate { get; set; }
        public Nullable<float> CPriceR { get; set; }
    
        public virtual Product Product { get; set; }
    }
}
