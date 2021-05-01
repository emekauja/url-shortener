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

const urlType = new GraphQLObjectType({
  name: 'Url',
  description: 'object type url',

  fields: () => ({
    id: {
      type: GraphQLID,
      description: 'unique uuid for each url.',
    },
    longUrl: {
      type: GraphQLString,
      description: 'original url to be shorten.',
    },
    shortUrl: {
      type: GraphQLString,
      description: 'shorten url of the original url.',
    },
    clickCount: {
      type: GraphQLInt,
      description: 'total number of clicks and visits for a url.',
    },
  }),
});

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: 'query with one args(url: to be shortened).',

    fields: () => ({
      shortenURL: {
        type: urlType,
        args: {
          url: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: (_, { url }, { db, address }, info) =>
          db.shortenUrl(url, address, info),
      },
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    description: '',

    fields: () => ({
      incrementUrlVisits: {
        type: urlType,
        description:
          'everytime a user clicks on a url link, it increments the total number of clicks for this url.',
        args: {
          id: { type: GraphQLID },
        },
        resolve: (_, { id }, { db }, info) => db.incrementClickCounts(id, info),
      },
    }),
  }),
  types: [urlType],
});
