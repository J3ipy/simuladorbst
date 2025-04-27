// src/App.js
import React, { useState } from 'react';
import { BST, serialize } from './bst';
import TreeVisualizer from './TreeVisualizer';
import './App.css';

export default function App() {
  const [bst] = useState(() => new BST());
  const [nodes, setNodes] = useState([]);    // array de nós serializados
  const [input, setInput] = useState('');

  const handleInsert = () => {
    const v = parseInt(input, 10);
    if (!isNaN(v)) {
      bst.insert(v);
      setNodes(serialize(bst.root));  // atualiza o array de nós
      setInput('');
    }
  };

  return (
    <div className="app">
      <h1>Visualizador de Árvore Binária</h1>
      <div className="controls">
        <input
          type="number"
          placeholder="Digite um valor"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button onClick={handleInsert}>Inserir</button>
      </div>
      <TreeVisualizer nodes={nodes} />
    </div>
  );
}
