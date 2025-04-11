import { useState } from 'react'
import './App.css'
import ShortcutInput from './components/ShortcutInput'

function App() {
  const [shortcut, setShortcut] = useState<string>('')

  const handleReset = () => {
    setShortcut('')
    // Clear localStorage history if needed
    localStorage.removeItem('shortcut-input-history')
  }

  return (
    <div className="app-container">
      <h1 className="game-title">KEYBIND MASTER</h1>
      <p className="game-subtitle">Configure your game controls with style</p>

      <div className="demo-container">
        <h2>Configure Game Controls</h2>

        <div className="current-value">
          {shortcut ? (
            <>
              <span>Current Binding: </span>
              <strong>{shortcut}</strong>
            </>
          ) : (
            <span>No keybinding set</span>
          )}
        </div>

        <div className="input-container">
          <label>Set Action Keybind:</label>
          <ShortcutInput
            value={shortcut}
            modifiers={['Control', 'Alt', 'Shift', 'CapsLock', 'Meta']}
            onChange={(value) => setShortcut(value)}
          />
        </div>

        <button className="reset-button" onClick={handleReset}>
          Reset Keybinds
        </button>

        <div className="instructions">
          <h3>How to Configure:</h3>
          <ul>
            <li>Click on the input field to activate</li>
            <li>Press a combination of keys (at least one modifier key + one regular key)</li>
            <li>Your previous valid keybinds are saved and accessible via the history button</li>
            <li>Valid example: Control+Shift+A</li>
            <li>Invalid example: Control+Shift or just A</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
