import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Node, Link } from '../models'

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  @Input() resultNodes: Node[]
  @Output() newTargetNode = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onNewTargetNodeClicked(event){
    this.newTargetNode.emit(event)
  }

}
