# README

This is the code that generates the full https://gekko.wizb.it/ website.

NOTE: all documentation is actually stored in markdown format [inside the gekko repo](https://github.com/askmike/gekko/tree/stable/docs). This code merely parses all documentation and turns it into a simple website.

# USAGE

Make sure you cloned the gekko repo as a sibling to this folder, eg.:

    /projects
      /gekko
      /gekko.wizb.it

Go into this repo and run node build:

    cd gekko.wizb.it
    node build

And `/site` now contains the full website.
