import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  inputs: ['modal', 'note', 'vendors']
})
export class ModalComponent implements OnInit {

  public modal;
  public vendors;
  public note = {name: '', note:'', vendorInd: null, itemInd: null};

  constructor(private router: Router) { }

  ngOnInit() {
  }

  @Output()
  saveNote: EventEmitter<string> = new EventEmitter();

  save(){
    this.modal.noteDisplay = 'none';
    this.saveNote.emit(this.note.note);
  }

  @Output()
  delete: EventEmitter<null> = new EventEmitter();
  deleteOnModal(){
    this.delete.emit();
    console.log('delete')
  }
  
  @Output()
  ok: EventEmitter<null> = new EventEmitter();
  okOnModal(){
    this.ok.emit();
  }

  closeModal(){
    this.modal.display = 'none';
  }

  @Output()
  submitVendors: EventEmitter<object> = new EventEmitter;

  submit(){
    this.submitVendors.emit(this.vendors);
  }

}
