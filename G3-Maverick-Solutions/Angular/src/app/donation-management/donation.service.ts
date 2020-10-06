import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { HttpHeaders } from '@angular/common/http';  
import { Observable } from 'rxjs'; 
import { DonationRecipient } from './donation-recipient';
import { DonationStatus } from './donation-status';
import { Donation } from './donation';
import { DonatedProduct } from './donated-product';

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  constructor(private http: HttpClient) { }

  //donation recipient url
  url = 'https://localhost:44399/API/DonationRecipient'

  //donation url
  Donurl = 'https://localhost:44399/api/Donation';  

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

  //get all donations
  getAllDonations(): Observable<Donation[]>
  {
    return this.http.get<Donation[]>(this.Donurl + '/getAllDonations');
  }

  //get all donation statuses
  getDonationStatuses(): Observable<DonationStatus[]>
  {
    return this.http.get<DonationStatus[]>(this.Donurl + '/getDonationStatuses');
  }

  //get donation  by id
  getDonationById(donationID: number): Observable<Donation>
  {
    return this.http.get<Donation>(this.Donurl + '/getDonationByID' + donationID);
  }

  //search donation 
  searchDonationsByCell(cell: string): Observable<Donation[]>
  {
    return this.http.get<Donation[]>(this.Donurl + '/searchDonationsByCell?cell=' +cell);
  }

  searchDonationsByName(name: string, surname: string): Observable<Donation[]>
  {
    return this.http.get<Donation[]>(this.Donurl + '/searchDonationsByName?name=' +name+'&surname='+surname);
  }

  //add donation
  addDonation(donation: Donation): Observable<Donation>
  {
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json'}) };
    return this.http.post<Donation>(this.Donurl + '/addDonation/', donation, httpOptions);
  }

  //update donation
  updateDonation(donation: Donation): Observable<Donation>
  {
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json'}) };
    return this.http.put<Donation>(this.Donurl + '/updateDonation/', donation, httpOptions);
  }

  //delete donation
  deleteDonation(donationID: number): Observable<Donation>
  {
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json'}) };
    return this.http.delete<Donation>(this.Donurl + '/deleteDonation?donationID=' + donationID, httpOptions);
 
  }

  getAllDonatedProducts(): Observable<any[]>
  {
    return this.http.get<any[]>(this.Donurl + '/getAllDonatedProducts');
  }

  addDonatedProduct(donatedProduct: DonatedProduct): Observable<DonatedProduct>
  {
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json'}) };
    return this.http.post<DonatedProduct>(this.Donurl + '/addCDonation/', donatedProduct, httpOptions);
  }

  updateDonatedProduct(donatedProduct: DonatedProduct): Observable<DonatedProduct>
  {
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json'}) };
    return this.http.put<DonatedProduct>(this.Donurl + '/updateDonatedProduct/', donatedProduct, httpOptions);
  }

  deleteDonatedProduct(donationID: number): Observable<Donation>
  {
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json'}) };
    return this.http.delete<Donation>(this.Donurl + '/removeDonatedProduct?donationID=' + donationID, httpOptions);
 
  }

  searchDonationRecipientByCell(cell: string): Observable<DonationRecipient>
  {
    return this.http.get<DonationRecipient>(this.Donurl + '/searchDonationRecipientByCell?cell=' +cell);
  }

  searchDonationRecipientByName(name: string, surname: string): Observable<DonationRecipient>
  {
    return this.http.get<DonationRecipient>(this.Donurl + '/searchDonationRecipientByName?name=' +name+'&surname='+surname);
  }


 /*  searchSupplier(name: string): Observable<any>
  {
    return this.http.get<Donation>(this.url + '/searchSupplier?name=' +name);
  } */

}
