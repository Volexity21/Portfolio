const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');

const { typeDefs, resolvers } = require('./schemas');
// Still need to setup connection file for database connection
const db = require('./config/connection');
const { type } = require('os');

const PORT = process.env.PORT | 3001;
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const startApolloServer = async (typeDefs, resolvers) => {
    await server.start();
    server.applyMiddleware({ app });

    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`The API server is running on port ${PORT}.`);
            console.log(`GraphQL is running at http://localhost:${PORT}${server.graphqlPath}`);
        })
    })
};

startApolloServer(typeDefs, resolvers);