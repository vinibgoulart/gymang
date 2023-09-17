---
to: packages/<%= package %>/package.json
sh: "/bin/sh ./_templates/package/new/init-package.sh <%= package %>"
force: true
---
