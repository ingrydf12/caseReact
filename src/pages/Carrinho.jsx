import React, { useState, useEffect } from "react";
import "../styles/Carrinho.css"; // Importando o CSS

const Carrinho = () => {
  const [carrinho, setCarrinho] = useState([]);
  const [codigoDesconto, setCodigoDesconto] = useState("");
  const [total, setTotal] = useState(0);

  const calcularTotal = (carrinhoAtual) => {
    return carrinhoAtual.reduce((acc, item) => acc + item.quantidade * item.preco, 0);
  };

  //MARK: - Inicio Crud
  const adicionarItem = (event) => {
    event.preventDefault();
    
    const nomeItem = event.target.nomeItem.value.trim();
    const quantItem = parseInt(event.target.quantItem.value);
    const precoItem = parseFloat(event.target.precoItem.value);

    if (!nomeItem || quantItem <= 0 || precoItem <= 0) return;

    setCarrinho((prevCarrinho) => {
      const itemExistente = prevCarrinho.find((item) => item.nome === nomeItem);

      let novoCarrinho;
      if (itemExistente) {
        novoCarrinho = prevCarrinho.map((item) =>
          item.nome === nomeItem ? { ...item, quantidade: item.quantidade + quantItem } : item
        );
      } else {
        novoCarrinho = [...prevCarrinho, { nome: nomeItem, quantidade: quantItem, preco: precoItem }];
      }

      setTotal(calcularTotal(novoCarrinho));
      return novoCarrinho;
    });

    event.target.reset();
  };

  const removerItem = (indice) => {
    setCarrinho((prevCarrinho) => {
      const novoCarrinho = prevCarrinho.filter((_, idx) => idx !== indice);
      setTotal(calcularTotal(novoCarrinho));
      return novoCarrinho;
    });
  };

  const aplicarDesconto = (event) => {
    event.preventDefault();

    const descontos = {
      DESC10: 0.1,
      DESC20: 0.2,
    };

    if (!descontos[codigoDesconto]) {
      alert("Código de desconto inválido.");
      return;
    }

    const desconto = descontos[codigoDesconto];
    setTotal((prevTotal) => (prevTotal * (1 - desconto)).toFixed(2));
    alert(`Desconto de ${desconto * 100}% aplicado!`);
  };

  useEffect(() => {
    setTotal(calcularTotal(carrinho));
  }, [carrinho]);

  //MARK: - INterface
  return (
    <div className="container">
      <h1>Gerenciador de Carrinho</h1>

      <form onSubmit={adicionarItem}>
        <input type="text" name="nomeItem" placeholder="Nome do item" required />
        <input type="number" name="quantItem" placeholder="Quantidade" min="1" required />
        <input type="number" name="precoItem" placeholder="Preço" step="0.01" min="0" required />
        <button type="submit">Adicionar Item</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Quantidade</th>
            <th>Preço</th>
            <th>Subtotal</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carrinho.map((item, indice) => (
            <tr key={indice}>
              <td>{item.nome}</td>
              <td>{item.quantidade}</td>
              <td>R$ {item.preco.toFixed(2)}</td>
              <td>R$ {(item.quantidade * item.preco).toFixed(2)}</td>
              <td>
                <button className="remove-button" onClick={() => removerItem(indice)}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="total">Total: R$ {total}</div>

      <form onSubmit={aplicarDesconto} className="desconto-form">
        <input type="text" value={codigoDesconto} onChange={(e) => setCodigoDesconto(e.target.value)} placeholder="Código de desconto" />
        <button type="submit">Aplicar Desconto</button>
      </form>
    </div>
  );
};

export default Carrinho;
