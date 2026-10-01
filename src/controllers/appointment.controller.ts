import { Request, Response } from "express";
import { AppointmentService } from "../services/appointment.service.js";

export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  book = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, startTime, endTime } = req.body;
      const appointment = await this.appointmentService.bookAppointment(
        userId,
        new Date(startTime),
        new Date(endTime),
      );
      res.status(201).json(appointment);
    } catch (error: any) {
      // هذا السطر سيكشف لنا المشكلة الدقيقة في الـ Terminal
      console.error("\n🔴 تفاصيل الخطأ:", error);

      if (error.message === "CONFLICT") {
        res.status(409).json({ error: "الوقت المطلوب محجوز مسبقاً." });
      } else {
        res.status(500).json({ error: "حدث خطأ في الخادم." });
      }
    }
  };

  cancel = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const appointment = await this.appointmentService.cancelAppointment(
        Number(id),
      );
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: "تعذر إلغاء الموعد." });
    }
  };
}
