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
    
    public partial class Customer_Order
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Customer_Order()
        {
            this.Product_Backlog = new HashSet<Product_Backlog>();
            this.Payments = new HashSet<Payment>();
            this.Product_Order_Line = new HashSet<Product_Order_Line>();
        }
    
        public int CustomerOrderID { get; set; }
        public Nullable<int> CustomerID { get; set; }
        public Nullable<int> UserID { get; set; }
        public Nullable<int> CustomerOrderStatusID { get; set; }
        public string CusOrdNumber { get; set; }
        public Nullable<System.DateTime> CusOrdDate { get; set; }
        public Nullable<int> ContainerID { get; set; }
    
        public virtual Customer Customer { get; set; }
        public virtual Customer_Order_Status Customer_Order_Status { get; set; }
        public virtual User User { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Product_Backlog> Product_Backlog { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Payment> Payments { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Product_Order_Line> Product_Order_Line { get; set; }
        public virtual Container Container { get; set; }
    }
}
