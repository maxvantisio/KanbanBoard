import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/electron-vite.animate.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [todoItems, setTodoItems] = useState<string[]>([])
  const [inProgressItems, setInProgressItems] = useState<string[]>([])
  const [doneItems, setDoneItems] = useState<string[]>([])
  //const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editing, setEditing] = useState<{ idx: number, section: number } | null>(null)
  const [editingValue, setEditingValue] = useState('')

  function toClick(index: number) {
    if (index === 1) {
      setTodoItems([...todoItems, 'New Task']);
    } else if (index === 2) {
      setInProgressItems([...inProgressItems, 'New Task']);
    } else if (index === 3) {
      setDoneItems([...doneItems, 'New Task']);
    }
    
    
  }

  /* Edit text of appropiate task
   *
   * Params:
   * idx - index of item being edited
   * section - section item is in (1-3)
   */
  function handleItemClick(idx: number, section: number) {
    setEditing({idx, section})
    if (section === 1) {
      setEditingValue(todoItems[idx])
    } else if (section === 2) {
      setEditingValue(inProgressItems[idx])
    } else if (section === 3) {
      setEditingValue(doneItems[idx])
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEditingValue(e.target.value)
  }

  /* update the text of the correct item
   *
   * Params:
   * idx - index of item being updated
   * section - section item is in (1-3)
   */
  function handleInputBlur(idx: number, section: number) {

    if (section === 1) {
      const updated = [...todoItems];
      updated[idx] = editingValue;
      setTodoItems(updated);
    } else if (section === 2) {
      const updated = [...inProgressItems];
      updated[idx] = editingValue;
      setInProgressItems(updated);
    } else if (section === 3) {
      const updated = [...doneItems];
      updated[idx] = editingValue;
      setDoneItems(updated);
    }
    setEditing(null)
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>, idx: number, section: number) {
    if (e.key === 'Enter') {
      handleInputBlur(idx, section)
    }
  }

  //move task from In Progress to Done
  function moveToDone(idx: number, section: number) {
    const item = inProgressItems[idx];
    setInProgressItems(inProgressItems.filter((_, i) => i !== idx));
    setDoneItems([...doneItems, item]);
    if (JSON.stringify(editing) === JSON.stringify({idx, section})) {
      setEditing(null);
    }
  }

  /* move task from In Progress to To Do
   *
   * Params:
   * idx - item to be moved
   */
  function moveToTodo(idx: number, section: number) {
    const item = inProgressItems[idx];
    setInProgressItems(inProgressItems.filter((_, i) => i !== idx));
    setTodoItems([...todoItems, item]);
    if (JSON.stringify(editing) === JSON.stringify({idx, section})) {
      setEditing(null);
    }
  }

  /* move task from To Do or Done to In Progress
   * 
   * Params:
   * idx - index of item to be moved
   * section - section item is being moved from
   *     1 - To Do
   *     3 - Done
   */
  function moveToInProgress(idx: number, section: number) {
    if (section === 1) {
      const item = todoItems[idx];
      setTodoItems(todoItems.filter((_, i) => i !== idx))
      setInProgressItems([...inProgressItems, item])
    } else if (section === 3) {
      const item = doneItems[idx];
      setDoneItems(doneItems.filter((_, i) => i !== idx))
      setInProgressItems([...inProgressItems, item])
    }
    
    if (JSON.stringify(editing) === JSON.stringify({idx, section})) {
      setEditing(null);
    }
  }

  return (
    <>
      <div className='h-screen flex flex-col overflow-x-hidden max-w-full overflow-y-hidden'>
        <h2 className='text-center mt-4 font-bold text-2xl m-4 text-headerText'>[insert project name here]</h2>
        <div className="container flex-1 grid gap-4 px-2 grid-cols-3" style={{minHeight:0}}>
          <div className="column flex flex-col border-4 border-todoDarker rounded-lg">
            <div className="colHeader bg-todo rounded-t flex items-center justify-center cursor-pointer" onClick={() => toClick(1)}>
              <h4 className='m-2 text-textColor inline-block select-none font-semibold text-xl'>To Do</h4>
            </div>
            <div className='colContent flex-1 bg-bgTodo rounded-b overflow-auto border-r-0 border-l-0 border-b-0 border-t-3 border-todoDarker'>
              <ul id='todo' className='pt-2'>
                {todoItems.map((item, idx) => (
                  <li 
                  className='bg-todo border-todoDarker border-3 mt-2 ml-4 mr-4 mb-2 p-2 flex justify-between items-center rounded font-semibold text-xl' 
                  key={idx}>
                    <div className='flex-1 flex items-center justify-center'>
                    {JSON.stringify(editing) === JSON.stringify({idx, section: 1}) ? (
                      <input
                        value={editingValue}
                        autoFocus
                        onChange={handleInputChange}
                        onBlur={() => handleInputBlur(idx, 1)}
                        onKeyDown={e => handleInputKeyDown(e, idx, 1)}
                        className='w-full'
                      />
                    ) : (
                      <span className='w-full text-center cursor-pointer'
                      onClick={() => handleItemClick(idx, 1)}>{item}
                      </span>
                    )}
                    </div>
                    <button 
                    className='ml-2 px-2 py-1 bg-todoDarker text-bgTodo rounded hover:bg-todoDarkest hover:text-textTodoDarker cursor-pointer'
                    onClick={() => moveToInProgress(idx, 1)}
                    tabIndex={-1}>
                    &#10095;</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="column flex flex-col border-4 border-doingDarker rounded-lg">
            <div className='colHeader bg-doing flex items-center rounded-t justify-center cursor-pointer' onClick={() => toClick(2)}>
              <h4 className='m-2 text-textColor inline-block select-none font-semibold text-xl'>In Progress</h4>
            </div>
            <div className='colContent flex-1 bg-bgDoing overflow-auto rounded-b border-r-0 border-l-0 border-b-0 border-t-3 border-doingDarker'>
              <ul id='inprogress' className='pt-2'>
                
                {inProgressItems.map((item, idx) => (
                 
                  <li
                    className='bg-doing border-doingDarker border-3 mt-2 ml-4 mr-4 mb-2 p-2 flex items-center justify-center rounded font-semibold text-xl'
                    key={idx}
                  >
                    
                    <button 
                    className='mr-2 px-2 py-1 bg-doingDarker text-bgDoing rounded hover:bg-doingDarkest hover:text-textDoingDarker cursor-pointer'
                    onClick={() => moveToTodo(idx, 1)}
                    tabIndex={-1}>
                    &#10094;</button>
                    <div className='flex-1 flex items-center justify-center'>
                    {JSON.stringify(editing) === JSON.stringify({idx, section: 2}) ? (
                      <input
                        value={editingValue}
                        autoFocus
                        onChange={handleInputChange}
                        onBlur={() => handleInputBlur(idx, 2)}
                        onKeyDown={e => handleInputKeyDown(e, idx, 2)}
                        className='w-full'
                      />
                    ) : (
                      <span className='w-full text-center cursor-pointer'
                      onClick={() => handleItemClick(idx, 2)}>{item}
                      </span>
                    )}
                    </div>
                  <button 
                    className='ml-2 px-2 py-1 bg-doingDarker text-bgDoing rounded hover:bg-doingDarkst hover:text-textDoingDarker cursor-pointer'
                    onClick={() => moveToDone(idx, 2)}
                    tabIndex={-1}>
                    &#10095;</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="column flex flex-col border-4 border-doneDarker rounded-lg">
            <div className='colHeader bg-done flex items-center rounded-t justify-center cursor-pointer' onClick={() => toClick(3)}>
              <h4 className='m-2 text-textColor inline-block select-none font-semibold text-xl'>Done</h4>
            </div>
            <div className='colContent flex-1 bg-bgDone overflow-auto rounded-b border-r-0 border-l-0 border-b-0 border-t-3 border-doneDarker'>
              <ul id='done' className='pt-2'>
                
                {doneItems.map((item, idx) => (
                  
                  <li
                    className='bg-done border-doneDarker border-3 mt-2 ml-2 mr-2 p-2 flex items-center justify-center rounded font-semibold text-xl'
                    key={idx}
                  >
                    <button 
                    className='mr-2 px-2 py-1 bg-doneDarker text-bgDone rounded hover:bg-doneDarkest hover:text-textDoneDarker cursor-pointer'
                    onClick={() => moveToInProgress(idx, 3)}
                    tabIndex={-1}>
                    &#10094;</button>
                    <div className='flex-1 flex items-center justify-center'>
                        {JSON.stringify(editing) === JSON.stringify({idx, section: 3}) ? (
                          <input
                            value={editingValue}
                            autoFocus
                            onChange={handleInputChange}
                            onBlur={() => handleInputBlur(idx, 3)}
                            onKeyDown={e => handleInputKeyDown(e, idx, 3)}
                            className='w-full'
                          />
                        ) : (
                          <span className='w-full text-center cursor-pointer'
                            onClick={() => handleItemClick(idx, 3)}>{item}</span>
                        )}
                    </div>
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
