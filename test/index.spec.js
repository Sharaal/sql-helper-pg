const assert = require('power-assert')
const sinon = require('sinon')

const sqlPgHelper = require('../')

describe('sql-pg-helper', () => {
  describe('Select', () => {
    it('should select all columns', async () => {
      const expectedRows = [{ id: 'id', email: 'email', passwordhash: 'passwordhash', active: 'active' }]
      const client = {
        query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
      }

      sqlPgHelper({ client })

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
      let actualArgs = client.query.getCall(0).args[0]
      assert.deepEqual({ text: actualArgs.text, parameters: actualArgs.parameters }, expectedArgs)
      actualArgs = actualArgs(0)
      assert.deepEqual({ text: actualArgs.text, parameters: actualArgs.parameters }, expectedArgs)
    })

    it('should select only the list of the given columns', async () => {
      const expectedRows = [{ id: 'id', active: 'active' }]
      const client = {
        query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
      }

      sqlPgHelper({ client })

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
      let actualArgs = client.query.getCall(0).args[0]
      assert.deepEqual({ text: actualArgs.text, parameters: actualArgs.parameters }, expectedArgs)
      actualArgs = actualArgs(0)
      assert.deepEqual({ text: actualArgs.text, parameters: actualArgs.parameters }, expectedArgs)
    })
  })

  describe('Insert', () => {
    it('should insert single row', async () => {
      const expectedId = 5
      const client = {
        query: sinon.fake.returns(Promise.resolve({ rows: [{ id: expectedId }] }))
      }

      sqlPgHelper({ client })

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
      let actualArgs = client.query.getCall(0).args[0]
      assert.deepEqual({ text: actualArgs.text, parameters: actualArgs.parameters }, expectedArgs)
      actualArgs = actualArgs(0)
      assert.deepEqual({ text: actualArgs.text, parameters: actualArgs.parameters }, expectedArgs)
    })

    it('should insert multiple rows', async () => {
      const expectedIds = [2, 3, 4]
      const client = {
        query: sinon.fake.returns(Promise.resolve({ rows: expectedIds.map(id => ({ id })) }))
      }

      sqlPgHelper({ client })

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
      let actualArgs = client.query.getCall(0).args[0]
      assert.deepEqual({ text: actualArgs.text, parameters: actualArgs.parameters }, expectedArgs)
      actualArgs = actualArgs(0)
      assert.deepEqual({ text: actualArgs.text, parameters: actualArgs.parameters }, expectedArgs)
    })

    it('should return array of IDs also if inserting single row as array', async () => {
      const expectedIds = [2]
      const client = {
        query: sinon.fake.returns(Promise.resolve({ rows: expectedIds.map(id => ({ id })) }))
      }

      sqlPgHelper({ client })

      const actualIds = await client.insert(
        'users',
        [
          { email: 'emailA', passwordhash: 'passwordhashA' }
        ]
      )

      assert.deepEqual(expectedIds, actualIds)

      const expectedArgs = {
        text: 'INSERT INTO "users" ("email", "passwordhash") VALUES ($1, $2) RETURNING "id"',
        parameters: ['emailA', 'passwordhashA']
      }
      assert(client.query.calledOnce)
      let actualArgs = client.query.getCall(0).args[0]
      assert.deepEqual({ text: actualArgs.text, parameters: actualArgs.parameters }, expectedArgs)
      actualArgs = actualArgs(0)
      assert.deepEqual({ text: actualArgs.text, parameters: actualArgs.parameters }, expectedArgs)
    })

    it('should returning another serial column', async () => {
      const expectedExample = 5
      const client = {
        query: sinon.fake.returns(Promise.resolve({ rows: [{ example: expectedExample }] }))
      }

      sqlPgHelper({ client })

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
      let actualArgs = client.query.getCall(0).args[0]
      assert.deepEqual({ text: actualArgs.text, parameters: actualArgs.parameters }, expectedArgs)
      actualArgs = actualArgs(0)
      assert.deepEqual({ text: actualArgs.text, parameters: actualArgs.parameters }, expectedArgs)
    })
  })

  describe('Update', () => {
    it('should update rows', async () => {
      const expectedRowCount = 5
      const client = {
        query: sinon.fake.returns(Promise.resolve({ rowCount: expectedRowCount }))
      }

      sqlPgHelper({ client })

      const actualRowCount = await client.update(
        'users',
        { email: 'new email', passwordhash: 'new passwordhash' },
        { email: 'old email', passwordhash: 'old passwordhash' }
      )

      assert(expectedRowCount === actualRowCount)

      const expectedArgs = {
        text: 'UPDATE "users" SET ("email", "passwordhash") = ($1, $2) WHERE "email" = $3 AND "passwordhash" = $4',
        parameters: ['new email', 'new passwordhash', 'old email', 'old passwordhash']
      }
      assert(client.query.calledOnce)
      let actualArgs = client.query.getCall(0).args[0]
      assert.deepEqual({ text: actualArgs.text, parameters: actualArgs.parameters }, expectedArgs)
      actualArgs = actualArgs(0)
      assert.deepEqual({ text: actualArgs.text, parameters: actualArgs.parameters }, expectedArgs)
    })
  })

  describe('Delete', () => {
    it('should delete rows', async () => {
      const expectedRowCount = 5
      const client = {
        query: sinon.fake.returns(Promise.resolve({ rowCount: expectedRowCount }))
      }

      sqlPgHelper({ client })

      const actualRowCount = await client.delete(
        'users',
        { email: 'email', passwordhash: 'passwordhash' }
      )

      assert(expectedRowCount === actualRowCount)

      const expectedArgs = {
        text: 'DELETE FROM "users" WHERE "email" = $1 AND "passwordhash" = $2',
        parameters: ['email', 'passwordhash']
      }
      assert(client.query.calledOnce)
      let actualArgs = client.query.getCall(0).args[0]
      assert.deepEqual({ text: actualArgs.text, parameters: actualArgs.parameters }, expectedArgs)
      actualArgs = actualArgs(0)
      assert.deepEqual({ text: actualArgs.text, parameters: actualArgs.parameters }, expectedArgs)
    })
  })

  describe('Transaction', () => {
    it('should begin and commit a succesful transaction', async () => {
      const client = {
        query: sinon.fake()
      }

      sqlPgHelper({ client })

      await client.transaction(async () => {
        await client.query('SELECT 1')
      })

      assert.equal(client.query.callCount, 3)
      assert.deepEqual(client.query.getCall(0).args, ['BEGIN'])
      assert.deepEqual(client.query.getCall(1).args, ['SELECT 1'])
      assert.deepEqual(client.query.getCall(2).args, ['COMMIT'])
    })

    it('should begin and rollback a failed transaction', async () => {
      const client = {
        query: sinon.fake()
      }

      sqlPgHelper({ client })

      try {
        await client.transaction(async () => {
          await client.query('SELECT 1')
          throw new Error('example')
        })
        assert(false)
      } catch (e) {
        assert.equal(e.message, 'example')
      }

      assert.equal(client.query.callCount, 3)
      assert.deepEqual(client.query.getCall(0).args, ['BEGIN'])
      assert.deepEqual(client.query.getCall(1).args, ['SELECT 1'])
      assert.deepEqual(client.query.getCall(2).args, ['ROLLBACK'])
    })
  })
})
