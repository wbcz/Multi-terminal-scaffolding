export * from './types.js';
export { schema } from './resolver.js';

// 示例：如何使用
/*
import { schema } from '@eleme/flowise-resolver';
import { graphqlHTTP } from 'express-graphql';
import express from 'express';

async function bootstrap() {
  const app = express();

  app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      graphiql: true
    })
  );

  app.listen(4000);
  console.log('Server running at http://localhost:4000/graphql');
}

bootstrap();
*/ 