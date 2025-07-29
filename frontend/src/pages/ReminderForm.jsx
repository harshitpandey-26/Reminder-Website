import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const ReminderForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: "",
    time: "",
    repeat: "",
  });

  const handleAddReminder = async (e) => {
    e.preventDefault();

    const { title, content, date, time, repeat } = formData;

    // Combine date and time into a single ISO string
    const remindAt = new Date(`${date}T${time}`);

    if (isNaN(remindAt.getTime())) {
      toast.error("Invalid date or time.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in!");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/reminder",
        { title, content, repeat, remindAt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setFormData({ title: "", content: "", date: "", time: "", repeat: "" });
        fetchReminders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-100 p-6">
      <motion.h1
        className="text-3xl font-bold text-center text-pink-600 mb-6"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Reminder Dashboard
      </motion.h1>

      {/* Add Reminder Form */}
      <motion.form
        onSubmit={handleAddReminder}
        className="bg-white/30 backdrop-blur-lg border border-white/40 rounded-xl p-6 max-w-xl mx-auto shadow-md flex flex-col gap-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="p-3 rounded-md border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="content"
          placeholder="Content"
          className="p-3 rounded-md border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          rows="3"
          value={formData.content}
          onChange={handleChange}
          required
        />

        <div className="flex gap-4">
          <input
            type="date"
            name="date"
            className="p-3 rounded-md border border-pink-300 w-1/2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="time"
            className="p-3 rounded-md border border-pink-300 w-1/2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <select
          name="repeat"
          value={formData.repeat}
          onChange={handleChange}
          className="p-3 rounded-md border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="">Repeat</option>
          <option value="none">none</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        <button
          type="submit"
          className="bg-pink-500 hover:bg-pink-600 transition text-white py-3 rounded-md font-semibold"
        >
          Add Reminder
        </button>
      </motion.form>
    </div>
  );
};

export default ReminderForm;
