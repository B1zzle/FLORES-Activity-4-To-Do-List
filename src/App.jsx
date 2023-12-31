import React, { useState, useEffect } from 'react';
import './App.css';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';
import { FaEdit } from 'react-icons/fa';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [completedTodos, setCompletedTodos] = useState([]);
  const [isCompletedScreen, setIsCompletedScreen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddNewToDo = () => {
    if (!newTodoTitle.trim() || !newDescription.trim()) {
      alert("Please enter both title and description.");
      return;
    }
  
    let newToDoObj = {
      title: newTodoTitle,
      description: newDescription,
    };
  
    let updatedTodoArr = [...todos];
    updatedTodoArr.push(newToDoObj);
  
    setTodos(updatedTodoArr);
    localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));
    setNewDescription('');
    setNewTodoTitle('');
  };

  useEffect(() => {
    let savedTodos = JSON.parse(localStorage.getItem('todolist'));
    let savedCompletedToDos = JSON.parse(localStorage.getItem('completedTodos'));
    if (savedTodos) {
      setTodos(savedTodos);
    }

    if (savedCompletedToDos) {
      setCompletedTodos(savedCompletedToDos);
    }
  }, []);

  const handleToDoDelete = index => {
    let reducedTodos = [...todos];
    reducedTodos.splice(index, 1);

    localStorage.setItem('todolist', JSON.stringify(reducedTodos));
    setTodos(reducedTodos);
  };

  const handleCompletedTodoDelete = index => {
    let reducedCompletedTodos = [...completedTodos];
    reducedCompletedTodos.splice(index, 1);

    localStorage.setItem('completedTodos', JSON.stringify(reducedCompletedTodos));
    setCompletedTodos(reducedCompletedTodos);
  };

  const handleEdit = index => {
    setEditingIndex(index);
    setNewTodoTitle(todos[index].title);
    setNewDescription(todos[index].description);
  };

  const handleSaveEdit = () => {
    if (!newTodoTitle.trim() || !newDescription.trim()) {
      // Display an error message or take appropriate action
      alert("Please enter both title and description.");
      return;
    }
  
    if (editingIndex !== null) {
      let updatedTodos = [...todos];
      updatedTodos[editingIndex] = { title: newTodoTitle, description: newDescription };
  
      setTodos(updatedTodos);
      localStorage.setItem('todolist', JSON.stringify(updatedTodos));
  
      setNewTodoTitle('');
      setNewDescription('');
      setEditingIndex(null);
    }
  };

  const handleComplete = index => {
    const date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    var hh = date.getHours();
    var minutes = date.getMinutes();
    var ss = date.getSeconds();
    var finalDate =
      dd + '-' + mm + '-' + yyyy + ' at ' + hh + ':' + minutes + ':' + ss;

    let filteredTodo = {
      ...todos[index],
      completedOn: finalDate,
    };

    let updatedCompletedList = [...completedTodos, filteredTodo];
    setCompletedTodos(updatedCompletedList);
    localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedList));

    handleToDoDelete(index);
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>

      <div className="todo-wrapper">

        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title:</label>
            <input
              type="text"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              placeholder="What To-Do?"
            />
          </div>
          <div className="todo-input-item">
            <label>Description:</label>
            <input
              type="text"
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              placeholder="Add Description"
            />
          </div>
          <div className="todo-input-item">
            <button
              className="primary-btn"
              type="button"
              onClick={handleAddNewToDo}
            >
              Add
            </button>
          </div>
        </div>
        <div className="btn-area">
          <button
            className={`secondaryBtn ${!isCompletedScreen && 'active'}`}
            onClick={() => setIsCompletedScreen(false)}
          >
            To-Do
          </button>
          <button
            className={`secondaryBtn ${isCompletedScreen && 'active'}`}
            onClick={() => setIsCompletedScreen(true)}
          >
            Completed
          </button>
        </div>
        <div className="todo-list">
        {isCompletedScreen === false &&
          todos.map((item, index) => (
            <div className="todo-list-item" key={index}>
              <div>
                {editingIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={newTodoTitle}
                      onChange={(e) => setNewTodoTitle(e.target.value)}
                      placeholder="Edit title..."
                      className="edit-input"/>
                    <input
                      type="text"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Edit description..."
                      className="edit-input"/>
                  </>
                ) : (
                  <>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </>
                )}
              </div>
              <div>
              {editingIndex === index ? (
                <button
                  className="primary-btn save-btn"
                  type="button"
                  onClick={handleSaveEdit}>Save
                </button>
                ) : (
                  <>
                    <AiOutlineDelete
                      title="Delete?"
                      className="icon"
                      onClick={() => handleToDoDelete(index)}/>
                    <FaEdit
                      title="Edit?"
                      className="edit-icon"
                      onClick={() => handleEdit(index)}/>
                    <BsCheckLg
                      title="Completed?"
                      className="check-icon"
                      onClick={() => handleComplete(index)}/>
                  </>
                )}
              </div>
            </div>
          ))}
          {isCompletedScreen === true &&
            completedTodos.map((item, index) => (
              <div className="todo-list-item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p> <i>Completed at: {item.completedOn}</i></p>
                </div>
                <div>
                  <AiOutlineDelete
                    className="icon"
                    onClick={() => handleCompletedTodoDelete(index)}/>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;