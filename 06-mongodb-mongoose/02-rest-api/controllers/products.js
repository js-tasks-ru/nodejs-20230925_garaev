const Product = require('../models/Product');
const mongoose = require('mongoose');
const mapProduct = require('../mappers/product');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const products = await Product.find({subcategory: ObjectId(subcategory)});

  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();

  ctx.body = {products: products.map(mapProduct)};

  await next();
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;
  if (!mongoose.isValidObjectId(id)) ctx.throw(400);

  const product = await Product.findById(id);

  if (!product) ctx.throw(404);

  ctx.body = {product: mapProduct(product)};
};
