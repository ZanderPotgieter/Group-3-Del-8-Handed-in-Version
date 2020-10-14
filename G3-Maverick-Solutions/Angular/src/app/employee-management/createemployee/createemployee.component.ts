import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../employee-management/service/employee.service';
import { Employee} from '../model/employee.model';
import { Router } from '@angular/router';
import {  Validators, FormGroup, FormBuilder, Form } from '@angular/forms';
import { User } from '../model/user.model';
import { DialogService } from 'src/app/shared/dialog.service';

@Component({
  selector: 'app-createemployee',
  templateUrl: './createemployee.component.html',
  styleUrls: ['./createemployee.component.scss']
})
export class CreateemployeeComponent implements OnInit {

  constructor( public api: EmployeeService,private router: Router , private fb: FormBuilder,private dialogService: DialogService) { }

  imageUrl: string = "/assets/img/DefaultUser.jpg";//"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxEHEBISEBASFhIVEBAQEBMPEhAQEBAQFhIWFxUVFhoYHiggGBolGxMVITEhJikrLi4uFyAzODMtNygtLisBCgoKDQ0OFRAPFisdFR0tLS4tLS0tNy0rKystLS0rLSstLSsrKy0tLSstLS0rLS0tKy0rLS0tLSstLSstLS4tK//AABEIAOEA4QMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABQYBAwQCB//EADcQAQACAAMFBQUIAQUBAAAAAAABAgMEEQUhMUFREjJhcZETIoGhwRRCUnKSsdHhYhUzQ4KiBv/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFhEBAQEAAAAAAAAAAAAAAAAAABEB/9oADAMBAAIRAxEAPwD7iAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMTaK8Z9Wq2ZpXjevrANw01zWHbhevrDbW0W4TE+QMgAAAAAAAAAAAAAAAAAAAAADEzohNobUnE1rhzpXnbnPl0gEhm9o0y27XW3Sv16IrH2riYvCezH+PH1cIDN7zfjMz5zMsAAzW004TMeUzDADtwNqYmFxntR/lx9UrlNp0zG6fdt0tz8pV0BbxA5Dac4Pu331686/zCdpaLxrE6xPCYBkAAAAAAAAAAAAAAAAEftjNewp2Y71tY8YjnIOLa2e9tM0rPuxO+fxT/CNAAAAAAAAAB3bLz32aezbuTP6Z6+ThAW+N4jNi5r2texM768PGv9JMAAAAAAAAAAAAAABWdo4/2jEtPKJ7MeULBm8T2WHa3Ss+vJVgAAAAAAAAAAAAbspjfZ71t0nf5TxWlUFm2die1wqT4aT8NwOkAAAAAAAAAAAAAHDtmdMG3jNY/wDUK8sG2/8AZn81f3V8AAAAAAAAAAAABPbCnXCnwvMftP1QKc2DGmHaet5/aASYAAAAAAAAAAAAAOXadPaYV48NfSdforS3Wr2omJ5xoqeLhzhWms8pmAeQAAAAAAAAAAAFi2PTsYUeMzb5q9Ws3mIjjM6QteFh+yrFY5REA9gAAAAAAAAAAAAAIXbmW7MxeOE7refKU08Y2FGNWazwmNAVMbc1gTlrTWfhPWOrUAAAAAAAAAD3gYU49orXjPyjqDu2Ll/aX7c8K8PzJ5qy2BGXrFY5fOectoAAAAAAAAAAAAAAAAObO5SM3XSd0x3Z6f0ruPgWy89m0aT8p8YWtqzGXrmY0tGvTrHkCqjvzey74O+vvV8O9HwcAAAAAAO3KbMvj7592vWeM+UA5cLCnGmIrGsrDkMlGUjrae9P0jwbMrla5WNKx5zPGW8AAAAAAAAAAAAAAAHm9opGszERHGZ3QD01Y2YpgRra0R58UVndrzbdh7o/FPH4Qi7Wm86zMzPWZ1lBbKXjEiJidYnhMPSr5TOXys+7O7nWeE/wnMptGmZ3a9m3S306g7GnHytMfvVifHhPq3CiLxNi0nu2tHnpMNM7En8cekpoBC/6Jb8cekt2HsWsd69p8tISgDRgZPDwO7WNes759W8AGLWisazw56ubN5+mW4zrb8Mcfj0Qeczt83x3V5Vjh8eqCx4WNXGjWtomPCdXtUsO84c61mYnrG5LZLa+u7E/VHD4wCXGInXgyoAAAAAAAAAxaezGs8OYPOLiRgxNrTpEcVdz+etm56V5R9Z8Wdo5z7Xbd3Y7sdfFyIACgADqy+0MTA4W1jpbfH8u/C21We/SY8a6TCGEgslNpYV/vxHnrDbGaw7cL1/VCrCi0zmaR9+v6oar7RwqffifLWf2VsBNYu2qx3azPnpEODMbRxMf72kdK7vnxcgkABQAB27P2hOVnSd9OnOvjH8LBS8YkRMTrE74mFSd+y899mns27kz+mevkgsACgAAAAAAh9t5v/jr53+kJLNY8Zek2nlw8Z5Qq97TeZmeMzrPmgwAoAAAAAAAAAAAAAAAAAAm9jZv2kdi0747uvOvT4JRU8HEnBtFo4xOq04GLGNWLRwmIlB7AUAAAYtbsxMzwiNZBC7dx+1aKRy96fOeHy/dFveNie2ta085mf4eAAAAAAAAAAAAAAAAAAAAAExsLH71J/NX6/RDtuUxvYXrbpMa+XMFqCN4AAA4tr4ns8K3j7vrx+WrtRH/ANBfuV/Nb00j6ghwAAAAAAAAAAAAAAAAAAAAAAAWXZuL7bCrPPTSfON30dSL2DfWto6W19Y/pKGAAAhNu9+v5Z/cARoAAAAAAAAAAAAAAAAAAAAAAAJXYPG//X6pgAAAf//Z";
  cvUrl: string = "/assets/doc/OrdraPDF.pdf";
  fileToUpload: File = null;

