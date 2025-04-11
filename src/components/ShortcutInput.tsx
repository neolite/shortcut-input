import React, { useState, useEffect, useRef, KeyboardEvent, FocusEvent, MouseEvent } from 'react';
import './ShortcutInput.css';

interface ShortcutInputProps {
  value: string;
  modifiers: string[];
  onChange: (value: string) => void;
}

interface ShortcutHistory {
  shortcuts: string[];
  maxSize: number;
}

const STORAGE_KEY = 'shortcut-input-history';
const MAX_HISTORY_SIZE = 5;

const ShortcutInput: React.FC<ShortcutInputProps> = ({ value, modifiers, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [currentKeys, setCurrentKeys] = useState<string[]>([]);
  const [lastValidValue, setLastValidValue] = useState<string>(value);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsedHistory: ShortcutHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory.shortcuts);
      } catch (e) {
        console.error('Failed to parse shortcut history:', e);
      }
    }
  }, []);

  // Initialize with the provided value
  useEffect(() => {
    if (value && isValidShortcut(value.split('+'))) {
      setLastValidValue(value);
    }
  }, [value]);

  // Add click event listener to close history dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Save to history when a new valid shortcut is set
  const saveToHistory = (shortcut: string) => {
    setHistory(prevHistory => {
      // Don't add if it's already the most recent item
      if (prevHistory[0] === shortcut) return prevHistory;

      // Remove if it exists elsewhere in the history
      const filteredHistory = prevHistory.filter(item => item !== shortcut);

      // Add to the beginning and limit size
      const newHistory = [shortcut, ...filteredHistory].slice(0, MAX_HISTORY_SIZE);

      // Save to localStorage
      const historyObject: ShortcutHistory = {
        shortcuts: newHistory,
        maxSize: MAX_HISTORY_SIZE
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(historyObject));

      return newHistory;
    });
  };

  // Check if the shortcut is valid
  const isValidShortcut = (keys: string[]): boolean => {
    if (keys.length < 2) return false;

    // Check if at least one modifier is present
    const hasModifier = keys.some(key => modifiers.includes(key));
    if (!hasModifier) return false;

    // Check if exactly one non-modifier key is present
    const nonModifierKeys = keys.filter(key => !modifiers.includes(key));
    return nonModifierKeys.length === 1;
  };

  // Format keys array to string format
  const formatShortcut = (keys: string[]): string => {
    return keys.join('+');
  };

  // Handle key down events
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    // Get the key name
    let key = e.key;

    // Handle special keys
    if (key === ' ') key = 'Space';
    if (key === 'Control') key = 'Control';
    if (key === 'Alt') key = 'Alt';
    if (key === 'Shift') key = 'Shift';
    if (key === 'Meta') key = 'Meta';
    if (key === 'CapsLock') key = 'CapsLock';

    // Normalize key names for consistency
    if (e.code === 'Space') key = 'Space';

    // Update current keys
    setCurrentKeys(prevKeys => {
      // If the key is already in the array, don't add it again
      if (prevKeys.includes(key)) return prevKeys;

      // Add the key to the array
      const newKeys = [...prevKeys, key];

      // Check if the new combination is valid
      if (isValidShortcut(newKeys)) {
        const formattedShortcut = formatShortcut(newKeys);
        setLastValidValue(formattedShortcut);
        onChange(formattedShortcut);
        saveToHistory(formattedShortcut);
      }

      return newKeys;
    });
  };

  // Handle key up events
  const handleKeyUp = (e: KeyboardEvent<HTMLDivElement>) => {
    let key = e.key;

    // Handle special keys
    if (key === ' ') key = 'Space';
    if (key === 'Control') key = 'Control';
    if (key === 'Alt') key = 'Alt';
    if (key === 'Shift') key = 'Shift';
    if (key === 'Meta') key = 'Meta';
    if (key === 'CapsLock') key = 'CapsLock';

    // Normalize key names for consistency
    if (e.code === 'Space') key = 'Space';

    // Remove the released key from current keys
    setCurrentKeys(prevKeys => {
      // Remove the released key
      const newKeys = prevKeys.filter(k => k !== key);

      // Check if we have a valid shortcut with the remaining keys
      const isValid = isValidShortcut(newKeys);

      // If all keys are released, always clear the current keys array
      if (newKeys.length === 0) {
        return [];
      }

      // If the remaining keys don't form a valid shortcut and we have a last valid value,
      // clear the current keys to show the last valid value
      if (!isValid && lastValidValue) {
        return [];
      }

      return newKeys;
    });
  };

  // Handle focus events
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    setIsFocused(false);
    setCurrentKeys([]);
  };

  // Handle click on the component
  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle history button click
  const handleHistoryClick = (e: MouseEvent) => {
    e.stopPropagation();
    setShowHistory(prev => !prev);
  };

  // Handle selecting a shortcut from history
  const handleHistoryItemClick = (shortcut: string) => {
    setLastValidValue(shortcut);
    onChange(shortcut);
    setShowHistory(false);
  };

  // Render active keys with visual styling (for keys currently being pressed)
  const renderActiveKeys = () => {
    if (currentKeys.length === 0) return null;

    return (
      <div className="key-container">
        {currentKeys.map((key, index) => {
          const isModifier = modifiers.includes(key);
          const keyClass = `key ${isModifier ? 'modifier' : 'regular'} pressed`;

          return (
            <React.Fragment key={key}>
              <span className={keyClass}>{key}</span>
              {index < currentKeys.length - 1 && <span className="plus-sign">+</span>}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // Render saved shortcut (for displaying the last valid shortcut)
  const renderSavedShortcut = (shortcutString: string) => {
    if (!shortcutString) return null;

    const keys = shortcutString.split('+');

    return (
      <div className="key-container">
        {keys.map((key, index) => {
          const isModifier = modifiers.includes(key);
          const keyClass = `key ${isModifier ? 'modifier' : 'regular'}`;

          return (
            <React.Fragment key={key}>
              <span className={keyClass}>{key}</span>
              {index < keys.length - 1 && <span className="plus-sign">+</span>}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // Determine what to display
  const getDisplayContent = () => {
    // If we're not focused, always show the saved shortcut (or empty state)
    if (!isFocused) {
      return lastValidValue ? renderSavedShortcut(lastValidValue) : 'Click to set shortcut';
    }

    // If we're focused and have keys being pressed, show the active keys
    if (currentKeys.length > 0) {
      return renderActiveKeys();
    }

    // If we're focused with no keys pressed but have a last valid value, show it
    if (lastValidValue) {
      return renderSavedShortcut(lastValidValue);
    }

    // Otherwise, show the focused empty state
    return 'Press keys...';
  };

  // Determine the component state class
  const getStateClass = (): string => {
    if (!isFocused && !lastValidValue) return 'empty';
    if (isFocused && !lastValidValue && currentKeys.length === 0) return 'focus';
    if (isFocused && currentKeys.length > 0 && !isValidShortcut(currentKeys)) return 'in-progress';
    if (lastValidValue || (currentKeys.length > 0 && isValidShortcut(currentKeys))) return 'valid';
    return '';
  };

  return (
    <div className="shortcut-input-container" style={{ position: 'relative' }}>
      <div
        className={`shortcut-input ${getStateClass()}`}
        tabIndex={0}
        ref={inputRef}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleClick}
      >
        {getDisplayContent()}

        {/* History button */}
        {history.length > 0 && (
          <div className="history-button" onClick={handleHistoryClick}>
            ↻
          </div>
        )}
      </div>

      {/* History dropdown */}
      {showHistory && history.length > 0 && (
        <div className="history-dropdown" ref={historyRef}>
          {history.map((shortcut, index) => (
            <div
              key={index}
              className="history-item"
              onClick={() => handleHistoryItemClick(shortcut)}
            >
              {shortcut}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShortcutInput;
