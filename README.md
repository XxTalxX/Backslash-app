Project runs on port 5000, NodeJS, Run 'npm install' and then run 'npm start' or 'npm run start:dev'

Used d3.js to visualize the graph, used checkboxes to allow multiple combinations of filtering.
I left the API as thin as possible, all the filtering and graphing work is done by helper functions.
filereader.js - will read the json file and parse the data to fit d3.js force directed graph requirements,
This logic will continue to apply through-out the filtering process to allow correct linking in the front.

The approach taken regarding filtering - to do all the work outside the controllers to allow flexibility in adding new filters,
the logic will be implemented on filters.js and there will be no need to modify graph.js controller at all.