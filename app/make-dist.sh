#!/usr/bin/env bash
# Assemble the folder that gets hosted for the practice session.
#
#   bash app/make-dist.sh
#
# WHY THIS EXISTS, AND WHY IT IS NOT "PUBLISH THE REPO".
# This repository contains the real first names of seven colleagues, an
# assessment of each of them, a note that one is a dropout risk, a note that one
# is Vikrant's brother, and which arm every person is in. GitHub Pages on a free
# account serves from a PUBLIC repository. Publishing this repo to host one HTML
# file would put all of that on the open web under their real names.
#
# So only the app ships. Six files, nothing else — no tests, no logs, no
# screener data, no participant mapping.
set -euo pipefail
cd "$(dirname "$0")/.."

DIST="app/dist"
# Clear it if we can, then overwrite. The delete is best-effort because a Cowork
# session cannot remove files in a connected folder; cp overwrites regardless, so
# the build is correct either way.
rm -rf "$DIST" 2>/dev/null || true
mkdir -p "$DIST"

# The page, plus every local file its own <script src=> tags ask for.
#
# Read out of index.html rather than listed here. The hand-written list missed
# grade-rule.js the day it was added, which would have hosted an app that loaded
# and then threw on the first Run, because GRADE was undefined. A list of
# dependencies maintained by hand next to the real one drifts; this cannot.
cp "app/index.html" "$DIST/index.html"

deps=$(grep -o '<script src="[^"]*"' app/index.html | sed 's/.*src="//;s/"//' | grep -v '^https\?://')
if [ -z "$deps" ]; then echo "no local scripts found in index.html — check the build"; exit 1; fi
for f in $deps; do
  if [ ! -f "app/$f" ]; then echo "index.html loads $f, which does not exist in app/"; exit 1; fi
  cp "app/$f" "$DIST/$f"
done

echo "built $DIST"
ls -1 "$DIST" | sed 's/^/  /'

# The page carries participant CODES and arms, which is intended — they say
# nothing without the mapping. A NAME would say everything, so fail loudly.
leaked=0
for name in nabin gaurav ritesh anuj vikash manish rishabh; do
  if grep -riq "$name" "$DIST"; then echo "LEAK: '$name' appears in $DIST"; leaked=1; fi
done
if [ "$leaked" = 1 ]; then echo; echo "REFUSING — a participant name is in the files to be hosted."; exit 1; fi
echo "  no participant names in the hosted files"

if grep -rqE '\bH(0[1-9]|1[0-2])\b' "$DIST"; then
  echo "LEAK: a held-out item id is in the hosted files — it would be burned for the removal test"; exit 1
fi
echo "  no held-out question ids"

# Ask the module what URL it resolved, rather than pattern-matching the source.
# The grep version matched one exact spelling and silently reported nothing when
# an editor reformatted the line onto two lines with double quotes — the one
# case where a missing warning matters.
hinturl=$(node -e "process.stdout.write(require('./$DIST/transport.js').url || '')" 2>/dev/null || true)
if [ -z "$hinturl" ]; then
  echo
  echo "  NOTE: transport.js has no hint URL set, so every hint will be the"
  echo "  hand-written fallback. See supabase/README.md before you host this."
else
  echo
  echo "  hint URL: $hinturl"
  echo "  A URL being set is not the same as it working — an undeployed or"
  echo "  unauthorised function fails silently into the fallback. Confirm with:"
  echo "    node evals/check-hint-function.mjs $hinturl"
fi