  empForm: FormGroup; 
  addForm: FormGroup;
  imgForm: FormGroup;
  cvForm: FormGroup;

  user: User = new User();
  employee: Employee = new Employee();
  responseMessage: string = "Request Not Submitted";
  dupMessage: string = "Employee already exists";

  showTable: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showSearch: boolean = true;
  showResults: boolean = false;
  showNewEmp: boolean = false;
  showButton: boolean = true;
  showDate: boolean = true;
  showText: boolean = true;
  inputDisabled:boolean = true;

  showUpload: boolean = false;
  showUploadImg: boolean = false;
  showUploadCv: boolean = false;

  name : string;
  surname : string;
  empID: number;
  Caption: string;

  employeeNull: boolean = false;

  // url ;
	// msg = "";
	
	// selectFile(event) {
	// 	if(!event.target.files[0] || event.target.files[0].length == 0) {
	// 		this.msg = 'You must select an image';
	// 		return;
	// 	}
		
	// 	var mimeType = event.target.files[0].type;
		
	// 	if (mimeType.match(/image\/*/) == null) {
	// 		this.msg = "Only images are supported";
	// 		return;
	// 	}
		
	// 	var reader = new FileReader();
	// 	reader.readAsDataURL(event.target.files[0]);
		
	// 	reader.onload = (_event) => {
	// 		this.msg = "";
  //     this.url = reader.result; 
  //     this.Caption = this.name + this.surname;
  //     //this.fileToUpload = der.result;
	// 	}
	// }

  handleFileInput(file: FileList)
  {
    this.fileToUpload = file.item(0);
    //show image preview
  var reader = new FileReader();
  reader.onload = (event: any) =>
  {
    this.imageUrl = event.target.result;
  }
  reader.readAsDataURL(this.fileToUpload);
}

handleFileInputCV(file: FileList)
  {
    this.fileToUpload = file.item(0);
    //show image preview
  var reader = new FileReader();
  reader.onload = (event: any) =>
  {
    this.cvUrl = event.target.result;
  }
  reader.readAsDataURL(this.fileToUpload);
}

 OnSubmit(Caption, Image,EmployeeID)
 {
  this.searchEmployee();
   this.api.postFile(Caption, this.fileToUpload, EmployeeID).subscribe( data=>
   {
    
    console.log('done');
      this.responseMessage = "Image successfully added";
      this.dialogService.openAlertDialog(this.responseMessage);
      /* Caption.value = null;
      Image.value = null;
      EmployeeID = null; */
     }
   )
 } 

