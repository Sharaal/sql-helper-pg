The library provide smart helpers for standard operations integrated with PostgreSQL.

# Initialization

```javascript
require('@sharaal/sql-pg')(client)
```

# Examples

## SELECT

### All columns and single condition

```javascript
client.select('table', { column: 'value' })
// text: SELECT "*" FROM "table" WHERE "column" = $1
// parameters: ['value']
```

### All columns and multiple conditions

```javascript
client.select('table', { columnA: 'valueA', columnB: 'valueB', columnC: 'valueC' })
// text: SELECT "*" FROM "table" WHERE "columnA" = $1 AND "columnB" = $2 AND "columnC" = $3
// parameters: ['valueA', 'valueB', 'valueC']
```

### Single column and single condition

```javascript
client.select('table', ['column'], { column: 'value' })
// text: SELECT "column" FROM "table" WHERE "column" = $1
// parameters: ['value']
```

### Multiple columns and single condition

```javascript
client.select('table', ['columnA', 'columnB', 'columnC'], { column: 'value' })
// text: SELECT "columnA", "columnB", "columnC" FROM "table" WHERE "column" = $1
// parameters: ['value']
```

### Multiple columns and multiple conditions

```javascript
client.select('table', ['columnA', 'columnB', 'columnC'], { columnA: 'valueA', columnB: 'valueB', columnC: 'valueC' })
// text: SELECT "columnA", "columnB", "columnC" FROM "table" WHERE "columnA" = $1 AND "columnB" = $2 AND "columnC" = $3
// parameters: ['valueA', 'valueB', 'valueC']
```

## INSERT

### Single column

```javascript
client.insert('table', { column: 'value' })
// text: INSERT INTO "table" ("column") VALUES ($1)
// parameters: ['value']
```

### Multiple columns

```javascript
client.insert('table', { columnA: 'valueA', columnB: 'valueB', columnC: 'valueC' })
// text: INSERT INTO "table" ("columnA", "columnB", "columnC") VALUES ($1, $2, $3)
// parameters: ['valueA', 'valueB', 'valueC']
```

## UPDATE

### Single updates and single condition

```javascript
client.update('table', { column: 'new value' }, { column: 'old value' })
// text: UPDATE "table" SET "column" = $1 WHERE "column" = $2
// parameters: ['new value', 'old value']
```

### Multiple updates and single condition

```javascript
client.update('table', { columnA: 'new valueA', columnB: 'new valueB', columnC: 'new valueC' }, { column: 'old value' })
// text: UPDATE "table" SET "columnA" = $1, "columnB" = $2, "columnC" = $3 WHERE "column" = $4
// parameters: ['new valueA', 'new valueB', 'new valueC', 'old value']
```

### Multiple updates and multiple conditions

```javascript
client.update('table', { columnA: 'new valueA', columnB: 'new valueB', columnC: 'new valueC' }, { columnA: 'old valueA', columnB: 'old valueB', columnC: 'old valueC' })
// text: UPDATE "table" SET "columnA" = $1, "columnB" = $2, "columnC" = $3 WHERE "columnA" = $4 AND "columnB" = $5 AND "columnC" = $6
// parameters: [ 'new valueA', 'new valueB', 'new valueC', 'old valueA', 'old valueB', 'old valueC']
```

## DELETE

### Single condition

```javascript
client.delete('table', { column: 'value' })
// text: DELETE FROM "table" WHERE "column" = $1
// parameters: ['value']
```

### Multiple conditions

```javascript
client.delete('table', { columnA: 'valueA', columnB: 'valueB', columnC: 'valueC' })
// text: DELETE FROM "table" WHERE "columnA" = $1 AND "columnB" = $2 AND "columnC" = $3
// parameters: ['valueA', 'valueB', 'valueC']
```
