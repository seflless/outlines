#!/bin/bash

# Make a copy of the src files for use on the github pages
echo "   Copying src to docs/dist..."
rm -rf docs/dist
mkdir -p docs/dist
cp src/outlines.js docs/dist/
cp src/Unistroke.js docs/dist/
echo "   Copying graphviz library to to docs/dist..."
cp node_modules/viz.js/viz.js docs/dist/
echo "   Done."
