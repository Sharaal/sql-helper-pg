const assert = require('power-assert')
const sinon = require('sinon')

const sqlHelperPg = require('../')

describe('sql', () => {
  describe('SELECT', () => {
    it('should select all columns', async () => {
      const expectedRows = [{ id: 'id', email: 'email', passwordhash: 'passwordhash', active: 'active' }]
      const client = {
        query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
      }

      sqlHelperPg(client)
      const actualRows = await client.select(
        'users',
        { email: 'email', passwordhash: 'passwordhash' }
      )

      assert.deepEqual(expectedRows, actualRows)

      const expectedArgs = {
        text: 'SELECT "*" FROM "users" WHERE "email" = $1 AND "passwordhash" = $2',
        parameters: ['email', 'passwordhash']
      }
      assert(client.query.calledOnce)
      const actualArgs = client.query.getCall(0).args[0]
      assert.deepEqual(expectedArgs, actualArgs)
    })

    it('should select only the list of the given columns', async () => {
      const expectedRows = [{ id: 'id', active: 'active' }]
      const client = {
        query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
      }

      sqlHelperPg(client)
      const actualRows = await client.select(
        'users',
        ['id', 'active'],
        { email: 'email', passwordhash: 'passwordhash' }
      )

      assert.deepEqual(expectedRows, actualRows)

      const expectedArgs = {
        text: 'SELECT "id", "active" FROM "users" WHERE "email" = $1 AND "passwordhash" = $2',
        parameters: ['email', 'passwordhash']
      }
      assert(client.query.calledOnce)
      const actualArgs = client.query.getCall(0).args[0]
      assert.deepEqual(expectedArgs, actualArgs)
    })
  })

  describe('INSERT', () => {
    it('should insert single row', async () => {
      const expectedId = 5
      const client = {
        query: sinon.fake.returns(Promise.resolve({ rows: [{ id: expectedId }] }))
      }

      sqlHelperPg(client)
      const actualId = await client.insert(
        'users',
        { email: 'email', passwordhash: 'passwordhash' }
      )

      assert(expectedId === actualId)

      const expectedArgs = {
        text: 'INSERT INTO "users" ("email", "passwordhash") VALUES ($1, $2) RETURNING "id"',
        parameters: ['email', 'passwordhash']
      }
      assert(client.query.calledOnce)
      const actualArgs = client.query.getCall(0).args[0]
      assert.deepEqual(expectedArgs, actualArgs)
    })

    it('should insert multiple rows', async () => {
      const expectedIds = [2, 3, 4]
      const client = {
        query: sinon.fake.returns(Promise.resolve({ rows: expectedIds.map(id => ({ id })) }))
      }

      sqlHelperPg(client)
      const actualIds = await client.insert(
        'users',
        [
          { email: 'emailA', passwordhash: 'passwordhashA' },
          { email: 'emailB', passwordhash: 'passwordhashB' },
          { email: 'emailC', passwordhash: 'passwordhashC' }
        ]
      )

      assert.deepEqual(expectedIds, actualIds)

      const expectedArgs = {
        text: 'INSERT INTO "users" ("email", "passwordhash") VALUES ($1, $2), ($3, $4), ($5, $6) RETURNING "id"',
        parameters: ['emailA', 'passwordhashA', 'emailB', 'passwordhashB', 'emailC', 'passwordhashC']
      }
      assert(client.query.calledOnce)
      const actualArgs = client.query.getCall(0).args[0]
      assert.deepEqual(expectedArgs, actualArgs)
    })

    it('should returning another serial column', async () => {
      const expectedExample = 5
      const client = {
        query: sinon.fake.returns(Promise.resolve({ rows: [{ example: expectedExample }] }))
      }

      sqlHelperPg(client)
      const actualExample = await client.insert(
        'users',
        { email: 'email', passwordhash: 'passwordhash' },
        'example'
      )

      assert(expectedExample === actualExample)

      const expectedArgs = {
        text: 'INSERT INTO "users" ("email", "passwordhash") VALUES ($1, $2) RETURNING "example"',
        parameters: ['email', 'passwordhash']
      }
      assert(client.query.calledOnce)
      const actualArgs = client.query.getCall(0).args[0]
      assert.deepEqual(expectedArgs, actualArgs)
    })
  })

  describe('UPDATE', () => {
    it('should update rows', async () => {
      const expectedRowCount = 5
      const client = {
        query: sinon.fake.returns(Promise.resolve({ rowCount: expectedRowCount }))
      }

      sqlHelperPg(client)
      const actualRowCount = await client.update(
        'users',
        { email: 'new email', passwordhash: 'new passwordhash' },
        { email: 'old email', passwordhash: 'old passwordhash' }
      )

      assert(expectedRowCount === actualRowCount)

      const expectedArgs = {
        text: 'UPDATE "users" SET "email" = $1, "passwordhash" = $2 WHERE "email" = $3 AND "passwordhash" = $4',
        parameters: ['new email', 'new passwordhash', 'old email', 'old passwordhash']
      }
      assert(client.query.calledOnce)
      const actualArgs = client.query.getCall(0).args[0]
      assert.deepEqual(expectedArgs, actualArgs)
    })
  })

  describe('DELETE', () => {
    it('should delete rows', async () => {
      const expectedRowCount = 5
      const client = {
        query: sinon.fake.returns(Promise.resolve({ rowCount: expectedRowCount }))
      }

      sqlHelperPg(client)
      const actualRowCount = await client.delete(
        'users',
        { email: 'old email', passwordhash: 'old passwordhash' }
      )

      assert(expectedRowCount === actualRowCount)

      const expectedArgs = {
        text: 'DELETE FROM "users" WHERE "email" = $1 AND "passwordhash" = $2',
        parameters: ['old email', 'old passwordhash']
      }
      assert(client.query.calledOnce)
      const actualArgs = client.query.getCall(0).args[0]
      assert.deepEqual(expectedArgs, actualArgs)
    })
  })
})
