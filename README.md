# KEYBIND MASTER - ShortcutInput Component

A React component for capturing and validating keyboard shortcuts with a game UI style.

![Keybind Master](https://i.imgur.com/placeholder.png)

## Features

- Game-style UI for capturing keyboard shortcuts
- Validates shortcuts in real-time
- Memorizes successful key bindings using localStorage
- History dropdown to quickly select previous shortcuts
- Handles different states (empty, focus, in progress, valid)
- Seamlessly integrates with form states

## Installation

```bash
npm install
npm run dev
```

## Usage

```jsx
import { useState } from 'react';
import ShortcutInput from './components/ShortcutInput';

function App() {
  const [shortcut, setShortcut] = useState('');

  return (
    <div>
      <ShortcutInput
        value={shortcut}
        modifiers={['Control', 'Alt', 'Shift', 'CapsLock', 'Meta']}
        onChange={(value) => setShortcut(value)}
      />
      <p>Current shortcut: {shortcut}</p>
    </div>
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `value` | string | Current shortcut value (e.g., 'Control+Shift+a'). Component integrates seamlessly with form states. |
| `modifiers` | string[] | Array of modifier keys (e.g., ['Control', 'Alt', 'Shift', 'CapsLock', 'Meta']). |
| `onChange` | function | Callback function that receives the valid shortcut string (e.g., 'Control+Shift+a'). |

## Validation Logic

A valid shortcut must contain:
- At least one modifier key from the `modifiers` prop
- Exactly one non-modifier key

### Valid Examples

- 'Control+Shift+a'
- 'Shift+a'

### Invalid Examples

- 'Control+Shift+CapsLock' (no non-modifier key)
- 'Control+Shift' (no non-modifier key)
- 'a' (no modifier key)

## Component States

- **Empty state**: No input or shortcut selected
- **Focus state**: Ready to capture keyboard input
- **In progress state**: Capturing keys, rendering current pressed keys if valid state is not yet achieved
- **Valid state**: Rendering valid shortcut combination

## Game UI Features

### Visual Styling
- Game-inspired dark theme with glowing effects
- Animated key press visualization
- Color-coded keys (modifiers vs. regular keys)
- Pulsing focus state

### History System
- Automatically saves valid shortcuts to localStorage
- History dropdown accessible via the history button (↻)
- Stores up to 5 most recent valid shortcuts
- Quick selection of previous shortcuts

### Reset Functionality
- Reset button to clear current shortcut
- Option to clear shortcut history

## Customization

The component's appearance can be customized by modifying the CSS variables in the root element:

```css
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --background-color: #1a1a2e;
  --panel-color: #16213e;
  --text-color: #e1e1e1;
  --accent-color: #f39c12;
  --danger-color: #e74c3c;
}
```
