const Request = require('request');

describe('Reseller', () => {
  let server;
  const url = 'http://localhost:3000/revendedor/';
  beforeAll(() => {
    server = require('../index');
  });

  describe('create', () => {
    let data = {};
    beforeEach((done) => {
      const reseller = {
        'revendedor': {
          'nome': 'testar',
          'cpf': '12312312323',
          'email': '12312312323@teste.com',
          'senha': 'senhasegura'	
        }
      }
      Request.post({
        headers: {'content-type':'application/json'},
        url, 
        json: reseller
      }, (err, response, body) => {
        data.status = response.statusCode;
        data.body = body;        
        done();
      });
    });
    it('should create one', () => {
      expect(data.status).toBe(201);
      expect(Object.keys(data.body)).toContain('nome');
      expect(Object.keys(data.body)).toContain('cpf');
      expect(Object.keys(data.body)).toContain('email');
    });
  });  

  describe('login', () => {
    let data = {};
    beforeEach((done) => {
      const reseller = {
        'login': {
          'cpf': '12312312323',
          'senha': 'senhasegura'	
        }
      }
      Request.post({
        headers: {'content-type':'application/json'},
        url: url + 'login', 
        json: reseller
      }, (err, response, body) => {        
        data.status = response.statusCode;
        data.body = body;        
        done();
      });
    });
    it('should logon', () => {
      expect(data.status).toBe(200);
      expect(Object.keys(data.body)).toContain('auth');
      expect(Object.keys(data.body)).toContain('token');
      expect(data.body.auth).toBe(true);
    });
  });  
});