The library provide smart helpers for standard operations integrated with PostgreSQL.

# Initialization

```javascript
require('sql-pg-helper')({ client })
```

:warning: If the client is restricted by using [sql-pg-restrict](https://www.npmjs.com/package/sql-pg-restrict) it's needed to add the restricted `sql` tag to the initialization:

```javascript
const sql = require('sql-pg-restrict')
sql.restrict(client)
require('sql-pg-helper')({ client, sql })
```

# Examples

## SELECT

The return value is `result.rows` of the pg result object.

### All columns

```javascript
const rows = await client.select(
  'users',
  { email: 'email', passwordhash: 'passwordhash' }
)

// text: SELECT "*" FROM "users" WHERE "email" = $1 AND "passwordhash" = $2
// parameters: ['email', 'passwordhash']
```

### Only the list of the given columns

```javascript
const rows = await client.select(
  'users',
  ['id', 'active'],
  { email: 'email', passwordhash: 'passwordhash' }
)

// text: SELECT "id", "active" FROM "users" WHERE "email" = $1 AND "passwordhash" = $2
// parameters: ['email', 'passwordhash']
```

## INSERT

### Single row (rows is an object)

The return value is the SERIAL generated by inserting the new row located in `result.rows[0][serialColumn = 'id']` of the pg result object.

```javascript
const id = await client.insert(
  'users',
  { email: 'email', passwordhash: 'passwordhash' }
)

// text: INSERT INTO "users" ("email", "passwordhash") VALUES ($1, $2) RETURNING "id"
// parameters: ['email', 'passwordhash']
```

### Multiple rows (rows is an array of objects)

The return value is an array of the SERIALs generated by inserting the new row located in `result.rows[][serialColumn = 'id']` of the pg result object.

```javascript
const ids = await client.insert(
  'users',
  [
    { email: 'emailA', passwordhash: 'passwordhashA' },
    { email: 'emailB', passwordhash: 'passwordhashB' },
    { email: 'emailC', passwordhash: 'passwordhashC' }
  ]
)

// text: INSERT INTO "users" ("email", "passwordhash") VALUES ($1, $2), ($3, $4), ($5, $6) RETURNING "id"
// parameters: ['emailA', 'passwordhashA', 'emailB', 'passwordhashB', 'emailC', 'passwordhashC']
```

The return value is also an array if the given `rows` array contains only one object. It only depends on the datatype of `rows`.

### Returning another serial column

```javascript
const example = await client.insert(
  'users',
  { email: 'email', passwordhash: 'passwordhash' },
  'example'
)

// text: INSERT INTO "users" ("email", "passwordhash") VALUES ($1, $2) RETURNING "example"
// parameters: ['email', 'passwordhash']
```

## UPDATE

The return value is the count of the rows affected by the update located in `result.rowCount` of the pg result object.

```javascript
const rowCount = await client.update(
  'users',
  { email: 'new email', passwordhash: 'new passwordhash' },
  { email: 'old email', passwordhash: 'old passwordhash' }
)

// text: UPDATE "users" SET "email" = $1, "passwordhash" = $2 WHERE "email" = $3 AND "passwordhash" = $4
// parameters: ['new email', 'new passwordhash', 'old email', 'old passwordhash']
```

## DELETE

The return value is the count of the rows affected by the delete located in `result.rowCount` of the pg result object.

```javascript
const rowCount = await client.delete(
  'users',
  { email: 'email', passwordhash: 'passwordhash' }
)

// text: DELETE FROM "users" WHERE "email" = $1 AND "passwordhash" = $2
// parameters: ['email', 'passwordhash']
```
