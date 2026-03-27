/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "./axios";

// GET ALL
export const getReminders = () => axios.get("/reminders");

// UPCOMING
export const getUpcomingReminders = () => axios.get("/reminders/upcoming");

// CREATE
export const createReminder = (data: any) => axios.post("/reminders", data);

// MARK SENT
export const markReminderSent = (id: string) =>
  axios.put(`/reminders/${id}/sent`);

// DELETE
export const deleteReminder = (id: string) => axios.delete(`/reminders/${id}`);
