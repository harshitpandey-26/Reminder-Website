import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [reminders, setReminders] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchReminders = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/v1/reminder",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReminders(data.reminders);
    } catch (error) {
      toast.error("Failed to fetch reminders.");
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/reminder/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Reminder deleted.");
      fetchReminders();
    } catch (error) {
      toast.error("Error deleting reminder.");
    }
  };

  const handleLogOut = () => {
  localStorage.removeItem("token");
  navigate("/login");
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-100 px-6 pb-20 pt-12">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-pink-600 drop-shadow-md">
          Welcome Back 💖
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Here's what's on your mind today...
        </p>
      </div>

      {/* Reminder List */}
      <div className="max-w-5xl mx-auto grid gap-5">
        {reminders.length === 0 ? (
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-center text-pink-400 text-xl font-medium"
          >
            No reminders yet. Click the + button to get started!
          </motion.p>
        ) : (
          reminders.map((reminder, index) => (
            <motion.div
              key={reminder.id}
              className="bg-white/50 backdrop-blur-lg border border-white/30 p-6 rounded-xl shadow-md flex justify-between items-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div>
                <h2 className="text-2xl font-semibold text-pink-600">
                  {reminder.title}
                </h2>
                <p className="text-gray-700 mt-1">{reminder.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  ⏰ Remind at:{" "}
                  {new Intl.DateTimeFormat("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(reminder.remindAt))}
                </p>
                <p className="text-sm text-gray-500">
                  🔁 Repeat: {reminder.repeat || "None"}
                </p>
              </div>

              <button
                onClick={() => handleDelete(reminder.id)}
                className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
              >
                Delete
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Reminder Floating Button */}
      <button
        onClick={() => navigate("/form")}
        className="fixed w-14 h-14 flex items-center justify-center bottom-6 right-6 bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 transition duration-300 z-50"
      >
        <i className="bi bi-plus-lg text-2xl" />
      </button>

      <button
      onClick={handleLogOut}
        type="submit"
        className="fixed w-24 h-9 rounded-md flex items-center justify-center top-6 right-6 bg-pink-500 text-white shadow-lg cursor-pointer hover:bg-pink-600 transition duration-300 z-50"
      >
        Log Out
      </button>
    </div>
  );
};

export default Dashboard;
