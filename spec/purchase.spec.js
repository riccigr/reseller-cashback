const Request = require('request');

describe('Purchase', () => {
  let server;
  const url = 'http://localhost:3000/compra/';
  beforeAll(() => {
    server = require('../index');
  });

  describe('create', () => {
    let data = {};
    beforeEach((done) => {
      const purchase = {
        'compra': {
            'codigo': '123',
            'valor': '100',
            'cpf': '12312312323',
            'data': '2020-01-01'        
        }
      }
      Request.post({
        headers: {'content-type':'application/json'},
        url, 
        json: purchase
      }, (err, response, body) => {
        console.log(JSON.stringify(response))
        data.status = response.statusCode;
        data.body = body;        
        done();
      });
    });
    it('should create one', () => {
      expect(data.status).toBe(201);
      expect(Object.keys(data.body)).toContain('codigo');
      expect(Object.keys(data.body)).toContain('valor');
      expect(Object.keys(data.body)).toContain('cpf');
      expect(Object.keys(data.body)).toContain('data');
      expect(Object.keys(data.body)).toContain('porcentagem_cashback');
      expect(Object.keys(data.body)).toContain('valor_cashback');
    });
  }); 
  
  describe('update', () => {
    let data = {};
    beforeEach((done) => {
      const purchase = {
        'compra': {
            'valor': '200',
            'cpf': '12312312323',
            'data': '2020-01-01'        
        }
      }
      Request.put({
        headers: {'content-type':'application/json'},
        url:  url + '123', 
        json: purchase
      }, (err, response, body) => {
        data.status = response.statusCode;
        data.body = body;        
        done();
      });
    });
    it('should update one', () => {
      expect(data.status).toBe(200);
      expect(Object.keys(data.body)).toContain('codigo');
      expect(Object.keys(data.body)).toContain('valor');
      expect(Object.keys(data.body)).toContain('cpf');
      expect(Object.keys(data.body)).toContain('data');
    });
  }); 

  describe('get', () => {
    let data = {};
    beforeEach((done) => {
      Request.get({
        headers: {'content-type':'application/json'},
        url:  url + '123', 
      }, (err, response, body) => {
        data.status = response.statusCode;
        data.body = body;        
        done();
      });
    });
    it('should get one', () => {
      expect(data.status).toBe(200);
    });
  }); 

  describe('remove', () => {
    let data = {};
    beforeEach((done) => {
      Request.delete({
        headers: {'content-type':'application/json'},
        url:  url + '123', 
      }, (err, response, body) => {
        data.status = response.statusCode;
        data.body = body;        
        done();
      });
    });
    it('should delete one', () => {
      expect(data.status).toBe(204);
    });
  }); 
});