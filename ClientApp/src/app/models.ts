export class Node {
  id: string;
  color: string;
  category: string;
  size: number;
  // x: number;
  // y: number;
  community: number;
  sigCommunity: boolean;
  qstest_community_sig: boolean; // [TODO]: name mapping wrong? not sure why
  variants: string[];
}
export class Link {
  source: string;
  target: string;
  value: number;
  q_value: number;
  color: string;
  shared_comm: boolean;
  variants: string[];
}
export interface NetworkData {
  nodes: Node[];
  links: Link[];
}

export class SearchTerms {
  text: string;
}

export class NetworkTerms {
  degrees: number;
  qVal: number;
  sigCom: boolean;
  egoNetwork: boolean;
  communities: Set<number>;
  variants: Set<string>;
  sharedVariants: Set<string>;
}

export class NetworkSearchData {
  // The idea of passing the variants/communities here was to make them available
  // for an autocomplete/multiselect search. I couldn't make the UX for that
  // work well, so I abandoned it
  focusedNode: Node;
  focusedNodeID: string;
  nodeVariants: Set<string>;
  linkVariants: Set<string>;
  networkCommunities: Set<number>;
}
