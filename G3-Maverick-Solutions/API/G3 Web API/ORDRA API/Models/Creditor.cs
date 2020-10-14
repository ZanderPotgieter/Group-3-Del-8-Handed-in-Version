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
    
    public partial class Creditor
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Creditor()
        {
            this.Creditor_Payment = new HashSet<Creditor_Payment>();
        }
    
        public int CreditorID { get; set; }
        public Nullable<int> SupplierID { get; set; }
        public Nullable<float> CredAccountBalance { get; set; }
        public string CredBank { get; set; }
        public string CredBranch { get; set; }
        public string CredType { get; set; }
        public string CredAccount { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Creditor_Payment> Creditor_Payment { get; set; }
        public virtual Supplier Supplier { get; set; }
    }
}
