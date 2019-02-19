const sql = require('../sql')

module.exports = client =>
  Object.assign(client, {
    select: async (table, columns, conditions) => {
      const result = await client.query(sql`SELECT ${sql.identifiers(conditions ? columns : ['*'])} FROM ${sql.identifier(table)} WHERE ${sql.pairs(conditions ? conditions : columns, ' AND ')}`)
      return result.rows
    },
    insert: async (table, row, serialColumn = 'id') => {
      const result = await client.query(sql`INSERT INTO ${sql.identifier(table)} (${sql.identifiers(Object.keys(row))}) VALUES (${sql.values(Object.values(row))}) RETURNING ${sql.identifier(serialColumn)}`)
      return result.rows[0][serialColumn]
    },
    update: async (table, updates, conditions) => {
      const result = await client.query(sql`UPDATE ${sql.identifier(table)} SET ${sql.pairs(updates, ', ')} WHERE ${sql.pairs(conditions, ' AND ')}`)
      return result.rowCount
    },
    delete: async (table, conditions) => {
      const result = await client.query(sql`DELETE FROM ${sql.identifier(table)} WHERE ${sql.pairs(conditions, ' AND ')}`)
      return result.rowCount
    }
  })
