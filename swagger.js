import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Marketplace API Inteligente',
    version: '1.0.0',
    description: 'API con soporte para JWT, Gestión de Productos y Análisis de Reseñas con IA'
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Escribe el token en este formato: Bearer <tu_token>'
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js'];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
    console.log("Swagger JSON generado exitosamente");
});