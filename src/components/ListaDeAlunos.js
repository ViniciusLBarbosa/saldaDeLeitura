import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles.css';

function ListaDeAlunos() {
  const [aluno, setAluno] = useState([]);
  const [livros, setLivros] = useState([]);
  const [ordenacao, setOrdenacao] = useState({ campo: 'nome', direcao: 'asc' }); // Campo inicial: 'nome'

  const deletarAluno = async (id) => {
    if (window.confirm('Tem certeza que deseja remover esse aluno?')) {
      try {
        await deleteDoc(doc(db, 'alunos', id));
        setAluno(aluno.filter(aluno => aluno.id !== id));
      } catch (error) {
        console.error('Erro ao deletar aluno:', error);
      }
    }
  };

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const alunosCollection = collection(db, 'alunos');
        const alunosSnapshot = await getDocs(alunosCollection);
        const alunosList = alunosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAluno(alunosList);
      } catch (error) {
        console.error('Erro ao buscar aluno:', error);
      }
    };
    
    const fetchLivros = async () => { // Função para buscar livros
      try {
        const livrosCollection = collection(db, 'livros');
        const livrosSnapshot = await getDocs(livrosCollection);
        const livrosList = livrosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLivros(livrosList);
      } catch (error) {
        console.error('Erro ao buscar livros:', error);
      }
    };

    fetchAlunos();
    fetchLivros(); // Chama a função para buscar livros
  }, []);

  const ordenarAlunos = (campo) => {
    setOrdenacao(prevOrdenacao => ({
      campo: campo,
      direcao: prevOrdenacao.campo === campo && prevOrdenacao.direcao === 'asc' ? 'desc' : 'asc'
    }));

    setAluno(prevAluno => [...prevAluno].sort((a, b) => {
      if (campo === 'serie') { // Ordenação numérica para 'serie'
        return (a[campo] - b[campo]) * (ordenacao.direcao === 'asc' ? 1 : -1);
      } else { 
        const valorA = a[campo].toLowerCase();
        const valorB = b[campo].toLowerCase();
        return valorA.localeCompare(valorB) * (ordenacao.direcao === 'asc' ? 1 : -1);
      }
    }));
  };

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => ordenarAlunos('nome')}>Aluno</th> {/* Ordenar por 'nome' */}
          <th onClick={() => ordenarAlunos('serie')}>Ano/Série</th> {/* Ordenar por 'serie' */}
          <th>Livros Emprestados</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {aluno.map((aluno) => (
          <tr key={aluno.id}>
            <td>{aluno.nome}</td> {/* Exibir 'nome' */}
            <td>{aluno.serie}</td> {/* Exibir 'serie' */}
            <td>
              <ul> {/* Lista de livros emprestados */}
                {livros
                  .filter(livro => livro.alunoEmprestado === aluno.id)
                  .map(livro => (
                    <li key={livro.id}>{livro.titulo}</li>
                  ))}
              </ul>
            </td>
            <td>
              <button className='botoes' onClick={() => deletarAluno(aluno.id)}>Remover Aluno</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ListaDeAlunos;