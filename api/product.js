const { UserInputError } = require('apollo-server-express');
const { getDb, getNextSequence } = require('./db.js');

async function list() {
  const db = getDb();
  const products = await db.collection('products').find({}).toArray();
  return products;
}

function validate(product) {
  const errors = [];
  if (product.productname.length < 1) {
    errors.push('Field "productname" is mandatory.');
  }
  if (product.price) {
    // 'Field "Price" cannot have alphabets. only two digits allowed after decimal places.'

    const regex = /^\s*-?[0-9]\d*(\.\d{1,2})?\s*$/;
    if (!regex.test(product.price)) {
      errors.push('Field "Price" invalid.');
    }
  }

  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', { errors });
  }
}

async function add(_, { product }) {
  const db = getDb();
  validate(product);
  const newProduct = { ...product };
  newProduct.id = await getNextSequence('products');


  const result = await db.collection('products').insertOne(newProduct);
  const savedProduct = await db.collection('products')
    .findOne({ _id: result.insertedId });
  return savedProduct;
}

module.exports = { list, add };
