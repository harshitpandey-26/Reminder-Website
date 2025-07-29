import prisma from "../db/prisma.js";

export const createReminder = async (req, res) => {
  const { title, content, remindAt, repeat } = req.body;

  const reminder = await prisma.reminder.create({
    data: {
      userId: req.user.userId,
      title,
      content,
      remindAt: new Date(remindAt),
      repeat,
    },
  });

  res
    .status(201)
    .json({
      success: true,
      message: "Reminder created successfully!!",
      reminder,
    });
};

export const getReminders = async (req, res) => {
  const reminders = await prisma.reminder.findMany({
    where: { userId: req.user.userId },
  });
  res.json({ success: true, reminders });
};


export const delReminders = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const deletedReminder = await prisma.reminder.delete({
      where: { id },
    });

    if (!deletedReminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reminder deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting reminder",
    });
  }
};
