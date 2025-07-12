'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

// Mock API functions
const fetchTodos = async (): Promise<{ id: number; title: string; completed: boolean }[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock data
  return [
    { id: 1, title: 'Learn React Query', completed: false },
    { id: 2, title: 'Build awesome app', completed: false },
    { id: 3, title: 'Deploy to production', completed: false },
  ];
};

const addTodo = async (title: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { id: Date.now(), title, completed: false };
};

const toggleTodo = async (id: number) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { id, completed: true };
};

export function QueryExample() {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const queryClient = useQueryClient();

  // Query for fetching todos
  const {
    data: todos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  // Mutation for adding new todo
  const addTodoMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setNewTodoTitle('');
    },
  });

  // Mutation for toggling todo
  const toggleTodoMutation = useMutation({
    mutationFn: toggleTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      addTodoMutation.mutate(newTodoTitle);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="text-red-600">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>Failed to load todos. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">React Query Example</h2>

      {/* Add new todo form */}
      <form onSubmit={handleAddTodo} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoTitle}
            onChange={e => setNewTodoTitle(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={addTodoMutation.isPending || !newTodoTitle.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {addTodoMutation.isPending ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>

      {/* Todo list */}
      <div className="space-y-2">
        {todos?.map(todo => (
          <div
            key={todo.id}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
          >
            <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {todo.title}
            </span>
            {!todo.completed && (
              <button
                onClick={() => toggleTodoMutation.mutate(todo.id)}
                disabled={toggleTodoMutation.isPending}
                className="px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {toggleTodoMutation.isPending ? 'Completing...' : 'Complete'}
              </button>
            )}
          </div>
        ))}
      </div>

      {todos?.length === 0 && (
        <p className="text-gray-500 text-center py-4">No todos yet. Add one above!</p>
      )}
    </div>
  );
}
