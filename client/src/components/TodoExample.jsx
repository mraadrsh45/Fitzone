import { useEffect, useState } from 'react';
import { createClient } from '../supabase/client';

export default function TodoExample() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('todos').select();
        if (error) throw error;
        setTodos(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  if (loading) return <div style={{ color: '#9ca3af', fontSize: '14px' }}>Loading todos...</div>;
  if (error) return <div style={{ color: '#ef4444', fontSize: '14px' }}>Error: {error}</div>;

  return (
    <div style={{
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '12px',
      maxWidth: '400px'
    }}>
      <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#fff' }}>Todos List</h3>
      {todos.length === 0 ? (
        <p style={{ color: '#6b7280', fontSize: '13px' }}>No todos found in table 'todos'.</p>
      ) : (
        <ul style={{ paddingLeft: '20px', color: '#9ca3af' }}>
          {todos.map((todo) => (
            <li key={todo.id} style={{ marginBottom: '6px', fontSize: '14px' }}>
              {todo.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
