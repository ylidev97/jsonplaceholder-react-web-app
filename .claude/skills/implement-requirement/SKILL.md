---
name: implement-requirement
description: Implements a requirement from docs/SPEC.md (e.g. R1) following the project workflow.
---
Implement requirement $ARGUMENTS from docs/SPEC.md:
1. Read the requirement and its acceptance criteria. If anything is ambiguous, ask first.
2. Show a short plan (files to create/modify) and wait for my OK.
3. Implement only that requirement.
4. If it has an acceptance criterion (CA), write its test named "CAx: ...".
5. Run `npm test`, `npm run lint` and `npx tsc -b`.
6. Summarize what you changed and suggest a commit message. Do not commit.