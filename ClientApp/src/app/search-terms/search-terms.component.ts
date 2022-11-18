import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { SearchTerms, Node, NetworkTerms, NetworkSearchData } from '../models';

@Component({
  selector: 'app-search-terms',
  templateUrl: './search-terms.component.html',
  styleUrls: ['./search-terms.component.css']
})
export class SearchTermsComponent implements OnInit {

  @Output() searchTermsChanged = new EventEmitter<SearchTerms>();
  @Output() networkTermsChanged = new EventEmitter<NetworkTerms>();
  @Output() targetNodeChanged = new EventEmitter<string>();
  @Input() sd: NetworkSearchData;
  searchText: string;
  targetVariants: string;
  targetSharedVariants: string;
  targetCommunities: string;
  degrees = 1;
  q_val = 0;
  egoNetwork = false;
  sigComms = true;

  constructor() { }

  ngOnInit() {
  }

  onSearchClick() {
    const fields = new SearchTerms();
    fields.text = this.searchText;

    this.searchTermsChanged.emit(fields);
  }

  onTargetNodeChanged() {
    this.targetNodeChanged.emit('none');
  }

  onNetworkFilterChanged() {
    const filters = new NetworkTerms();
    filters.qVal = this.q_val;
    filters.sigCom = this.sigComms;
    filters.degrees = this.egoNetwork ? 1 : this.degrees;
    filters.egoNetwork = this.egoNetwork;

    if (this.targetVariants) {
      filters.variants = new Set(this.targetVariants.split(' '));
    }
    if (this.targetSharedVariants) {
      filters.sharedVariants = new Set(this.targetSharedVariants.split(' '));
    }
    if (this.targetCommunities) {
      filters.communities = new Set(this.targetCommunities.split(' ').map(_ => Number(_)));
    }

    this.networkTermsChanged.emit(filters);
  }
}
