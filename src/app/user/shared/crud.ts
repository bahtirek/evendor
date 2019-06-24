/* import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Recipient } from './recipient';
import { Vendor } from './vendor';


@Injectable()
export class CRUD{
    public headers = new Headers({'Content-Type': 'text'});

    constructor(private http: Http){}
 
    create(url, data): Observable<any>{
        let options = new RequestOptions({headers: this.headers});
        return this.http
                    .post(url, JSON.stringify(data), options)
                    .map((response: Response)=><number>response.json())

    }

    read(url, data): Observable<any>{
        if(data){
            return this.http
            .get(url+ "/" + JSON.stringify(data))
            .map((response: Response)=><any[]>response.json())
        }else{
            return this.http
            .get(url)
            .map((response: Response)=><any[]>response.json())
        }
        
    }

    update(url, data): Observable<any>{
        let options = new RequestOptions({headers: this.headers});
        return this.http
                    .put(url, JSON.stringify(data), options)
                    .map((response: Response)=><number>response.json())


    }

    delete(url, data){
        return this.http
                        .delete(url + "/" + JSON.stringify(data))
                        .map((response: Response)=><number>response.json())
        
    }

} */