const { PrismaClient } = require('@prisma/client')
const { ApolloServer } = require("apollo-server");
const fs = require('fs');
const path = require('path');
const { getUserId } = require('./utils/auth');
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const { consumeFromQueue } = require("../message.queue/queue")
const { config } = require("dotenv");
// const { flightWorker } = require('../message.queue/flightWorker');
config();
const express = require('express')
const cors = require('cors');




const app = express()


const PORT = process.env.PORT;

app.use(cors({
  origin: ['http://localhost:3000/', 'http://localhost:3000', 'localhost:3000', 'https://vercel.com/convexity/aeropaye-landing-page', 'https://vercel.com/convexity/aeropaye-dashboard']

})) // enable `cors` to set HTTP response header: Access-Control-Allow-Origin: *app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))
// app.listen(PORT)

const prisma = new PrismaClient()

const resolvers = {
    Query,
    Mutation,
  }
  

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
      ),
    resolvers,
    context: async({ req }) => {
        return {
          ...req,
          prisma,
          userId:
            req && req.headers.authorization
              ? await getUserId(req)
              : null
        };
      }
})

console.log('***port', )
server
  .listen(PORT)
  .then(() => {
    // flightWorker()
   // consumeFromQueue("registerFlight")
    console.log(`Server is running on ${PORT}`)
}
  );

