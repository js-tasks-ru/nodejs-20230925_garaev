const mongoose = require('mongoose');
const connection = require('../libs/connection');

const subCategorySchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
});

const categorySchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  subcategories: [subCategorySchema],
});

module.exports = connection.model('Category', categorySchema);
