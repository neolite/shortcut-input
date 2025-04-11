import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ShortcutInput from './ShortcutInput';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('ShortcutInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('renders with empty state', () => {
    render(
      <ShortcutInput
        value=""
        modifiers={['Control', 'Alt', 'Shift', 'CapsLock', 'Meta']}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Click to set shortcut')).toBeInTheDocument();
  });

  it('renders with provided value', () => {
    render(
      <ShortcutInput
        value="Control+Shift+a"
        modifiers={['Control', 'Alt', 'Shift', 'CapsLock', 'Meta']}
        onChange={() => {}}
      />
    );

    // In the new component, we render keys as spans inside a container
    expect(screen.getByText('Control')).toBeInTheDocument();
    expect(screen.getByText('Shift')).toBeInTheDocument();
    expect(screen.getByText('a')).toBeInTheDocument();
  });

  it('changes to focus state when focused', () => {
    render(
      <ShortcutInput
        value=""
        modifiers={['Control', 'Alt', 'Shift', 'CapsLock', 'Meta']}
        onChange={() => {}}
      />
    );

    const input = screen.getByText('Click to set shortcut');
    fireEvent.focus(input);

    expect(screen.getByText('Press keys...')).toBeInTheDocument();
  });

  it('calls onChange with valid shortcut', () => {
    const handleChange = vi.fn();

    render(
      <ShortcutInput
        value=""
        modifiers={['Control', 'Alt', 'Shift', 'CapsLock', 'Meta']}
        onChange={handleChange}
      />
    );

    const container = screen.getByText('Click to set shortcut').closest('.shortcut-input') as HTMLElement;

    // Simulate pressing Control+a
    fireEvent.keyDown(container, { key: 'Control', code: 'ControlLeft' });
    fireEvent.keyDown(container, { key: 'a', code: 'KeyA' });

    expect(handleChange).toHaveBeenCalledWith('Control+A');
  });

  it('does not call onChange with invalid shortcut', () => {
    const handleChange = vi.fn();

    render(
      <ShortcutInput
        value=""
        modifiers={['Control', 'Alt', 'Shift', 'CapsLock', 'Meta']}
        onChange={handleChange}
      />
    );

    const container = screen.getByText('Click to set shortcut').closest('.shortcut-input') as HTMLElement;

    // Simulate pressing just 'a' (no modifier)
    fireEvent.keyDown(container, { key: 'a', code: 'KeyA' });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('saves valid shortcuts to history', () => {
    const handleChange = vi.fn();

    // Mock the localStorage.setItem implementation for this test
    vi.spyOn(Storage.prototype, 'setItem');

    render(
      <ShortcutInput
        value=""
        modifiers={['Control', 'Alt', 'Shift', 'CapsLock', 'Meta']}
        onChange={handleChange}
      />
    );

    const container = screen.getByText('Click to set shortcut').closest('.shortcut-input') as HTMLElement;

    // Simulate pressing Control+a
    fireEvent.keyDown(container, { key: 'Control', code: 'ControlLeft' });
    fireEvent.keyDown(container, { key: 'a', code: 'KeyA' });

    // Check that localStorage.setItem was called
    expect(localStorage.setItem).toHaveBeenCalled();
  });
});
