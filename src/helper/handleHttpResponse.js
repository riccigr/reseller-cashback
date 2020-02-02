const handleHttp = {
    Create: (body, response) => {
        response
            .status(201)
            .json(body);
    },

    Ok: (body, response) => {
        response
            .status(200)
            .json(body);
    },
      
    PreconditionFailed: response => {
        response
            .status(422)
            .send({ erro: 'O status atual não permite essa operação' });
    },
    
    Update: (body, response) => {
        response
            .status(200)
            .json(body);
    },
    
    NoContent: response => {
        response
            .status(204)
            .send();
    },

    InternalError: response => {
        response
            .status(500)
            .send();
    },

    Duplicate: response => {
        response
            .status(400)
            .send({ erro: 'registro duplicado.' });
    },

    NotFound: response => {
        response
            .status(404)
            .send({ erro: 'registro não encontrado.' });
    }
}

module.exports = { handleHttp };