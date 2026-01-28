import { withSwagger } from 'next-swagger-doc';

const swaggerHandler = withSwagger({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Devagram API',
      version: '1.0.0',
      description: 'Documentação da API do projeto Devagram',
    },
  },
  apiFolder: 'pages/api', // Pasta onde estão seus endpoints
});

export default swaggerHandler();
