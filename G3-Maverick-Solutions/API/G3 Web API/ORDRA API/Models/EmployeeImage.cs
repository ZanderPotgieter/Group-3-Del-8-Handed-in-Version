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
    
    public partial class EmployeeImage
    {
        public int ImgID { get; set; }
        public string ImgCaption { get; set; }
        public string ImgName { get; set; }
        public Nullable<int> EmployeeID { get; set; }
    
        public virtual Employee Employee { get; set; }
    }
}
