import Task from "../models/task.model.js";

export const getTasks = async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
};
export const createTask = async (req, res) => {
    const { title, description, date} = req.body;
    console.log(req.user);
    const newTask = new Task({ title, description, date, user: req.user.id });
    await newTask.save();
    res.json({ message: "Tarea creada correctamente", task: newTask });
};
export const getTaskById = async (req, res) => {
    const task = await Task.findById(req.params.id)
    if (!task) { return res.status(404).json({ message: "Tarea no encontrada" }); }
    res.json(task);
}

export const deleteTask = async (req, res) => {
   const task = await Task.findByIdAndDelete(req.params.id);
   if (!task) {
        return res.status(404).json({ message: "Tarea no encontrada" });
    }
    res.json({ message: "Tarea eliminada correctamente" });
};

export const updateTask = async (req, res) => {
   const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
   if (!task) {
        return res.status(404).json({ message: "Tarea no encontrada" });
    }
    res.json({ message: "Tarea actualizada correctamente", task });
};
 

