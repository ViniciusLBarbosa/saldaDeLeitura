import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles.css';


function CadastroLivro() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [numeroTombo, setNumeroTombo] = useState('');
  const [editora, setEditora] = useState('');
  const [genero, setGenero] = useState('');


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await addDoc(collection(db, 'livros'), {
        titulo: titulo,
        autor: autor,
        numeroTombo: numeroTombo,
        editora: editora,
        genero: genero,
        emprestado: false 
      });

      setTitulo('');
      setAutor('');
      setNumeroTombo('');
      setEditora('');
      setGenero('');


      alert('Livro cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar livro:', error);
      alert('Erro ao cadastrar livro.');
    }
  };

  

  return (
    
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="titulo">Título:</label>
        <input
          type="text"
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <label htmlFor="autor">Autor:</label>
        <input
          type="text"
          id="autor"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          required
        />
        <label htmlFor="editora">Editora:</label>
        <input
          type="text"
          id="editora"
          value={editora}
          onChange={(e) => setEditora(e.target.value)}
          required
        />
        <label htmlFor="genero">Gênero:</label>
        <input
          type="text"
          id="genero"
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
          required
        />
        <label htmlFor="numeroTombo">Número tombo:</label>
        <input
          type="text"
          id="NumeroTombo"
          value={numeroTombo}
          onChange={(e) => setNumeroTombo(e.target.value)}
          required
        />
      </div>
      
      <button type="submit">Cadastrar</button>
    </form>
  );
}

export default CadastroLivro;
