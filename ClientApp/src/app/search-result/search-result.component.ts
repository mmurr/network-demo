import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Node } from '../models'

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  @Input() val: Node
  @Output() newTargetNode = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onFocusClick(event){
    this.newTargetNode.emit(this.val.id)
  }

}
