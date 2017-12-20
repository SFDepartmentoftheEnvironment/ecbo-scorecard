# ecbo-scorecard

This dashboard is a way to show building owners and property managers their building's performance in comparison to other buildings in San Francisco of similar use case and size.  Building owners report data about their building to comply with the [Existing Commercial Buildings Ordinance](https://sfenvironment.org/article/san-franciscos-existing-commercial-buildings-ordinance). The data for this dashboard is drawn directly from [DataSF](https://data.sfgov.org/Energy-and-Environment/Existing-Commercial-Buildings-Energy-Performance-O/j2j3-acqj).

This project is part of [Data Science Working Group at Code for San Francisco](https://github.com/sfbrigade/data-science-wg), a group of volunteers who work on civic tech projects to benefit the community.  The original repo for this project can be found [here](https://github.com/sfbrigade/datasci-SF-Environment-Benchmark).

### Authors from the DSWG
- [Tyler Field](https://github.com/thfield)
- [Anna Kiefer](https://github.com/askiefer)
- [Eric Youngson](https://github.com/eayoungs)
- Juliana Vislova
- [Peter W](https://github.com/techieshark)
- [Sanat Moningi](https://github.com/smoningi)
- [Geoffrey Pay](https://github.com/geoffnet)

## Built With
- [Webpack](https://webpack.github.io/)
- [D3](https://d3js.org/) v3
- [Soda.js](https://github.com/socrata/soda-js)
- [jQuery](https://jquery.com/)
- [Bootstrap](https://getbootstrap.com) v3
- [Font Awesome](http://fontawesome.io/)

## Getting Started

Here's how to get started contributing:  

[Fork this repo](https://help.github.com/articles/fork-a-repo/), then clone your repo locally
```
$ git clone <this-repo> <your-repo-name>
$ cd <your-repo-name>
$ git remote add upstream <this-repo>
```
Create a feature branch:
```
$ git checkout -b <feature-branch>
```
Do some work:  
```
$ vim <some-files>
```
When you're ready, commit, [merge any upstream changes](https://help.github.com/articles/merging-an-upstream-repository-into-your-fork/), [deal with conflicts](https://help.github.com/articles/resolving-a-merge-conflict-from-the-command-line/), and push your branch ([aka, forking workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow))   
```
$ git add <some-files>
$ git commit -m 'my awesome feature'
$ git pull upstream master
  # solve conflicts
$ git push
```
[Create a Pull Request](https://help.github.com/articles/creating-a-pull-request/) from your pushed branch (compare branch) to this repo (base branch)   


### Working on the dashboard component:  
Install dependencies:
```
$ npm install
```

#### Develop
Use Webpack to launch a server and watch files for changes:
```
$ npm run start
```

Use Webpack to watch files, but not run a server:
```
$ npm run watch
```

#### Deploy
Use Webpack to bundle files for production site:
```
$ npm run build
```
Now the files in `dist/` are all you need to copy to a production server.


## Notes
The live data is pulled from [DataSF](https://data.sfgov.org/Energy-and-Environment/Existing-Commercial-Buildings-Energy-Performance-O/j2j3-acqj/data) using the function `Dashboard.startQuery()`.  

Buildings are identified using Assessor Parcel Numbers (APNs).  The requested APN is read from url params with the function `helpers.getUrlVars()`.  The AJAX request to DataSF is made using `apiCalls.propertyQuery()`, which is a wrapper around the [soda-js](https://github.com/socrata/soda-js) library.

If the APN doesn't exist, the page gives the error message "The record for the chosen building was not found".

If a requested property is of an unsupported use type (supported building types are "Office", "Hotel", or "Retail Store"), the page displays the message "The chosen building type is not supported by this dashboard interface".  Supported building types are defined as keys in the `Dashboard.groups` object.

If a building doesn't have data for the latest year, the page will show the data for the latest year available.

If a building has *never* complied, the page will display a message saying "{BUILDING NAME} could not be ranked against other {BUILDING TYPE}s using the latest benchmark data."

The code in `src/js/` is roughly split into modules by function:
- dashboard.js: form query, make request, handle data, update page.
- apiCalls.js: wrapper around the soda-js library and helper functions for constructing query strings
- dataManipulation.js: functions to manipulate and parse the query response from DataSF
- helpers.js: miscellaneous helper functions

javascript files for individual pages (estar, ghg, eui) in `src` set options and functions that are unique to each page
