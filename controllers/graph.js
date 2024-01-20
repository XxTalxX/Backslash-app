const fileReader = require('../util/filereader');
const applyFilters = require('../util/filters');



exports.getIndex = (req, res, next) => {
    let nodeFilter = [];
    let edgeFilter = [];
    const filters = req.query.filter ? req.query.filter.split(',') : [];
    [nodeFilter, edgeFilter] = applyFilters.applyFilters(filters);
    nodeFilter = nodeFilter.length < 1 ? fileReader.nodes : nodeFilter;
    edgeFilter = edgeFilter.length < 1 ? fileReader.links : edgeFilter;
    return res.render('index', {
        pageTitle: "Graph",
        path: '/',
        nodes: nodeFilter,
        links: edgeFilter
    });
}

exports.postSubmit = (req, res, next) => {
    const selectedOptions = req.body.options;
    res.redirect("/?filter=" + [selectedOptions]); 
}