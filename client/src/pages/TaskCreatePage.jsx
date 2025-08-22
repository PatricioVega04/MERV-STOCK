
import {useForm} from 'react-hook-form';    
import { useTasks } from '../context/TasksContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

function TaskCreatePage() {
    const {register, handleSubmit, setValue,  formState: {errors}} = useForm();
    const { createTask, getTask, updateTask } = useTasks();
    const navigate = useNavigate();
    const params = useParams(); 

    useEffect(() => {
       async function loadTask() { 
        if (params.id) {
            const task = await getTask(params.id);
            setValue("title", task.title);
            setValue("description", task.description);
        }
       }
       loadTask();
    }, []);


    const onSubmit = handleSubmit((data) => {
        if (params.id) {
            updateTask(params.id, data);
        } else {
            createTask(data);
            
        }
        navigate("/tasks");

    });

    return (
        <div>
           <form onSubmit={onSubmit}>
            <input type="text" placeholder="Título de la tarea" {...register("title", { required: true })} autoFocus/>
            <input type="text" placeholder="Descripción de la tarea" {...register("description", { required: true })}/>
            <button>Crear Tarea</button>
           </form>
        </div>
    );
}
export default TaskCreatePage;