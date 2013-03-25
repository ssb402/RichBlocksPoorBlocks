Rich Blocks, Poor Blocks v1.2
=============================

## What is this? ##

This repository contains code currently used on the website [Rich Blocks, Poor Blocks](http://www.RichBlocksPoorBlocks.com).

The live code is on the 'master' branch. It is minified.

If you'd like to fork this project, check the ['develop'](https://github.com/myprogprojects/RichBlocksPoorBlocks/tree/develop) branch for non-minified code.


## Forking guidelines ##

If you think you can make [RichBlocksPoorBlocks.com](http://www.RichBlocksPoorBlocks.com) even better than it currently is, then fork the ['develop'](https://github.com/myprogprojects/RichBlocksPoorBlocks/tree/develop) branch and prove it. 

If you do fork the 'develop' branch, please name your repo 'feature_{YOUR_IDEA_HERE}'. That way, it'll be easier for everyone to keep track of what everyone else is doing.

If your idea rocks, your idea will be merged into the 'develop' branch and you'll get credit on the homepage as well as a link back to your site (or blog, or social media page, or whatever else).

If you want to help work on a feature already in development, then you're best off forking a repo that has forked the 'develop' branch.

Please do NOT fork the 'master' branch or any of the 'hotfix' or 'release' branches. The 'master' branch is where code goes when it's stable and meant for people to download and run. 'Hotfix' and 'release' branches are only meant to be temporary -- the former to fix urgent problems quickly, and the latter meant for final minor edits to the script before being merged with the 'master' branch.

For more info on Git branching practices, check [this article](http://nvie.com/posts/a-successful-git-branching-model/) on Git workflow.


## Programs and languages used to make this ##

- HTML, CSS, JavaScript, and Google Fusion Tables.
- JavaScript libraries: [jQuery](http://jquery.com/), [Google Maps JavaScript API v3](https://developers.google.com/maps/documentation/javascript/), and [accounting.js](http://josscrowcroft.github.com/accounting.js/).

Each state map used on the site was made in Google Fusion Tables.


## Site features ##

- Maps for median income and median rent for each U.S. Census Tract.
- Map embiggener button.
- Colorblind mode.


## Data source(s) ##

All median income and median rent data come from the U.S. Census' 2007-2011 American Community Survey.


## Contact ##

Questions? Email RichBlocksPoorBlocks@gmail.com, tweet [@RichBlocksPoorB](http://www.Twitter.com/RichBlocksPoorB), or tweet site creator Chris Persaud at [@ChrisMPersaud](http://www.Twitter.com/ChrisMPersaud).


## Version History ##

- v1.2: Edited 'main.js' so that if a user changes the map type then clicks 'Search' without changing the address and state, then the map layer, infobox and legend will change without the map re-zooming and re-centering itself.
- v1.1.1: Edited the 'Change Map Size' button to work properly on Google Chrome.
- v1.1: Added the 'Change Map Size' button.
- v1.0: Initial commit.