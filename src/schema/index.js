const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLNonNull,
} = require('graphql');

/**
 * @functions {database interactions}
 */
const { getShortUrl /*  addUrl, incrementClicks */ } = require('../db');

const urlType = new GraphQLObjectType({
  name: 'Url',
  description: '...',

  fields: () => ({
    id: {
      type: GraphQLID,
      description: '...',
    },
    longUrl: {
      type: GraphQLString,
      description: '...',
    },
    shortUrl: {
      type: GraphQLString,
      description: '...',
    },
    clickCount: {
      type: GraphQLInt,
      description: '...',
    },
  }),
});

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: '...',

    fields: () => ({
      shortenURL: {
        type: urlType,
        args: {
          url: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: (_, { url }) => getShortUrl(url),
      },
    }),
  }),
  /*   mutation: new GraphQLObjectType({
    name: 'Mutation',
    description: '',

    fields: () => ({
      addUrl: {},
    }),
  }), */
  types: [urlType],
});
