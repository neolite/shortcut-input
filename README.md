# ShortcutInput Component

A React component for capturing and validating keyboard shortcuts with a game-inspired UI style. This component provides an intuitive interface for users to set keyboard shortcuts in your React applications.

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue.svg)](https://github.com/neolite/shortcut-input)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- Game-style UI for capturing keyboard shortcuts
- Validates shortcuts in real-time
- Memorizes successful key bindings using localStorage
- History dropdown to quickly select previous shortcuts
- Handles different states (empty, focus, in progress, valid)
- Seamlessly integrates with form states

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/neolite/shortcut-input.git
cd shortcut-input

# Install dependencies
npm install
```

### Using in Your Project

You can copy the `ShortcutInput` component into your own project:

1. Copy the `src/components/ShortcutInput.tsx` file to your project
2. Copy the `src/components/ShortcutInput.css` file to your project
3. Import and use the component as shown in the [Usage](#usage) section

### Running the Development Server

```bash
# Start the development server
npm run dev
```

This will start the development server at [http://localhost:5173](http://localhost:5173).

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## Testing

The component includes comprehensive tests to ensure it works as expected.

```bash
# Run tests once
npm test

# Run tests with detailed output
npx vitest run --reporter=verbose

# Run tests in watch mode
npm run test:watch
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
      {/* Example output: Control+Alt+L */}
    </div>
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `value` | string | Current shortcut value (e.g., 'Control+Shift+A'). Component integrates seamlessly with form states. |
| `modifiers` | string[] | Array of modifier keys (e.g., ['Control', 'Alt', 'Shift', 'CapsLock', 'Meta']). |
| `onChange` | function | Callback function that receives the valid shortcut string (e.g., 'Control+Shift+A'). |

## Validation Logic

A valid shortcut must contain:
- At least one modifier key from the `modifiers` prop
- Exactly one non-modifier key

### Valid Examples

- 'Control+Shift+A'
- 'Shift+A'
- 'Alt+F4'
- 'Control+Alt+Delete'

### Invalid Examples

- 'Control+Shift+CapsLock' (no non-modifier key)
- 'Control+Shift' (no non-modifier key)
- 'A' (no modifier key)

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

## Recent Improvements

### Key Encoding Fix

The component now properly handles key encoding to ensure consistent display of keyboard shortcuts across different browsers and keyboard layouts:

- Letter keys are displayed in uppercase (e.g., 'A' instead of 'a')
- Special characters are properly normalized
- Fixed issues with non-ASCII characters in some keyboard layouts

### Enhanced Key Visualization

- Improved the visual feedback for pressed keys
- Fixed issues where keys appeared to remain pressed after releasing them
- Better separation between active input and saved shortcuts

### Improved State Management

- More reliable state transitions between different component states
- Better handling of focus and blur events
- Improved validation logic for keyboard shortcuts

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

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Run tests to ensure they pass (`npm test`)
5. Commit your changes (`git commit -m 'Add some feature'`)
6. Push to the branch (`git push origin feature/your-feature-name`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
