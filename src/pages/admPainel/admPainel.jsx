import React, { useState, useEffect } from 'react';
import './index.scss';
import TeamForm from '../../components/teamForm/teamForm';

const AdmPainel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [data, setData] = useState([]);
  const [token, setToken] = useState(''); // Armazenar o token JWT
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Função para realizar login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://backendbhcdnc.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid username or password');
      }

      const data = await response.json();
      setToken(data.token); // Armazena o token JWT
      setIsAuthenticated(true); 
      fetchData(data.token); // Busca os dados do painel com o token JWT
    } catch (error) {
      setError(error.message);
    }
  };

  // Função para buscar os dados do painel
  const fetchData = async (jwtToken) => {
    try {
      const response = await fetch('https://backendbhcdnc.onrender.com/api/admin', {
        headers: {
          Authorization: `Bearer ${jwtToken}`, // Adiciona o token JWT no cabeçalho da requisição
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar os dados');
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Erro ao buscar os dados:', error);
    }
  };

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div>
      <h1>Painel Administrativo</h1>

      {!isAuthenticated ? (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {error && <p className="error">{error}</p>}
        </form>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Contato</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Eircode</th>
                <th>Endereço</th>
                <th>Número</th>
                <th>Complemento</th>
                <th>Serviços</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.Contact}</td>
                  <td>{item.Email}</td>
                  <td>{item.Phone}</td>
                  <td>{item.Eircode}</td>
                  <td>{item.Address}</td>
                  <td>{item.AddressNumber}</td>
                  <td>{item.Complement}</td>
                  <td>{item.Services}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Botões de paginação */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Botão de refresh */}
          <button onClick={() => fetchData(token)}>Atualizar</button>
        </div>
      )}
    </div>
  );
};

export default AdmPainel;
