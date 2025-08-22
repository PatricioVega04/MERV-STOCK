import { createContext, useContext, useState } from "react";
import  {createTaskRequest, getTasksRequest, deleteTaskRequest, getTaskRequest, updateTaskRequest} from "../api/tasks.js";


const TasksContext = createContext();

export const useTasks = () => {
    const context = useContext(TasksContext);
    if (!context) {
        throw new Error("useTasks must be used within a TasksProvider");
    }
    return context;
};

export function TasksProvider({ children }) {
   const [tasks, setTasks] = useState([]);
   
   const createTask = async (task) => {
   try {
        const res = await createTaskRequest(task);
        setTasks([...tasks, res.data]);
        console.log("Tarea creada:", res.data);
    } catch (error) {
        console.error("Error al crear la tarea:", error);
    }
   }

   const getTasks = async () => {
     try {
         const res = await getTasksRequest();
         setTasks(res.data);
     } catch (error) {
         console.error("Error al obtener las tareas:", error);
     }
   }
   const deleteTask = async (id) => {
       try {
           await deleteTaskRequest(id);
           setTasks(tasks.filter(task => task._id !== id));
       } catch (error) {
           console.error("Error al eliminar la tarea:", error);
       }
   }
   const getTask = async (id) => {
       try {
           const res = await getTaskRequest(id);
           return res.data;
       } catch (error) {
           console.error("Error al obtener la tarea:", error);
       }
    }

    const updateTask = async (id, task) => {
         try {
              await updateTaskRequest(id, task);
         } catch (error) {
              console.error("Error al actualizar la tarea:", error);
         }
    }

    return (
        <TasksContext.Provider value={{ tasks, createTask, getTasks, deleteTask, getTask, updateTask }}>
            {children}
        </TasksContext.Provider>
    );
}