 OnSubmitCV(Caption,Image, EmployeeID)
 {
   this.searchEmployee();
   this.api.postCV(Caption, this.fileToUpload, EmployeeID).subscribe( 
    data=>
    {
     
     console.log('done');
       this.responseMessage = "CV successfully added";
       this.dialogService.openAlertDialog(this.responseMessage);
       /* Caption.value = null;
       CV.value = null;
       EmployeeID = null; */
       
     }
   );
 } 
 
  

  ngOnInit(){
     this.empForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z]*')]],
      surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z]*')]],
      UserName: [''],
      UserSurname: [''],
      UserCell: [''],
      UserEmail: [''],
      caption: [''],
      captionCV: [''],
      cv: [''],
      image: [''],

      empShiftsCompleted: ['',[Validators.required]],
      empStartDate: ['',[Validators.required]],
    }); 

    this.imgForm = this.fb.group({
      captionCV: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z]*')]],
      
    })

    this.cvForm = this.fb.group({
      caption: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z]*')]],
    })
  }

  searchEmployee(){
    if (this.name ==null || this.surname == null)
    {
      this.employeeNull = true;
    }
    else
    {
      this.api.searchEmployee(this.name,this.surname).subscribe( (res:any)=> {
        console.log(res);
        
          if (res.Message== "Employee Record Not Found")
          {
               //Get User Details
               this.user.UserID = res.user.UserID;
               this.user.UserName = res.user.UserName;
               this.user.UserSurname = res.user.UserSurname;
               this.user.UserCell = res.user.UserCell;
               this.user.UserEmail = res.user.UserEmail;
       
               //Get Employee Details
               if (this.employee== null) //check if employee exist
               {
                 this.showButton = true;
                 /* this.showDate = true;
                 this.showText = false; */
               }
               else //display employee details if record exists
               { 
                 //alert(this.dupMessage);
                 this.employee.EmployeeID = res.employee.EmployeeID;
                 this.employee.EmpShiftsCompleted = res.employee.EmpShiftsCompleted;
                 this.employee.EmpStartDate = res.employee.EmpStartDate;
                 this.empID = res.employee.EmployeeID;
       
                 this.showButton = false;
               /*  this.showDate = false;
                 this.showText = true; */
               }
              this.showSearch = false;
             this.showResults = true;
             this.showNewEmp = true;
             this.showUpload = false;
             this.showUploadImg= false;
             this.showUploadCv = false; 
          }
          else 
          {
            this.dialogService.openAlertDialog(res.Message);
            this.router.navigate(["employee-management"]);
          }
          
        })
    }

  }


  createEmployee(){
    if (this.employee.EmpStartDate == null || this.employee.EmpShiftsCompleted ==null)
    {
      this.employeeNull = true;
    }
    else
    {
      this.dialogService.openConfirmDialog('Are you sure you want to add the employee?')
      .afterClosed().subscribe(res => {
        if (res)
        {
          this.employee.UserID = this.user.UserID;
          this.api.createEmployee(this.employee).subscribe( (res:any)=> {
          console.log(res);
          if(res.Message == "Employee Profile Succesfully Created")   //check if error occured
          {

            this.dialogService.openAlertDialog(res.Message);
            /* this.showSearch = false;
            this.showResults = true;
            this.showNewEmp = false;
            this.showUpload = true;
            this.showUploadImg= false;
            this.showUploadCv = false; */
            this.router.navigate(["employee-management"]);
          }
          else 
          {
            this.dialogService.openAlertDialog(res.Message);
            this.router.navigate(["employee-management"]);
          }      
        })
      }
      })
    }
  }

  gotoEmployeeManagement(){
    this.router.navigate(['employee-management']);

  }

  cancel(){
    this.router.navigate(['employee-management']);
    /* this.inputEnabled = false;
    this.showButtons = true;
    
    this.showSearch = true;
    this.showResults = false;
    this.showNewEmp = false;
    this.showUpload = false;
    
    this.showUploadImg= false;
    this.showUploadCv = false; */
  }

  gotoUploadImage()
  {
    this.showSearch = false;
    this.showResults = false;
    this.showNewEmp = false;
    this.showUpload = true;
    this.showUploadImg= true;
    this.showUploadCv = false;
  }

  gotoUploadCv()
  {
    this.showSearch = false;
    this.showResults = false;
    this.showNewEmp = false;
    this.showUpload = true;
    this.showUploadImg= false;
    this.showUploadCv = true;
  }


  


  clear()
  {
    window.location.reload()
  }
}
