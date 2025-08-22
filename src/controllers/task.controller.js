import Task from "../models/task.model.js";

export const getTasks = async (req, res) => {
  try {  const tasks = await Task.find({
        user: req.user.id
    }).populate("user");
    res.json(tasks);
  } catch (error) {
    console.error("Error al obtener las tareas:", error);
  }
};
export const createTask = async (req, res) => {
    try{const { title, description, date} = req.body;
    console.log(req.user);
    const newTask = new Task({ title, description, date, user: req.user.id });
    await newTask.save();
    res.json({ message: "Tarea creada correctamente", task: newTask });
  } catch (error) {
    console.error("Error al crear la tarea:", error);
  }
};
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate("user");
        if (!task) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }
        res.json(task);
    } catch (error) {
        console.error("Error al obtener la tarea:", error);
    }
};

export const deleteTask = async (req, res) => {
   const task = await Task.findByIdAndDelete(req.params.id);
   if (!task) {
        return res.status(404).json({ message: "Tarea no encontrada" });
    }
    res.json({ message: "Tarea eliminada correctamente" });
};

export const updateTask = async (req, res) => {
   try {
       const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
       if (!task) {
           return res.status(404).json({ message: "Tarea no encontrada" });
       }
       res.json({ message: "Tarea actualizada correctamente", task });
   } catch (error) {
       console.error("Error al actualizar la tarea:", error);
   }
};




 

