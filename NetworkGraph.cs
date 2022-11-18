using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace cipher_demo
{
    public class NetworkGraph
    {
        public List<Node> Nodes { get; set; }

        public List<Link> Links { get; set; }
    }


    public class Node
    {
        [JsonPropertyName("id")]
        public string ID { get; set; }

        [JsonPropertyName("color")]
        public string Color { get; set; }

        [JsonPropertyName("size")]
        public float Size { get; set; }

        [JsonPropertyName("x")]
        public float X { get; set; }

        [JsonPropertyName("y")]
        public float Y { get; set; }

        [JsonPropertyName("community")]
        public int Community { get; set; }

        [JsonPropertyName("qstest_community_sig")]
        public bool SigCommunity { get; set; }

        [JsonPropertyName("variants")]
        public string[] Variants { get; set; }

        [JsonPropertyName("parent")]
        public string Category { get; set; }
    }


    public class Link
    {
        [JsonPropertyName("source")]
        public String Source { get; set; }
        
        [JsonPropertyName("target")]
        public String Target { get; set; }

        [JsonPropertyName("value")]
        public float Weight { get; set; }

        [JsonPropertyName("q_value")]
        public float QValue { get; set; }

        [JsonPropertyName("color")]
        public string Color { get; set; }
        
        [JsonPropertyName("shared_comm")]
        public bool SharedCommunity { get; set; }

        [JsonPropertyName("shared_variants")]
        public string[] Variants { get; set; }
    }


    public class NetworkRequest
    {
        // Not currently used for anything
        public NetworkRequest()
        {        }
        
        
        public string SearchTerm { get; set; }

        public string PinnedNodeID { get; set; }

    }    

}
