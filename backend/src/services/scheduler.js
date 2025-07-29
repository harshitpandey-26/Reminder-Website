import cron from "node-cron";
import prisma from "../db/prisma.js";
import { sendReminderEmail } from "./emailService.js";

cron.schedule("* * * * *", async () => {
  const now = new Date();

  const reminders = await prisma.reminder.findMany({
    where: {
      remindAt: { lte: now },
      isSent: false,
    },
    include: { user: true },
  });

  for (const reminder of reminders) {
    await sendReminderEmail({
      to: reminder.user.email,
      subject: `Reminder: ${reminder.title}`,
      text: reminder.content,
    });

    let newRemindAt = null;

    if (reminder.repeat === "daily") {
      newRemindAt = new Date(reminder.remindAt);
      newRemindAt.setDate(newRemindAt.getDate() + 1);
    } else if (reminder.repeat === "weekly") {
      newRemindAt = new Date(reminder.remindAt);
      newRemindAt.setDate(newRemindAt.getDate() + 7);
    } else if (reminder.repeat === "monthly") {
      newRemindAt = new Date(reminder.remindAt);
      newRemindAt.setMonth(newRemindAt.getMonth() + 1);
    }

    if (newRemindAt) {
      
      await prisma.reminder.update({
        where: { id: reminder.id },
        data: {
          remindAt: newRemindAt,
          isSent: false,
        },
      });
    } else {
      
        await prisma.reminder.update({
        where: { id: reminder.id },
        data: {
          isSent: true,
        },
      });
    }

    // console.log(
    //   `[${new Date().toISOString()}] Checked ${reminders.length} reminders`
    // );
  }
});
