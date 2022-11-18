import json


# Opening JSON file
f = open('GWAS_disease_network_08NOV2021.json','r')
   
# returns JSON object as 
# a dictionary
data = json.load(f)
f.close()
   
n = json.dumps(data['nodes'])
f = open('subnet-test-nodes.json', 'w')
f.write(n)
f.close

def comm(n):
    return data[n]['community']

for l in data['links']:
    s = l['source']
    t = l['target']
    data['links'][l]['inner-edge'] = comm(s) == comm(t)


n = json.dumps(data['links'])
f = open('subnet-test-links.json', 'w')
f.write(n)
f.close

