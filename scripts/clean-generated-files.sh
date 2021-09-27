#!/bin/bash

# This script remove alltogether files and folder that are generated by yarn schemas command

find . -type f \(\
  -name "openapi.yaml" \
  -o -name "api.graphql" \
  -o -name "schema.d.ts" \
  -o -name "schema.tsx" \
  -o -name "schema.ts" \
  -o -path "*/gen/graphql.ts" \
  -o -name "possibleTypes.json" \
  -o -name "fragmentTypes.json" \
\) -delete

find . -type d \(\
  -path "*/gen/fetch" \
\) -exec rm -rf '{}' +
