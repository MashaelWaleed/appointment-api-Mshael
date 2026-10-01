import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import { appointmentRoutes } from './routes/appointment.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

// إعداد صفحة التوثيق
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// إعداد المسارات (وتمرير io لها لتعمل التحديثات اللحظية)
app.use('/api/appointments', appointmentRoutes(io));

// استماع Socket.IO للاتصالات
io.on('connection', (socket) => {
  console.log('مستخدم جديد متصل:', socket.id);
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على: http://localhost:${PORT}`);
  console.log(`📄 التوثيق متاح على: http://localhost:${PORT}/api-docs`);
});