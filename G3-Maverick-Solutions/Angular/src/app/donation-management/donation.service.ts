import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { HttpHeaders } from '@angular/common/http';  
import { Observable } from 'rxjs'; 
import { DonationRecipient } from './donation-recipient';

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  constructor(private http: HttpClient) { }

  //donation recipient url
  url = 'https://localhost:44399/API/DonationRecipient'

  //get all donation recipient
  getAllDonationRecipients(): Observable<DonationRecipient[]> {  
    return this.http.get<DonationRecipient[]>(this.url + '/GetAllDonationRecipients');  
  }
  
  //get donation recipient by id
  getDonationRecipient(Id: number): Observable<DonationRecipient> {  
    return this.http.get<DonationRecipient>(this.url + '/GetDonationRecipient/' + Id);  
  } 
  
  //search donation recipient
   searchDonationRecipient(name: string, surname: string): Observable<DonationRecipient> {  
    return this.http.get<DonationRecipient>(this.url + '/searchDonationRecipient?name='+name+'&surname='+surname);  
  }

  //add donation recipient
  addDonationRecipient(donationRecipient: DonationRecipient): Observable<DonationRecipient> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post<DonationRecipient>(this.url + '/AddDonationRecipient',  
    donationRecipient, httpOptions);  
  }  

  //updatedonation recipient
  updateDonationRecipient(donationRecipient: DonationRecipient): Observable<DonationRecipient> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.put<DonationRecipient>(this.url + '/UpdateDonationRecipient',  
    donationRecipient, httpOptions);  
  }  

  //delete donation recipient
  deleteDonationRecipient(Id: number): Observable<number> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.delete<number>(this.url + '/DeleteDonationRecipient?id=' + Id,  
 httpOptions);  
  } 

}
