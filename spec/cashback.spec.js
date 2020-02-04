const Request = require('request');

describe('Cashback', () => {
  let server;
  beforeAll(() => {
    server = require('../index');
  });

  describe('when cashback call is ok', () => {
    let data = {};
    beforeEach((done) => {
      Request.get('http://localhost:3000/cashback/12312312323', (err, response, body) => {
        data.status = response.statusCode;
        data.body = JSON.parse(body);
        done();
      });
    });
    it('should return success', () => {
      expect(data.status).toBe(200);
      expect(Object.keys(data.body)).toContain('valor');
    });
  });

  describe('when cashback call with invalid cpf', () => {
    let data = {};
    beforeEach((done) => {
      Request.get('http://localhost:3000/cashback/1231a2312323', (err, response, body) => {
        data.status = response.statusCode;
        data.body = JSON.parse(body);
        done();
      });
    });
    it('should return not found', () => {
      expect(data.status).toBe(404);
      expect(Object.keys(data.body)).toContain('erro');
    });
  });
});