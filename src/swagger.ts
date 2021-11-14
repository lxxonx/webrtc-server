export default {
  options: {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "LogRocket Express API with Swagger",
        version: "0.1.0",
        description:
          "This is a simple CRUD API application made with Express and documented with Swagger",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "lxxonx",
          url: "https://github.com/lxxonx",
          email: "leeonechang92@gmail.com",
        },
      },
      servers: [
        {
          url: "http://localhost:4000/api",
        },
      ],
    },
    apis: ["./routes/docs.ts"],
  },
};
