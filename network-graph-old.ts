// import {
//   Component,
//   OnInit,
//   OnChanges,
//   Output,
//   Input,
//   EventEmitter,
// } from '@angular/core';
// import { Node, Link } from '../models';

// @Component({
//   selector: 'app-network-graph',
//   templateUrl: './network-graph.component.html',
//   styleUrls: ['./network-graph.component.css'],
// })
// export class NetworkGraphComponent implements OnInit {
//   svg;
//   link;
//   node;
//   width = window.innerWidth / 1.85;
//   height = window.innerHeight - 60;
//   d3 = require('d3');

//   @Input() graph: any;
//   @Output() targetNodeClick = new EventEmitter<string>();
//   initialized: boolean;

//   constructor() {}

//   // values for all forces
//   forceProperties = {
//     center: {
//       x: 0, // 0.5,
//       y: 0  // 0.5,
//     },
//     charge: {
//       enabled: 1,
//       strength: -30,
//       distanceMin: 1,
//       distanceMax: 2000,
//     },
//     collide: {
//       enabled: 1,
//       strength: 0.7,
//       iterations: 1,
//       radius: 5,
//     },
//     forceX: {
//       enabled: 0,
//       strength: 0.1,
//       x: 0.5,
//     },
//     forceY: {
//       enabled: 0,
//       strength: 0.1,
//       y: 0.5,
//     },
//     link: {
//       enabled: 1,
//       distance: 30,
//       iterations: 1,
//     },
//   };

//   simulation = this.d3.forceSimulation();

//   ngOnInit() {
//     this.initialized = false;
//   }

//   initNetwork() {
//     this.svg = this.d3.select('#svgNetworkPane');
//     // update size-related forces
//     this.d3.select(window).on('resize', () => {
//       this.width = window.innerWidth / 1.85;
//       this.height = window.innerHeight - 60;
//       var svg0 = document.getElementById('svgNetworkPane');
//       svg0.style.width = this.width + 'px';
//       svg0.style.height = this.height + 'px';
//       this.updateForces();
//     });
//     if (this.graph && this.graph.nodes) {
//       this.initializeDisplay();
//       this.initializeSimulation();
//     }
//   }

//   ngOnChanges() {
//     if (!this.initialized && this.graph.nodes) {
//       this.initNetwork();
//     } else {
//       this.initializeDisplay();
//       this.initializeSimulation();
//     }
//   }

//   initializeDisplay() {
//     // set the data and properties of link lines
//     var svg0 = document.getElementById('svgNetworkPane');
//     svg0.innerHTML = '<g class="links"></g><g class="nodes"></g>';
//     svg0.style.width = this.width + 'px';
//     svg0.style.height = this.height + 'px';
//     this.link = this.svg
//       .append('g')
//       .attr('class', 'links')
//       .selectAll('line')
//       .data(this.graph.links)
//       .enter()
//       .append('line');

//     // set the data and properties of node circles
//     this.node = this.svg
//       .append('g')
//       .attr('class', 'nodes')
//       .selectAll('circle')
//       .data(this.graph.nodes)
//       .enter()
//       .append('circle');
//       // .call(
//       //   this.d3
//       //     .drag()
//       //     .on('start', (d) => {
//       //       if (!this.d3.event.active) this.simulation.alphaTarget(0.3).restart();
//       //       d.fx = d.x;
//       //       d.fy = d.y;
//       //     })
//       //     .on('drag', (d) => {
//       //       d.fx = this.d3.event.x;
//       //       d.fy = this.d3.event.y;
//       //     })
//       //     .on('end', (d) => {
//       //       if (!this.d3.event.active) this.simulation.alphaTarget(0.0001);
//       //       d.fx = null;
//       //       d.fy = null;
//       //     })
//       // );

//     // node tooltip
//     this.node.append('title').text(function (d) {
//       return d.name;
//     });
//     this.node.on('click', (e) => {
//       this.targetNodeClick.emit(e.target.__data__.id);
//     });
//     // visualize the graph
//     this.updateDisplay();
//   }

