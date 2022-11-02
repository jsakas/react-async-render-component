# react-async-render-component

> This is an experimental library for React that allows you to render components into your React tree by calling a function `asyncRender`.
>
> It was built around a primary use case of being able to programmatically display dialogs that act like promises, where they resolve or reject with a value that can be used to determine the next code path.
>
> This allows you to chain dialogs together or pass values back from dialogs without having to store them in state.
> 
## Usage

### 1. Add `AsyncRenderProvider` to your app

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AsyncRenderProvider } from 'react-async-render-component';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <AsyncRenderProvider>
    <App />
  </AsyncRenderProvider>
);
```

### 2. Build components that confirm to `AsyncRenderProps` interface

`AsyncRenderProps` extends props to contain a resolve value.

```tsx
import { useState } from 'react';
import { AsyncRenderProps } from 'react-async-render-component';

export type ConfirmationDialogProps = {
  title: string;
};

export function ConfirmationDialog(props: AsyncRenderProps<ConfirmationDialogProps>) {
  const { resolve, reject, title } = props;

  const [open, setOpen] = useState(true);

  const cancel = () => {
    reject();
    setOpen(false);
  };

  const confirm = () => {
    resolve();
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={cancel} title={title}>
      <Button onClick={cancel}>Cancel</Button>
      <Button onClick={confirm}>Continue</Button>
    </Modal>
  );
}
```

### 3. Launch components using `asyncRender` utility

```tsx
import { useAsyncRenderContext } from 'react-async-render-component';
import { ConfirmationDialog } from './ConfirmationDialog';

function App() {
  const { asyncRender } = useAsyncRenderContext();

  return (
    <Button
      onClick={() => {
        asyncRender(ConfirmationDialog, { title: 'Are you sure?' })
          .then(() => {
            console.log('do the destructive action...');
          })
          .catch((e) => {
            if (e) {
              console.error(e);
            } else {
              // operation cancelled by user, do nothing.
            }
          });
      }}
    >
      Destruction
    </Button>
  );
}
```
