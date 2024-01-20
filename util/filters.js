const fileReader = require('./filereader');

function exposedFilter() {
    const nodeFilter = fileReader.nodes.filter((node) => node.publicExposed === true);
    const edgeFilter = fileReader.links.filter((edge) => {
        return nodeFilter.some((node) => {
          return node.id === edge.source;
        });
    });
    edgeFilter.forEach((edge) => {
       const index = nodeFilter.findIndex((node) => node.id === edge.target);
       if(index === -1) {
        const nodeElement = fileReader.nodes.find(n => n.id === edge.target);
        nodeFilter.push(nodeElement);
       }
    });
    return [nodeFilter, edgeFilter];
}

function sinkFilter() {
    const sinkIds = [];
    fileReader.nodes.filter((node) => {
        if(node.kind === 'sqs' || node.kind === 'rds') {
            sinkIds.push(node.id);
        }
    });

    const edgeSources = [];
    fileReader.links.filter((edge) => {
        if(sinkIds.includes(edge.target)) {
            fileReader.links.filter((source) => {
                 if(edge.source === source.source)
                 { 
                    edgeSources.push(source);
                 }
            });
        }
    });

    const edgeFilter = [];
    const elementsPerSource = {};
    
    for (const item of edgeSources) {
        if (!elementsPerSource[item.source]) {
        elementsPerSource[item.source] = []; // Initialize array for new source
        }
        elementsPerSource[item.source].push(item); // Store all elements for each source
    
        if (item.target === 44 || item.target === 45) {
            edgeFilter.push(...elementsPerSource[item.source]); // Add all leading elements
        delete elementsPerSource[item.source]; // Clear for future occurrences
        }
    }   
    const nodeFilter = [];
    fileReader.nodes.filter((node) => {
        return edgeFilter.forEach((edge) => {
            if(!nodeFilter.includes(node)) {
                if(node.id === edge.source || node.id === edge.target) {
                    nodeFilter.push(node);
                }
            }
        });
    });

    return [nodeFilter, edgeFilter];
}

function vulnerabilitiesFilter() {

    const nodeFilter = fileReader.nodes.filter((node) => node.hasOwnProperty('vulnerabilities'));
    const edgeFilter = fileReader.links.filter((edge) => {
        return nodeFilter.some((node) => {
          return (node.id === edge.source || node.id === edge.target)
        });
    });
    edgeFilter.forEach((edge) => {
       const targetIndex = nodeFilter.findIndex((node) => node.id === edge.target);
       const sourceIndex = nodeFilter.findIndex((node) => node.id === edge.source);
       if(targetIndex === -1) {
        const nodeElement = fileReader.nodes.find(n => n.id === edge.target);
        nodeFilter.push(nodeElement);
       }
       if(sourceIndex === -1) {
        const nodeElement = fileReader.nodes.find(n => n.id === edge.source);
        nodeFilter.push(nodeElement);
       }
    });

    return [nodeFilter, edgeFilter];
}

function applyFilters(filters) {
    let nodeFilter = [];
    let edgeFilter = [];

    const merge = (a, b, predicate = (a, b) => a === b) => {
        const c = [...a]; // copy to avoid side effects
        // add all items from B to copy C if they're not already present
        b.forEach((bItem) => (c.some((cItem) => predicate(bItem, cItem)) ? null : c.push(bItem)))
        return c;
    }

    for (let filter of filters) {
        switch(filter) {
            case 'exposed':
                nodeFilter = merge(nodeFilter, exposedFilter()[0], (a, b) => a.id === b.id);
                edgeFilter = [...edgeFilter, ...exposedFilter()[1]];
                break;
            case 'sink':
                nodeFilter = merge(nodeFilter, sinkFilter()[0], (a, b) => a.id === b.id);
                edgeFilter = [...edgeFilter, ...sinkFilter()[1]];
                break;
            case 'vulnerable':
                nodeFilter = merge(nodeFilter, vulnerabilitiesFilter()[0], (a, b) => a.id === b.id);
                edgeFilter = [...edgeFilter, ...vulnerabilitiesFilter()[1]];
                break;
        }
    }

    return [nodeFilter, edgeFilter];

}

exports.applyFilters = applyFilters;