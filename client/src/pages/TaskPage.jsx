import { useEffect } from "react";
import { useTasks } from "../context/TasksContext";
import { useNavigate } from "react-router-dom";

function TaskPage() {

    const { tasks, getTasks, deleteTask, getTask} = useTasks ();
    const navigate = useNavigate();

    useEffect(() => {
        getTasks();
    }, []);
    
    if(tasks.length === 0) return <h1>No hay tareas aún</h1>;

    return (
        <div>
            <h1>Página de Tareas</h1>
            <ul>
                {tasks.map(task => (
                    <li key={task._id}>
                        <h2>{task.title}</h2>
                        <p>{task.description}</p>
                        <div>
                            <button onClick={() => navigate(`/tasks/${task._id}`)}>Editar</button>
                            <button onClick={() => deleteTask(task._id)}>Eliminar</button>
                        </div>
                        <p>Fecha de creación: {new Date(task.createdAt).toLocaleDateString()}</p>
                        <p>Fecha de actualización: {new Date(task.updatedAt).toLocaleDateString()}</p>

                    </li>
                ))}
            </ul>
        </div>

    );
}
export default TaskPage;