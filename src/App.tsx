import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/electron-vite.animate.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [todoItems, setTodoItems] = useState<string[]>([])
  const [inProgressItems, setInProgressItems] = useState<string[]>([])
  const [doneItems, setDoneItems] = useState<string[]>([])
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editingValue, setEditingValue] = useState('')

  function toClick() {
    setTodoItems([...todoItems, 'New Task'])
  }

  function handleItemClick(idx: number) {
    setEditingIdx(idx)
    setEditingValue(todoItems[idx])
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEditingValue(e.target.value)
  }

  function handleInputBlur(idx: number) {
    const updated = [...todoItems]
    updated[idx] = editingValue
    setTodoItems(updated)
    setEditingIdx(null)
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>, idx: number) {
    if (e.key === 'Enter') {
      handleInputBlur(idx)
    }
  }

  function moveToDone(idx: number) {
    const item = inProgressItems[idx];
    setInProgressItems(inProgressItems.filter((_, i) => i !== idx));
    setDoneItems([...doneItems, item]);
    if (editingIdx === idx) {
      setEditingIdx(null);
    }
  }

  function moveToTodo(idx: number) {
    const item = inProgressItems[idx];
    setInProgressItems(inProgressItems.filter((_, i) => i !== idx));
    setTodoItems([...todoItems, item]);
    if (editingIdx === idx) {
      setEditingIdx(null)
    }
  }

  function moveToInProgressTodo(idx: number) {
    const item = todoItems[idx];
    setTodoItems(todoItems.filter((_, i) => i !== idx))
    setInProgressItems([...inProgressItems, item])
    if (editingIdx === idx) {
      setEditingIdx(null)
    }
  }

  function moveToInProgressDone(idx: number) {
    const item = doneItems[idx];
    setDoneItems(doneItems.filter((_, i) => i !== idx))
    setInProgressItems([...inProgressItems, item])
    if (editingIdx === idx) {
      setEditingIdx(null)
    }
  }

  

  return (
    <>
      <div className='h-screen flex flex-col overflow-x-hidden max-w-full overflow-y-hidden'>
        <h2 className='text-center mt-4 font-bold text-2xl m-4'>[insert project name here]</h2>
        <div className="container flex-1 grid gap-2 px-2 grid-cols-3" style={{minHeight:0}}>
          <div className="column flex flex-col">
            <div className="colHeader bg-todo rounded-t flex items-center justify-center cursor-pointer" onClick={toClick}>
              <h4 className='m-2 text-textColor inline-block select-none'>To Do</h4>
            </div>
            <div className='colContent flex-1 bg-bgGrey overflow-auto'>
              <ul id='todo' className='pt-2'>
                {todoItems.map((item, idx) => (
                  <li className='bg-white border-todo border-3 text-textColor mt-2 ml-4 mr-4 p-2 flex justify-between items-center rounded' key={idx}>
                    <div className='flex-1 flex items-center justify-center'>
                    {editingIdx === idx ? (
                      <input
                        value={editingValue}
                        autoFocus
                        onChange={handleInputChange}
                        onBlur={() => handleInputBlur(idx)}
                        onKeyDown={e => handleInputKeyDown(e, idx)}
                        className='w-full'
                      />
                    ) : (
                      <span className='w-full text-center cursor-pointer'
                      onClick={() => handleItemClick(idx)}>{item}
                      </span>
                    )}
                    </div>
                    <button 
                    className='ml-2 px-2 py-1 bg-todo text-textColor rounded hover:bg-blue-700'
                    onClick={() => moveToInProgressTodo(idx)}
                    tabIndex={-1}>
                    &#10095;</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="column flex flex-col">
            <div className='colHeader bg-doing flex items-center rounded-t justify-center'>
              <h4 className='m-2 text-textColor inline-block select-none'>In Progress</h4>
            </div>
            <div className='colContent flex-1 bg-bgGrey overflow-auto'>
              <ul id='inprogress' className='pt-2'>
                
                {inProgressItems.map((item, idx) => (
                  
                  <li
                    className='bg-white border-doing border-3 mt-2 ml-2 mr-2 p-2 flex items-center justify-center rounded'
                    key={idx}
                  >
                    <button 
                    className='ml-2 px-2 py-1 bg-doing text-textColor rounded hover:bg-blue-700'
                    onClick={() => moveToTodo(idx)}
                    tabIndex={-1}>
                    &#10094;</button>
                    <span className="w-full text-center">{item}</span>
                  <button 
                    className='ml-2 px-2 py-1 bg-doing text-textColor rounded hover:bg-blue-700'
                    onClick={() => moveToDone(idx)}
                    tabIndex={-1}>
                    &#10095;</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="column flex flex-col">
            <div className='colHeader bg-done flex items-center rounded-t justify-center'>
              <h4 className='m-2 text-textColor inline-block select-none'>Done</h4>
            </div>
            <div className='colContent flex-1 bg-bgGrey overflow-auto'>
              <ul id='done' className='pt-2'>
                
                {doneItems.map((item, idx) => (
                  
                  <li
                    className='bg-white border-done border-3 mt-2 ml-2 mr-2 p-2 flex items-center justify-center rounded'
                    key={idx}
                  >
                    <button 
                    className='ml-2 px-2 py-1 bg-done text-textColor rounded hover:bg-blue-700'
                    onClick={() => moveToInProgressDone(idx)}
                    tabIndex={-1}>
                    &#10094;</button>
                    <span className="w-full text-center">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
