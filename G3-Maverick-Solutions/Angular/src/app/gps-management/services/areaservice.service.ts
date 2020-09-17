import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Area } from '../model/area.model';

@Injectable({
  providedIn: 'root'
})
export class AreaserviceService {
  areaData: Area;
  areaList: Area[];
  constructor(private http: HttpClient) { }

  getAreas() {
    return this.http.get(environment.ApiUrl + '/Areas').toPromise();
  }

  getArea(obj: Area) {
    return this.http.get(environment.ApiUrl + '/Areas/' + obj.AreaID).toPromise();
  }

  postArea(obj: Area) {
    return this.http.post(environment.ApiUrl + '/Areas', obj);
  }

  putArea(obj: Area) {
    return this.http.put(environment.ApiUrl + '/Areas/' + obj.AreaID, obj);
  }

  deleteArea(id: number) {
    return this.http.delete(environment.ApiUrl + '/Areas/' + id);
  }
}
