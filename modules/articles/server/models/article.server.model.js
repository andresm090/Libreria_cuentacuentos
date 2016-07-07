'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: 'El titulo no puede quedar en blanco'
  },
  precio: {
    type: Number,
    min: 0,
    default: 200,
    trim: true,
    required: 'El precio no puede quedar en blanco'
  },
  gbook: Schema.Types.Mixed,
  gusto: {
    type: Number,
    min: 0,
    default: 0,
    trim: true
  },
  no_gusto: {
    type: Number,
    min: 0,
    default: 0,
    trim: true
  },
  aburrido: {
    type: Number,
    min: 0,
    default: 0,
    trim: true
  },
  no_interesa: {
    type: Number,
    min: 0,
    default: 0,
    trim: true
  },
  interesa: {
    type: Number,
    min: 0,
    default: 0,
    trim: true
  },
  users: {
    type: [{
      type: Schema.ObjectId,
      ref: 'User'
    }],
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Article', ArticleSchema);
