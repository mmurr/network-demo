import { Component, OnInit, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Node, Link, NetworkData, SearchTerms, NetworkTerms, NetworkSearchData } from "../models";

@Component({
  selector: "app-network-ui",
  templateUrl: "./network-ui.component.html",
  styleUrls: ["./network-ui.component.css"],
})
export class NetworkUIComponent implements OnInit {
  fullGraph: NetworkData;
  subgraph: NetworkData;
  sd: NetworkSearchData;
  dataLoaded: boolean;
  api: HttpClient;
  base: string;
  searchFilters: SearchTerms;
  networkFilters: NetworkTerms;
  nodeVariants: Set<string>;
  linkVariants: Set<string>;
  searchResults: Node[];


  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.api = http;
    this.base = baseUrl;
    this.api.get<NetworkData>(this.base + 'networkgraph').subscribe(
      (result) => {
        this.fullGraph = result;
        // re-add these lines to pass variants to child components for autocomplete
        // result.nodes.map(_ => _.variants.forEach(_ => this.nodeVariants.add(_)));
        // result.links.map(_ => _.variants.forEach(_ => this.linkVariants.add(_)));
        // this.sd.nodeVariants = Array.from(this.nodeVariants);
        // this.sd.linkVariants = Array.from(this.linkVariants);
        this.subgraph = this.applyFilters(this.fullGraph);
        this.dataLoaded = true;
      },
      (error) => console.error(error)
    );
  }

  ngOnInit() {
    // empty objects to pass to the child components until the data arrives
    this.fullGraph = {
      nodes: [],
      links: []
    };
    this.nodeVariants = new Set();
    this.linkVariants = new Set();
    this.subgraph = this.fullGraph;
    this.sd = new NetworkSearchData();
    this.networkFilters = {
      degrees: 1,
      qVal: 0,
      sigCom: true,
      egoNetwork: false,
      communities: new Set(),
      variants: new Set(),
      sharedVariants: new Set()
    };
    this.searchFilters = {text: ''};
    this.searchResults = [];
  }


  onTargetNodeChange(event) {
    // The user changed to a new target node (can be triggered by either UI)
    this.sd.focusedNodeID = event;
    this.sd.focusedNode = this.fullGraph.nodes.find(_ => _.id === event);
    this.buildSubgraph();

    // re-add these lines to pass variants to child components for autocomplete
    // this.nodeVariants = new Set();
    // this.subgraph.nodes.map(_ => _.variants.forEach(_ => this.nodeVariants.add(_)));
    // this.linkVariants = new Set()
    // this.subgraph.links.map(_ => _.variants.forEach(_ => this.linkVariants.add(_)));
  }

  onNetworkTermsChanged(event: NetworkTerms) {
    this.networkFilters = event;
    this.buildSubgraph();
  }


  buildSubgraph() {
    // if we aren't focused on a node, just apply the general filters
    // if we are, fill out the correct number of degrees from the target, then apply filters
    // the split between buildSubgraph and applyFilters made more sense with the
    let newLinks = [];
    let i: number;
    if (!this.sd.focusedNodeID || this.sd.focusedNodeID === 'none') {
      this.subgraph = this.applyFilters({
        nodes: this.fullGraph.nodes,
        links: this.fullGraph.links});
    } else {
      // add focused node, add its links, and the nodes for those links, repeat
      const newNodeSet = new Set();
      newNodeSet.add(this.sd.focusedNodeID);
      for (i = 0; i < this.networkFilters.degrees; i++) {
        newLinks = newLinks.concat(
          this.fullGraph.links.filter(
            (_) => newNodeSet.has(_.target) || newNodeSet.has(_.source)
          )
        );

        newLinks.forEach(_ => newNodeSet.add(_.source).add(_.target));

        if (this.networkFilters.egoNetwork) {
          // we build the an ego network by adding an additional set of links
          // to a first neighbors network
          newLinks = newLinks.concat(
            this.fullGraph.links.filter(
              (_) => newNodeSet.has(_.target) || newNodeSet.has(_.source)
            )
          );
          break;
        }
      }
      const newLinksSet = new Set(newLinks);
      const tempNetwork = {
        links: Array.from(newLinksSet),
        nodes: this.fullGraph.nodes.filter(_ => newNodeSet.has(_.id)),
      };
      this.subgraph = this.applyFilters(tempNetwork);
    }
  }

  onSearchTermsChanged(event: SearchTerms) {
    // The original network data used for this allowed us to do more robust search filtering
    // now this just represents the search text changing
    this.searchResults = this.subgraph.nodes.filter(_ => _.id.indexOf(event.text) > -1);
  }

  applyFilters(network: NetworkData) {
    // Pass the network filters chosed by the user to the network component
    network.links = network.links.filter(_ =>
      (!this.networkFilters.qVal || _.q_value >= this.networkFilters.qVal) &&
      (!(this.networkFilters.sharedVariants && this.networkFilters.sharedVariants.size)
        || _.variants.some(_ => this.networkFilters.sharedVariants.has(_))));

    network.nodes = network.nodes.filter(_ =>
      (!(this.networkFilters.variants && this.networkFilters.variants.size)
        || _.variants.some(_ => this.networkFilters.variants.has(_))) &&
      (!this.networkFilters.sigCom || _.qstest_community_sig) &&
      (!(this.networkFilters.communities && this.networkFilters.communities.size)
        || this.networkFilters.communities.has(_.community)));

    // The network filters are applied, but we want to trim all nodes unconnected to edges
    const linkIDs = new Set();
    network.links.forEach(_ => {linkIDs.add(_.source).add(_.target); });
    const nodeSet = new Set(network.nodes.map(_ => linkIDs.has(_.id) ? _.id : null));
    // we could still have dangling links
    network.links = network.links.filter(_ => nodeSet.has(_.source) && nodeSet.has(_.target));
    return network;
  }
}
