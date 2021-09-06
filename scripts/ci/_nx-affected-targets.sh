#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck disable=SC1091
source "$DIR"/_common.sh
export HEAD=${HEAD:-HEAD}
export BASE=${BASE:-main}
# This is a helper script to find NX affected projects for a specific target

AFFECTED_ALL=${AFFECTED_ALL:-} # Could be used for forcing all projects to be affected (set or create `secret` in GitHub with the name of this variable set to the name of the branch that should be affected, prefixed with the magic string `7913-`)
BRANCH=${BRANCH:-$GITHUB_HEAD_REF}
if [[ -n "$BRANCH" && -n "$AFFECTED_ALL" && "$AFFECTED_ALL" == "7913-$BRANCH" ]]
then
  AFFECTED_FLAGS=(--all)
else
  AFFECTED_FLAGS=(--head="$HEAD" --base="$BASE")
fi

npx \
  nx print-affected --target="$1" --select=tasks.target.project "${AFFECTED_FLAGS[@]}"
