'use strict';

// const Boom                      = require('boom');
const uuid                      = require('node-uuid');
const Joi                       = require('joi');
const Book                      = require('../models/post');

exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/posts',
    handler: function (request, reply) {

      Book.find({}, function(err, posts) {
        if (err) {
          return reply(Boom.wrap(err, 'Internal MongoDB error'));
        } else {
          reply(posts)
        }
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/posts/{id}',
    handler: function (request, reply) {
    }
  });

  server.route({
    method: 'POST',
    path: '/posts',
    handler: function (request, reply) {

      const book = request.payload;

      //Create an id
      book._id = uuid.v1();

      db.posts.save(book, (err, result) => {

        if (err) {
          return reply(Boom.wrap(err, 'Internal MongoDB error'));
        }

        reply(book);
      });
    },
    config: {
      validate: {
        payload: {
          title: Joi.string().min(10).max(50).required(),
          author: Joi.string().min(10).max(50).required(),
          isbn: Joi.number()
        }
      }
    }
  });

  server.route({
    method: 'PATCH',
    path: '/posts/{id}',
    handler: function (request, reply) {

      db.posts.update({
        _id: request.params.id
      }, {
        $set: request.payload
      }, function (err, result) {

        if (err) {
          return reply(Boom.wrap(err, 'Internal MongoDB error'));
        }

        if (result.n === 0) {
          return reply(Boom.notFound());
        }

        reply().code(204);
      });
    },
    config: {
      validate: {
        payload: Joi.object({
          title: Joi.string().min(10).max(50).optional(),
          author: Joi.string().min(10).max(50).optional(),
          isbn: Joi.number().optional()
        }).required().min(1)
      }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/posts/{id}',
    handler: function (request, reply) {

      db.posts.remove({
        _id: request.params.id
      }, function (err, result) {

        if (err) {
          return reply(Boom.wrap(err, 'Internal MongoDB error'));
        }

        if (result.n === 0) {
          return reply(Boom.notFound());
        }

        reply().code(204);
      });
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'routes-posts'
};
