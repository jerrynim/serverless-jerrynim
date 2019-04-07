import { graphqlLambda } from "apollo-server-lambda";
import { makeExecutableSchema } from "graphql-tools";
import { fileLoader, mergeResolvers, mergeTypes } from "merge-graphql-schemas";

import path from "path";

const allTypes = fileLoader(path.join(__dirname, "./src/api/**/*.graphql"));
const allResolvers = fileLoader(path.join(__dirname, "./src/api/**/*.ts"));
const mergedTypes = mergeTypes(allTypes);
const mergedResolvers = mergeResolvers(allResolvers);

const myGraphQLSchema = makeExecutableSchema({
  typeDefs: mergedTypes,
  resolvers: mergedResolvers
});

exports.graphqlHandler = function graphqlHandler(event, context, callback) {
  function callbackWithHeaders(error, output) {
    // eslint-disable-next-line no-param-reassign
    output.headers["Access-Control-Allow-Origin"] = "*";
    callback(error, output);
  }

  const handler = graphqlLambda({ schema: myGraphQLSchema });
  return handler(event, context, callbackWithHeaders);
};
