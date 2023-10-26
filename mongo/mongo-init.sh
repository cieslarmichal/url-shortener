set -e

mongosh <<EOF
var rootUser = '$MONGO_DATABASE_ROOT_USERNAME';
var rootPassword = '$MONGO_DATABASE_ROOT_PASSWORD';

var admin = db.getSiblingDB('admin');

admin.auth(rootUser, rootPassword);

var databaseName = '$MONGO_DATABASE_NAME';

var applicationDatabase = db.getSiblingDB(databaseName);

var username = '$MONGO_DATABASE_USERNAME';
var password = '$MONGO_DATABASE_PASSWORD';

applicationDatabase.createUser({ user: username, pwd: password, roles: [
       { role: "userAdminAnyDatabase", db: "admin" },
       { role: "readWriteAnyDatabase", db: "admin" }
     ] });
EOF
