# README

This is the code that generates the full https://gekko.wizb.it/ website.

NOTE: all documentation is actually stored in markdown format [inside the gekko repo](https://github.com/askmike/gekko/tree/stable/docs). This code merely parses all documentation and turns it into a simple website.

# USAGE

Make sure you cloned the gekko repo as a sibling to this folder, eg.:

    /projects
      /gekko
      /gekko.wizb.it

If you are adding a new folder (new section on the left hand side menu), change `build.js` to include your section into `dirs` variable

Go into this repo and run node build:

    cd gekko.wizb.it
    npm install 
    node build

And `/site` now contains the full website.

# Running the site locally

At the top folder `gekko.wizb.it`, run command `./node_modules/http-server/bin/http-server site`
