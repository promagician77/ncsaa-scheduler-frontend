# React setState Error Fix

## 🐛 Error Description

**Error Message:**
```
Cannot update a component ('Home') while rendering a different component ('ScheduleGenerator'). 
To locate the bad setState() call inside 'ScheduleGenerator', follow the stack trace.
```

## 🔍 Root Cause

The error occurred in `ScheduleGenerator.tsx` at line 16 where state was being updated **during the render phase**:

```typescript
// ❌ WRONG - This runs during render
export default function ScheduleGenerator({ onScheduleGenerated }: ScheduleGeneratorProps) {
  const { schedule, isLoading, ... } = useScheduleGenerator();

  // This executes during render, causing the parent's setState to be called during render
  if (schedule && !isLoading) {
    onScheduleGenerated(schedule);  // ❌ Sets state in parent component
  }

  return (/* JSX */);
}
```

### Why This is Wrong

1. React renders components in a specific order
2. During `ScheduleGenerator`'s render, the code calls `onScheduleGenerated()`
3. This triggers `setSchedule()` in the parent `Home` component
4. React detects that state is being updated while still rendering
5. This violates React's unidirectional data flow rules

## ✅ Solution

Move the state update into a `useEffect` hook, which runs **after** the render is complete:

```typescript
// ✅ CORRECT - Use useEffect
import { useEffect } from 'react';

export default function ScheduleGenerator({ onScheduleGenerated }: ScheduleGeneratorProps) {
  const { schedule, isLoading, ... } = useScheduleGenerator();

  // Runs AFTER render completes
  useEffect(() => {
    if (schedule && !isLoading) {
      onScheduleGenerated(schedule);
    }
  }, [schedule, isLoading, onScheduleGenerated]);

  return (/* JSX */);
}
```

### Why This Works

1. `useEffect` runs **after** React finishes rendering
2. By the time `onScheduleGenerated()` is called, rendering is complete
3. The parent component can safely update its state
4. React will trigger a new render cycle properly

## 📝 General Rule

**Never call setState (or functions that call setState) directly in the component body during render.**

### ✅ Allowed Patterns

```typescript
// 1. In useEffect
useEffect(() => {
  setState(newValue);
}, [dependency]);

// 2. In event handlers
<button onClick={() => setState(newValue)}>Click</button>

// 3. In async functions
const handleClick = async () => {
  const data = await fetchData();
  setState(data);
};
```

### ❌ Forbidden Patterns

```typescript
// 1. Direct in component body
function Component() {
  if (condition) {
    setState(value);  // ❌ Wrong!
  }
  return <div>...</div>;
}

// 2. In render logic
function Component() {
  const data = someCondition ? setState(value) : null;  // ❌ Wrong!
  return <div>...</div>;
}
```

## 🎯 Key Takeaway

Use `useEffect` for side effects (like updating parent state) that should happen in response to state changes, not during the render itself.

## 📚 References

- [React Rules of Hooks](https://react.dev/reference/rules)
- [React setState in render](https://react.dev/link/setstate-in-render)
- [useEffect Hook](https://react.dev/reference/react/useEffect)
