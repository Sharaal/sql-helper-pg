const assert = require('power-assert')
const sinon = require('sinon')

const sqlHelperPg = require('../')

describe('sql', () => {
  describe('SELECT', () => {
    it('should select all columns', async () => {
      const user = { id: 'id', email: 'email', passwordhash: 'passwordhash' }
      const expectedRows = [user]
      const client = {
        query: sinon.fake.returns(Promise.resolve({
          rows: expectedRows,
          rowCount: expectedRows.length
        }))
      }

      sqlHelperPg(client)
      const actualRows = await client.select('users', user)

      assert.deepEqual(expectedRows, actualRows)

      const expectedArgs = {
        text: 'SELECT "*" FROM "users" WHERE "id" = $1 AND "email" = $2 AND "passwordhash" = $3',
        parameters: ['id', 'email', 'passwordhash']
      }
      const actualArgs = client.query.getCall(0).args[0]

      assert(client.query.calledOnce)
      assert.deepEqual(expectedArgs, actualArgs)
    })

    it('should select only the list of the given columns', async () => {
      const user = { id: 'id', email: 'email', passwordhash: 'passwordhash' }
      const expectedRows = [user]
      const client = {
        query: sinon.fake.returns(Promise.resolve({
          rows: expectedRows,
          rowCount: expectedRows.length
        }))
      }

      sqlHelperPg(client)
      const actualRows = await client.select('users', ['id', 'email', 'passwordhash'], user)

      assert.deepEqual(expectedRows, actualRows)

      const expectedArgs = {
        text: 'SELECT "id", "email", "passwordhash" FROM "users" WHERE "id" = $1 AND "email" = $2 AND "passwordhash" = $3',
        parameters: ['id', 'email', 'passwordhash']
      }
      const actualArgs = client.query.getCall(0).args[0]

      assert(client.query.calledOnce)
      assert.deepEqual(expectedArgs, actualArgs)
    })
  })

  describe('INSERT', () => {
    it('should insert single row', async () => {})

    it('should insert multiple rows', async () => {})

    it('should returning another serial column', async () => {})
  })

  describe('UPDATE', () => {
    it('should update rows', async () => {})
  })

  describe('DELETE', () => {
    it('should delete rows', () => {})
  })
})
