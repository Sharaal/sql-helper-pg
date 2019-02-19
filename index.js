const sql = require('../sql')

module.exports = client =>
  Object.assign(client, {
    select: (table, columns, conditions) =>
      client.query(sql`SELECT ${sql.identifiers(conditions ? columns : ['*'])} FROM ${sql.identifier(table)} WHERE ${sql.pairs(conditions ? conditions : columns, ' AND ')}`),
    insert: (table, row) =>
      client.query(sql`INSERT INTO ${sql.identifier(table)} (${sql.identifiers(Object.keys(row))}) VALUES (${sql.values(Object.values(row))})`),
    update: (table, updates, conditions) =>
      client.query(sql`UPDATE ${sql.identifier(table)} SET ${sql.pairs(updates)} WHERE ${sql.pairs(conditions, ' AND ')}`),
    delete: (table, conditions) =>
      client.query(sql`DELETE FROM ${sql.identifier(table)} WHERE ${sql.pairs(conditions, ' AND ')}`)
  })
