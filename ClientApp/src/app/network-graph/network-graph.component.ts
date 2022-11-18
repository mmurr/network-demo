import {
  Component,
  OnInit,
  OnChanges,
  Output,
  Input,
  EventEmitter,
} from '@angular/core';
import { Node, Link } from '../models';
import { ForceGraph } from '../force-graph';

@Component({
  selector: 'app-network-graph',
  templateUrl: './network-graph.component.html',
  styleUrls: ['./network-graph.component.css'],
})
export class NetworkGraphComponent implements OnInit {
  svg;
  link;
  node;
  width = window.innerWidth / 1.85;
  height = window.innerHeight - 60;
  d3 = require('d3');

  @Input() graph: any;
  @Output() targetNodeClick = new EventEmitter<string>();
  initialized: boolean;

  constructor() {}


  ngOnInit() {
    this.initialized = false;
  }

  initNetwork() {
    // update size-related forces
    this.d3.select(window).on('resize', () => {
      this.width = window.innerWidth / 1.85;
      this.height = window.innerHeight - 60;
      this.svg.style.width = this.width + 'px';
      this.svg.style.height = this.height + 'px';
    });
    if (this.graph && this.graph.nodes && this.graph.nodes.length > 0) {
      this.initializeDisplay();
    }
    this.initialized = true;
  }

  ngOnChanges() {
    if (!this.initialized) {
      this.initNetwork();
    } else {
      this.initializeDisplay();
    }
  }

  onNodeClick(e) {
    this.targetNodeClick.emit(e.target.__data__.id);
  }

  initializeDisplay() {
    // set the data and properties of link lines
    const parent = document.getElementById('network-pane');
    if (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    this.svg = ForceGraph(this.graph, {
      width: this.width,
      height: this.height,
      clickEvent: this.targetNodeClick
    });
    this.svg.style.width = this.width + 'px';
    this.svg.style.height = this.height + 'px';
    parent.appendChild(this.svg);

    // // node tooltip
    // this.node.append('title').text(function (d) {
    //   return d.id;
    // });
    // this.node.on('click', (e) => {
    //   this.targetNodeClick.emit(e.target.__data__.id);
    // });
  }
}
