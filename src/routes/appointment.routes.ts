import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.controller.js';
import { AppointmentService } from '../services/appointment.service.js';
import { Server } from 'socket.io';

export const appointmentRoutes = (io: Server) => {
  const router = Router();
  const service = new AppointmentService(io);
  const controller = new AppointmentController(service);

  /**
   * @swagger
   * /api/appointments:
   *   post:
   *     summary: حجز موعد جديد
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userId: { type: string, example: "user_1" }
   *               startTime: { type: string, format: date-time, example: "2026-10-15T10:00:00Z" }
   *               endTime: { type: string, format: date-time, example: "2026-10-15T11:00:00Z" }
   *     responses:
   *       201:
   *         description: تم الحجز بنجاح
   *       409:
   *         description: تعارض في الوقت
   */
  router.post('/', controller.book);

  /**
   * @swagger
   * /api/appointments/{id}:
   *   delete:
   *     summary: إلغاء حجز
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: تم الإلغاء بنجاح
   */
  router.delete('/:id', controller.cancel);

  return router;
};