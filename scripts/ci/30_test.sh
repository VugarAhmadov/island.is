#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/_common.sh

RUNNER=test-runner
APP_HOME=`cat $PROJECT_ROOT/workspace.json | jq ".projects[\"$APP\"].root" -r`

# Checking if we should simple run the test runner container or should we use a docker-compose setup
if [ -f $PROJECT_ROOT/$APP_HOME/docker-compose.ci.yml ]; then
  COMPOSE_FILES="-f $PROJECT_ROOT/$APP_HOME/docker-compose.ci.yml"

  if [ -f $PROJECT_ROOT/$APP_HOME/docker-compose.base.yml ]; then
    COMPOSE_FILES="-f $PROJECT_ROOT/$APP_HOME/docker-compose.base.yml $COMPOSE_FILES"
  fi
  # Cleanup after the test
  clean_up () {
    if [ "$1" != "0" ]; then
      docker-compose -p test-$APP $COMPOSE_FILES rm -s -f
      echo "Cleanup result for $APP is $? and exit code is $1"
      exit $1
    fi
  }
  trap 'clean_up $? $LINENO' EXIT

  # Create folder for terminlaOutputs in case they're created by docker
  mkdir -p .cache/nx/terminalOutputs/

  # Running the tests using docker-compose
  docker-compose -p test-$APP $COMPOSE_FILES run --rm sut
else
  # Standalone execution of tests when no external dependencies are needed (DBs, queues, etc.)
  exec yarn run \
    test ${APP} --runInBand
fi
