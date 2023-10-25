set -e

mongosh <<EOF
use admin

db.auth('root', 'root');

use url-shortener

db.createUser({ user: 'local', pwd: 'local', roles: [
       { role: "userAdminAnyDatabase", db: "admin" },
       { role: "readWriteAnyDatabase", db: "admin" }
     ] });
EOF
