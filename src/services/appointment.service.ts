import { PrismaClient, Prisma } from "@prisma/client";
import { Server } from "socket.io";

const prisma = new PrismaClient();

export class AppointmentService {
  constructor(private io: Server) {}

  async bookAppointment(userId: string, startTime: Date, endTime: Date) {
    // نستخدم transaction لحبس العملية حتى تكتمل وتمنع أي طلب آخر من التداخل
    const appointment = await prisma.$transaction(
      async (tx) => {
        // 1. هل يوجد حجز آخر يتقاطع مع هذا الوقت؟
        const conflict = await tx.appointment.findFirst({
          where: {
            status: "BOOKED",
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gt: startTime } },
            ],
          },
        });

        // 2. إذا وجد تعارض، نرفض الطلب
        if (conflict) throw new Error("CONFLICT");

        // 3. إذا كان الوقت متاحاً، نؤكد الحجز
        return await tx.appointment.create({
          data: { userId, startTime, endTime },
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );

    // إرسال إشعار لحظي لكل المتصلين أن هناك موعد تم حجزه
    this.io.emit("appointmentUpdated", { type: "BOOKED", data: appointment });
    return appointment;
  }

  async cancelAppointment(id: number) {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status: "CANCELED" },
    });

    // إرسال إشعار لحظي بالإلغاء
    this.io.emit("appointmentUpdated", { type: "CANCELED", data: appointment });
    return appointment;
  }
}
