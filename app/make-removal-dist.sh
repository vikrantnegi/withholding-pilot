#!/usr/bin/env bash
# Assemble the folder that gets hosted for the removal test (session 2).
#
#   bash app/make-removal-dist.sh
#
# A SEPARATE SITE FROM PRACTICE, ON PURPOSE. The practice URL must never serve a
# held-out item, and make-dist.sh refuses to build if one appears. So the
# removal page goes to its own Netlify Drop site, from its own folder.
#
# Two files only: the page and grade-rule.js, the same grader practice used.
# No help modules, no hint URL, no tests, no logs, no participant mapping.
set -euo pipefail
cd "$(dirname "$0")/.."

python3 study-questions/mkremoval.py      # regenerate from index.html every time

DIST="app/dist-removal"
rm -rf "$DIST" 2>/dev/null || true
mkdir -p "$DIST"
cp app/removal.html "$DIST/index.html"
cp app/grade-rule.js "$DIST/grade-rule.js"

deps=$(grep -o '<script src="[^"]*"' "$DIST/index.html" | sed 's/.*src="//;s/"//' | grep -v '^https\?://')
if [ "$deps" != "grade-rule.js" ]; then
  echo "REFUSING — the removal page loads local scripts other than grade-rule.js:"; echo "$deps"; exit 1
fi

echo "built $DIST"; ls -1 "$DIST" | sed 's/^/  /'

leaked=0
for name in nabin gaurav ritesh anuj vikash manish rishabh; do
  if grep -riq "$name" "$DIST"; then echo "LEAK: '$name' appears in $DIST"; leaked=1; fi
done
[ "$leaked" = 1 ] && { echo "REFUSING — a participant name is in the files to be hosted."; exit 1; }
echo "  no participant names"

if grep -qiE 'helpQ|help-session|hint-writer|transport\.js|supabase|groq' "$DIST/index.html"; then
  echo "REFUSING — a help path survived in the removal page"; exit 1
fi
echo "  no help path"

ids=$(grep -o 'id:"[A-Z][0-9]*"' "$DIST/index.html" | sed 's/id:"//;s/"//' | tr '\n' ' ')
if [ "$ids" != "H01 H02 H03 H04 H05 H06 H07 H08 H09 H10 H11 H12 " ]; then
  echo "REFUSING — question ids are not exactly H01-H12: $ids"; exit 1
fi
echo "  questions: exactly H01-H12"

echo
echo "  Host $DIST on its OWN Netlify Drop site (netlify.com/drop), never on the"
echo "  practice site. Check it with ?arm=A, never a participant link: loading"
echo "  one starts that person's session. Headless check: evals/verify-removal.mjs"
