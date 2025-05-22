import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/electron-vite.animate.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [todoItems, setTodoItems] = useState<string[]>([])
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

  return (
    <>
      <div className='h-screen flex flex-col overflow-x-hidden max-w-full overflow-y-hidden'>
        <h2 className='text-center mt-4'>Welcome to my Kanban Board</h2>
        <div className="container flex-1 grid gap-2 px-2 grid-cols-3" style={{minHeight:0}}>
          <div className="column flex flex-col">
            <div className="colHeader bg-blue-600 flex items-center justify-center cursor-pointer" onClick={toClick}>
              <h4 className='m-2 text-white inline-block select-none'>To Do</h4>
            </div>
            <div className='colContent flex-1 bg-gray-600 overflow-auto'>
              <ul id='todo' className='pt-2'>
                {todoItems.map((item, idx) => (
                  <li className='bg-amber-400 mt-2' key={idx}>
                    {editingIdx === idx ? (
                      <input
                        value={editingValue}
                        autoFocus
                        onChange={handleInputChange}
                        onBlur={() => handleInputBlur(idx)}
                        onKeyDown={e => handleInputKeyDown(e, idx)}
                      />
                    ) : (
                      <span onClick={() => handleItemClick(idx)}>{item}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="column flex flex-col">
            <div className='colHeader bg-green-600 flex items-center justify-center'>
              <h4 className='m-2 text-white inline-block select-none'>In Progress</h4>
            </div>
            <div className='colContent flex-1 bg-gray-400 overflow-auto'></div>
          </div>
          <div className="column flex flex-col">
            <div className='colHeader bg-blue-950 flex items-center justify-center'>
              <h4 className='m-2 text-white inline-block select-none'>Done</h4>
            </div>
            <div className='colContent flex-1 bg-gray-200 overflow-auto'></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