//   // set up the simulation and event to update locations after each tick
//   initializeSimulation() {
//     this.simulation.nodes(this.graph.nodes);
//     this.initializeForces();
//     this.simulation.on('tick', (_) => {
//       this.link
//         .attr('x1', function (d) {
//           return d.source.x;
//         })
//         .attr('y1', function (d) {
//           return d.source.y;
//         })
//         .attr('x2', function (d) {
//           return d.target.x;
//         })
//         .attr('y2', function (d) {
//           return d.target.y;
//         });

//       this.node
//         .attr('cx', function (d) {
//           return d.x;
//         })
//         .attr('cy', function (d) {
//           return d.y;
//         });
//         this.d3.select('#alpha_value').style(
//         'flex-basis',
//         this.simulation.alpha() * 100 + '%'
//       );
//     });
//   }

//   // update the display based on the forces (but not positions)
//   updateDisplay() {
//     this.node
//       .attr('r', this.forceProperties.collide.radius)
//       .attr('stroke', this.forceProperties.charge.strength > 0 ? 'blue' : 'red')
//       .attr(
//         'stroke-width',
//         this.forceProperties.charge.enabled == 0
//           ? 0
//           : Math.abs(this.forceProperties.charge.strength) / 15
//       )
//       .attr('onmouseover', 'evt.target.setAttribute("r", "10");')
//       .attr('onmouseout', 'evt.target.setAttribute("r", "5");');

//     this.link
//       .attr('stroke-width', this.forceProperties.link.enabled ? 1 : 0.5)
//       .attr('opacity', this.forceProperties.link.enabled ? 1 : 0)
//       .attr('stroke', '#aaa');
//   }

//   initializeForces() {
//     // add forces and associate each with a name
//     this.simulation
//       .force('link', this.d3.forceLink())
//       .force('charge', this.d3.forceManyBody())
//       .force('collide', this.d3.forceCollide())
//       // .force('center', this.d3.forceCenter())
//       .force('forceX', this.d3.forceX())
//       .force('forceY', this.d3.forceY());
//     // apply properties to each of the forces
//     this.updateForces();
//   }

//   updateForces() {
//     // get each force by name and update the properties
//     this.simulation
//       .force('center')
//       .x(this.width * this.forceProperties.center.x)
//       .y(this.height * this.forceProperties.center.y);
//     this.simulation
//       .force('charge')
//       .strength(
//         this.forceProperties.charge.strength *
//           this.forceProperties.charge.enabled
//       )
//       .distanceMin(this.forceProperties.charge.distanceMin)
//       .distanceMax(this.forceProperties.charge.distanceMax);
//     this.simulation
//       .force('collide')
//       .strength(
//         this.forceProperties.collide.strength *
//           this.forceProperties.collide.enabled
//       )
//       .radius(this.forceProperties.collide.radius)
//       .iterations(this.forceProperties.collide.iterations);
//     this.simulation
//       .force('forceX')
//       .strength(
//         this.forceProperties.forceX.strength *
//           this.forceProperties.forceX.enabled
//       )
//       .x(this.width * this.forceProperties.forceX.x);
//     this.simulation
//       .force('forceY')
//       .strength(
//         this.forceProperties.forceY.strength *
//           this.forceProperties.forceY.enabled
//       )
//       .y(this.height * this.forceProperties.forceY.y);
//     this.simulation
//       .force('link')
//       .id(function (d) {
//         return d.id;
//       })
//       .distance(this.forceProperties.link.distance)
//       .iterations(this.forceProperties.link.iterations)
//       .links(this.forceProperties.link.enabled ? this.graph.links : []);

//     // updates ignored until this is run
//     // restarts the simulation (important if simulation has already slowed down)
//     this.simulation.alpha(1).restart();
//   }
//   // convenience function to update everything (run after UI input)
//   updateAll() {
//     this.updateForces();
//     this.updateDisplay();
//   }

//   dragstarted(d) {
//     if (!this.d3.event.active) this.simulation.alphaTarget(0.3).restart();
//     d.fx = d.x;
//     d.fy = d.y;
//   }

//   dragged(d) {}

//   dragended(d) {}
// }
