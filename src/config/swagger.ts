import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Appointment API - Developed by Haneen",
      version: "1.0.0",
      description: "API لحجز المواعيد مع منع الحجز المزدوج وتحديثات لحظية",
    },
  },
  apis: ["./src/routes/*.ts"], // سيقرأ التوثيق من ملفات المسارات
};

export const swaggerSpec = swaggerJsdoc(options);
