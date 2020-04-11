const fs = require('fs');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const GraphQLPrice = require('./graphql_price.js');
const product = require('./product.js');

const resolvers = {
  Query: {
    productList: product.list,
	getproduct: (parent, args) =>{
		return productList.findById(args.id);
	}
  },
  Mutation: {
    productAdd: product.add,
  },
  GraphQLPrice,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
  formatError: (error) => {
    console.log(error);
    return error;
  },
});

function installHandler(app) {
  server.applyMiddleware({ app, path: '/graphql' });
}

module.exports = { installHandler };
