import React, { createContext, ReactNode, useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type AsyncRenderProps<P = {}, T = any> = P & {
  resolve: (value?: T) => void;
  reject: (reason?: any) => void;
};

export type AsyncRenderContextValue = {
  nodes: Record<string, ReactNode>;
  asyncRender: <P = {}, T = any>(
    Component: (props: AsyncRenderProps<P, T>) => JSX.Element | null,
    props: P
  ) => Promise<T | undefined>;
};

export const AsyncRenderContext = createContext<AsyncRenderContextValue>({
  nodes: {},
  asyncRender: <P = {}, T = any>(
    Component: (props: AsyncRenderProps<P, T>) => JSX.Element | null,
    props: P
  ) => {
    return new Promise<T | undefined>((resolve) => {
      resolve(undefined as unknown as T);
    });
  },
});

export function useAsyncRenderContext(): AsyncRenderContextValue {
  const context = useContext(AsyncRenderContext);

  return context;
}

export enum ActionType {
  AddNode = 'AddNode',
  RemoveNode = 'RemoveNode',
}

export type Action = AddNodeAction | RemoveNodeAction;

export type AddNodeAction = {
  type: ActionType.AddNode;
  id: string;
  component: ReactNode;
};

export type RemoveNodeAction = {
  type: ActionType.RemoveNode;
  id: string;
};

function reducer(state: AsyncRenderContextValue['nodes'], action: Action) {
  switch (action.type) {
    case ActionType.AddNode:
      return {
        ...state,
        [action.id]: action.component,
      };
    case ActionType.RemoveNode: {
      const nextState = { ...state };
      delete nextState[action.id];
      return nextState;
    }
    default:
      return state;
  }
}

type AsyncRenderProviderProps = {
  children?: React.ReactNode;
  cleanupTimeout?: number;
};

export function AsyncRenderProvider({
  children,
  cleanupTimeout = 3000,
}: AsyncRenderProviderProps): JSX.Element {
  const [nodes, dispatch] = useReducer(reducer, {});

  const asyncRender = <P = {}, T = any>(
    Component: (props: AsyncRenderProps<P, T>) => JSX.Element | null,
    props: P
  ) => {
    return new Promise<T | undefined>((resolve, reject) => {
      const uuid = uuidv4();

      const cleanup = () => {
        setTimeout(() => {
          dispatch({
            type: ActionType.RemoveNode,
            id: uuid,
          });
        }, cleanupTimeout);
      };

      dispatch({
        type: ActionType.AddNode,
        id: uuid,
        component: (
          <Component
            resolve={(v) => {
              resolve(v);
              cleanup();
            }}
            reject={(v) => {
              reject(v);
              cleanup();
            }}
            {...props}
          />
        ),
      });
    });
  };

  return (
    <AsyncRenderContext.Provider
      value={{
        nodes,
        asyncRender,
      }}
    >
      {children}

      {Object.keys(nodes).map((key) => {
        const node = nodes[key];

        return <React.Fragment key={key}>{node}</React.Fragment>;
      })}
    </AsyncRenderContext.Provider>
  );
}
