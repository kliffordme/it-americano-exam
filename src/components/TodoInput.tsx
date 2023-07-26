import React, { useState } from 'react'
import axios from 'axios'

interface TodoInputProps {
    userId: string;
    getTodos: (userId: string) => Promise<void>;

  }

  const TodoInput: React.FC<TodoInputProps> = ({ userId, getTodos }) => {
    const [todo, setTodo] = useState('')

    const createTodo = async () => {
        try {
            const test = await axios.post(`${process.env.REACT_APP_PROJECT_API}/todos`, {userId, title: todo, completed: 'false'})
            setTodo(''); 
            getTodos(userId)
            console.log(test)

        } catch (error) {
            
        }

    }

  return (
    <div style={{width: '400px', margin:'20px auto', display: 'flex'}}>
        <div style={{paddingRight: '35px'}}>
        <textarea style={{width: '250px'}} placeholder='Enter a todo' value={todo} onChange={(e)=> setTodo(e.target.value)}/>
        </div>
        <div >
        <button style={{padding: '11px 40px', border: '1px solid lightblue', borderRadius: '5px', backgroundColor: 'lightblue', color:'white', cursor: 'pointer'}} onClick={createTodo}>Save</button>
        </div>
    </div>
  )
}

export default TodoInput