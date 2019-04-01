module.exports = ({ client, sql: sql = require('../sql-pg') }) =>
  Object.assign(client, {
    select: async (table, columns, conditions) => {
      if (!conditions) {
        conditions = columns
        columns = ['*']
      }
      const result = await client.query(sql`SELECT ${sql.keys(columns)} FROM ${sql.key(table)} WHERE ${sql.pairs(conditions, ' AND ')}`)
      return result.rows
    },
    insert: async (table, rows, serialColumn = 'id') => {
      let array = true
      if (!Array.isArray(rows)) {
        rows = [rows]
        array = false
      }
      const result = await client.query(sql`INSERT INTO ${sql.key(table)} (${sql.keys(rows[0])}) VALUES ${sql.valuesList(rows)} RETURNING ${sql.key(serialColumn)}`)
      if (!array) {
        return result.rows[0][serialColumn]
      }
      return result.rows.map(row => row[serialColumn])
    },
    update: async (table, updates, conditions) => {
      const result = await client.query(sql`UPDATE ${sql.key(table)} SET ${sql.pairs(updates, ', ')} WHERE ${sql.pairs(conditions, ' AND ')}`)
      return result.rowCount
    },
    delete: async (table, conditions) => {
      const result = await client.query(sql`DELETE FROM ${sql.key(table)} WHERE ${sql.pairs(conditions, ' AND ')}`)
      return result.rowCount
    }
  })
