using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.IO;

namespace cipher_demo.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NetworkGraphController : ControllerBase
    {
        private readonly ILogger<NetworkGraphController> _logger;

        private NetworkGraph StoredJSON;

        public NetworkGraphController(ILogger<NetworkGraphController> logger)
        {
            _logger = logger;

            StoredJSON = new NetworkGraph();

            string json;

            using (StreamReader r = new StreamReader("subnet-test-nodes.json"))
            {
                json = r.ReadToEnd();
                List<Node> nodes = JsonSerializer.Deserialize<List<Node>>(json);
                StoredJSON.Nodes = nodes;
            }

            using (StreamReader r = new StreamReader("subnet-test-links.json"))
            {
                json = r.ReadToEnd();
                List<Link> links = JsonSerializer.Deserialize<List<Link>>(json);
                StoredJSON.Links = links;
            }
        }

        [HttpGet]
        public NetworkGraph Get()
        {
            NetworkRequest req = new NetworkRequest();
            return this.StoredJSON;
        }

        [HttpGet("get/{terms}/{pinnedNode}")]
        public NetworkGraph Get(string terms, string pinnedNode)
        {
            NetworkRequest req = new NetworkRequest();
            req.SearchTerm = terms;
            req.PinnedNodeID = pinnedNode;
            return CreateSubnetwork(req);
        }

        private NetworkGraph CreateSubnetwork(NetworkRequest req)
        {
            NetworkGraph res = new NetworkGraph();
            HashSet<string> nodes = new HashSet<string>();
            HashSet<Link> newLinks = new HashSet<Link>();

            if (!String.IsNullOrEmpty(req.SearchTerm))
            {
                nodes.UnionWith(StoredJSON.Nodes
                        .Where(_ => _.ID.Contains(req.SearchTerm) || _.Category.Contains(req.SearchTerm))
                        .Select(_ => _.ID));
            }

            if (String.IsNullOrEmpty(req.PinnedNodeID) || req.PinnedNodeID == "none")
            {
                Random r = new Random();
                int i = 0;
                while (nodes.Count < 15)
                {
                    i = r.Next(StoredJSON.Nodes.Count);
                    nodes.Add(StoredJSON.Nodes[i].ID);
                }
            } else {
                nodes.Add(req.PinnedNodeID);
            }

            for (int i = 0; i < 4; i++)
            {
                newLinks.UnionWith(StoredJSON.Links.Where(_ => nodes.Contains(_.Source) || nodes.Contains(_.Target)).ToHashSet());

                nodes.UnionWith(newLinks.Select(_ => _.Source));
                nodes.UnionWith(newLinks.Select(_ => _.Target));
            }
            res.Nodes = StoredJSON.Nodes
                        .Where(_ => nodes.Contains(_.ID)).ToList();
            nodes = res.Nodes.Select(_ => _.ID).ToHashSet();
            res.Links = newLinks.Where(_ => nodes.Contains(_.Source) && nodes.Contains(_.Target)).ToList();

            return res;
        }
    }
}
