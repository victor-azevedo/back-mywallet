import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger/swagger_output.json";
const endpointsFiles = ["./src/index.js"];

swaggerAutogen(outputFile, endpointsFiles);
