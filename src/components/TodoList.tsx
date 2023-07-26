import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface Todo {
  completed: boolean;
  UserId: string;
  TodoId: string;
  id: string;
  title: string;
  // Add more fields as necessary
}

interface Comment {
    comment: string;
    // define your fields here
    CommentId: string;
    TodoId: string;
    // add more fields if needed
  }

interface TodoListProps {
  getTodos: (userId: string) => Promise<void>;
  todos: Todo[];
}

const TodoList: React.FC<TodoListProps> = ({ todos, getTodos }) => {
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [onComment, setOnComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommenting, setIsCommenting] = useState(false);
  const [editedComment, setEditedComments] = useState('')

  useEffect(()=>{
    getComments()
  },[])

  console.log(comments)

  const getComments = async () => {
    try {
        const data = await axios.get(`${process.env.REACT_APP_PROJECT_API}/comments`)
        console.log(data)
        setComments(data.data)
    } catch (error) {
        console.log(error)
    }
}

  const deleteTodo = async (userId: any, todoId: any) => {
    try {
      const data = await axios.delete(`${process.env.REACT_APP_PROJECT_API}/todos/${todoId}`);
      getTodos(userId);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateCompleted = async (userId: any, todoId: any, title: string, completed: boolean) => {
    const newCompleted = !completed;
    try {
      const data = await axios.post(`${process.env.REACT_APP_PROJECT_API}/todos/update`, {
        userId,
        id: todoId,
        title,
        completed: newCompleted,
      });
      getTodos(userId);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateTodo = async (userId: any, todoId: any, title: string, completed: boolean) => {
    try {
      const data = await axios.post(`${process.env.REACT_APP_PROJECT_API}/todos/update`, {
        userId,
        id: todoId,
        title,
        completed,
      });
      getTodos(userId);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (todoId: string, title: string) => {
    setEditingTodoId(todoId);
    setEditingTitle(title);
  };

  const handleUpdate = async (userId: string, todoId: string, completed: boolean, e: React.FormEvent) => {
    e.preventDefault();
    await updateTodo(userId, todoId, editingTitle, completed);
    setEditingTodoId(null);
  };


  const handleCommentClick = () => {
    setIsCommenting(!isCommenting);
  };

  const createComment = async (todoId: any, userId: any) => {
    try {
        const data = await axios.post(`${process.env.REACT_APP_PROJECT_API}/comments`, {todoId, comment:onComment})
        getTodos(userId)
        getComments()
        setOnComment('')
        console.log(data)
    } catch (error) {
        console.log(error)
    }
  }

  const deleteComment = async (commentId:any, userId: any) => {
    try {
        const data = await axios.delete(`${process.env.REACT_APP_PROJECT_API}/comments/${commentId}`)
        getTodos(userId)
        getComments()
        console.log(data)
    } catch (error) {
        console.log(error)
    }
  }

  const [openEdit, setOpenEditComment] = useState(false)

  const updateComment = async (commentId:any, comment: any, userId:any) => {
    console.log(editedComment)
    try {
        const data = await axios.post(`${process.env.REACT_APP_PROJECT_API}/comments/update`, {id:commentId, comment:editedComment})
        setOpenEditComment(!openEdit)
        getTodos(userId)
        getComments()
        console.log(data)
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div style={{ width: '600px' }}>
      <ul>
        {todos.map((todo) => (
          <div key={todo.id} >
            <div style={{  margin: '15px 5px', height: '180px', padding:'9px', display:'flex', justifyContent:'space-between', borderRadius:'10px', width: '550px',  border: '1px solid lightblue' }}>
                <div >
                {todo.TodoId === editingTodoId ? (
                    <form  style={{width: '360px', justifyContent:'flex-start',paddingLeft:'10px', alignContent:'center', height: '70px', overflowY:'auto'}} onSubmit={(e) => handleUpdate(todo.UserId, todo.TodoId, todo.completed, e)}>
                    <textarea style={{height: '40px', width: '200px'}} value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)} onBlur={(e) => handleUpdate(todo.UserId, todo.TodoId, todo.completed, e)} />
                    </form>
                ) : todo.completed ? (
                    <div style={{width: '360px', justifyContent:'flex-start',paddingLeft:'10px', alignContent:'center', height: '70px', overflowY:'auto'}}>
                        <p>
                            <s>{todo.title}</s>
                        </p>
                    </div>
                ) : (
                    <div style={{width: '360px', justifyContent:'flex-start',paddingLeft:'10px', alignContent:'center', height: '70px', overflowY:'auto'}}>
                    <p>{todo.title}</p>
                    </div>
                )}
                    <div style={{display: 'flex', paddingBottom:'10px', paddingLeft:'10px'}}>
                        <div style={{paddingRight: '10px'}}>
                            {isCommenting 
                                ? 
                                <div>
                                    <input value={onComment} type="text" placeholder="Add a comment..." onChange={(e)=>setOnComment(e.target.value)}/>
                                    <button style={{marginLeft:'10px'}} onClick={()=>createComment(todo.TodoId, todo.UserId)}>save</button>
                                </div>
                                : "add a comment"
                            }
                        </div>
                        <div>
                            <button onClick={handleCommentClick}>{isCommenting ? "cancel" : "comment"}</button>
                        </div>
                    </div>
                    <div style={{height:' 80px', overflowY:'auto'}}>
                                
                        {comments.map((comment)=>(
                            <div>{todo.TodoId === comment.TodoId ?
                                <div style={{display:'flex', justifyContent:'space-between', padding: '0 10px'}}>
                                <div>
                                    {openEdit ? (
                                    <form>
                                        <input defaultValue={comment.comment} onChange={(e)=>setEditedComments(e.target.value)}  />
                                    </form>
                                    ) : (
                                    comment.comment
                                    )}
                                </div>
                                <div>
                                    {openEdit ? (
                                    <div>
                                    <button onClick={() => updateComment(comment.CommentId, comment.comment, todo.UserId)}>Submit</button>
                                    <button onClick={() => setOpenEditComment(!openEdit)}>Cancel</button>
                                    </div>
                                    ) : (
                                    <button onClick={() => setOpenEditComment(!openEdit)}>Update</button>
                                    )}
                                    <button onClick={()=>deleteComment(comment.CommentId, todo.UserId)}>Delete</button>
                                </div>
                                </div> : null}</div>
                        ))}
                    </div>

                </div>
                <div style={{padding:'25px 0'}}>
                {todo.TodoId === editingTodoId ? (
                    <button style={{margin:'0 5px', border: '1px solid lightblue', borderRadius: '5px', backgroundColor: 'lightblue', color:'white', cursor: 'pointer'}} onClick={() => setEditingTodoId(null)}>Update</button>
                ) : (
                    <button style={{margin:'0 2px',  border: '1px solid lightblue', borderRadius: '5px', backgroundColor: 'lightblue', color:'white', cursor: 'pointer'}} onClick={() => handleEdit(todo.TodoId, todo.title)}>Edit</button>
                )}
                <button style={{margin:'0 2px', border: '1px solid lightblue', borderRadius: '5px', backgroundColor: 'lightgreen', color:'white', cursor: 'pointer'}}  onClick={() => updateCompleted(todo.UserId, todo.TodoId, todo.title, todo.completed)}>{todo.completed ? 'undone' : 'done'}</button>
                <button style={{margin:'0 2px', border: '1px solid lightblue', borderRadius: '5px', backgroundColor: 'red', color:'white', cursor: 'pointer'}}  onClick={() => deleteTodo(todo.UserId, todo.TodoId)}>delete</button>
                </div>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;