import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Vendor } from '../shared/vendor';
import { modal } from '../shared/modal';
import { url } from '../shared/url';
import { Group } from '../shared/group';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  public groups: Group[];

  public modal = modal;
  public groupName;
  public editGroup = '';
  private url = url;

  constructor(private http: HttpClient, private auth: AuthService) { }

  ngOnInit() {
    this.http.get<Group[]>(this.url.groups + '?token=' + this.auth.token)
    .subscribe(
      result=>{
        this.groups = result;
        console.log(this.groups)
      },
      error=>{
        console.log(error)
      }
    );
  }

  edit(groupName, index){
    this.groupName = groupName;
    this.editGroup = index;
  }

  save(){
    console.log(this.editGroup);
    if(this.editGroup !== ''){//if group is exist then update
      this.http.put(this.url.group + '/' + this.groups[this.editGroup]['id'] + '?token=' + this.auth.token, {name: this.groupName})
        .subscribe(
          result=>{
            if(result > 0){
              this.groups[this.editGroup]['name'] = this.groupName;
              this.groupName = '';
              this.editGroup = '';
            }else{
              this.modal.text = "Couldn't save the group";
              this.modal.errDisplay = "block";
            }
          }, 
          error=>{}
        );   
    }else{// creating new group
      if(this.groupName !== ''){// if new group name not empty
        this.http.post<number>(this.url.group + '?token=' + this.auth.token, {name: this.groupName})
        .subscribe(
          result=>{
            if(result > 0){
              this.groups.push(new Group(this.groupName, result));
              this.groupName = '';
              this.editGroup = '';
            }else{
              console.log(this.groupName)
              this.modal.text = "Couldn't save the group";
              this.modal.errDisplay = "block";
            }
          }, 
          error=>{
            
            console.log(error)
            this.modal.text = "Couldn't save the group";
            this.modal.errDisplay = "block";
          }
        ); 
      }
    }
    
  }

  cancel(){
    this.groupName = "";
    this.editGroup = '';
  }

  remove(index, id){
   
    this.http.delete(this.url.group + '/' + id + '?token=' + this.auth.token)
      .subscribe(
        result=>{
          if(result > 0) this.groups.splice(index, 1);
        },
        error=>{
          this.modal.text = "Couldn't delete the group";
          this.modal.errDisplay = "block";
        }
      )
    
  }

  public error = true;
  isStringEmpty(){
     let stringRegex = /^(?!\s*$).+/i;
     this.error = stringRegex.test(this.groupName);
   }
}
