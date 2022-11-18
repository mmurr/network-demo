import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NetworkSearchData, NetworkTerms, Node, SearchTerms } from '../models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Input() nodes: Node[];
  @Input() sd: NetworkSearchData;
  @Output() newTargetNode = new EventEmitter<string>();
  @Output() networkTermsChanged = new EventEmitter<NetworkTerms>();
  @Output() searchTermsChange = new EventEmitter<SearchTerms>();
  filters: SearchTerms;
  matchingNodes: Node[] = [];
  constructor() { }

  ngOnInit() { }

  onSearchTermsChanged(search: SearchTerms) {
    this.filters = search;
  this.searchTermsChange.emit(search);
  }

  onNewTargetNode(event) {
    this.newTargetNode.emit(event);
  }

  onNetworkTermsChanged(event) {
    this.networkTermsChanged.emit(event);
  }
}
