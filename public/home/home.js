let produtosAtuais = [];
let produtoEmEdicaoId = null;

function logout(){
    firebase.auth().signOut().then(() =>{
        window.location.href = "../index.html";
    }).catch(()=>{
        alert('erro ao fazer logout');
    })
}

function preencherTabela(produtos) {// produto é o paramentro futuro para cadastro
    const tabela = document.getElementById('tabela-produtos');
    tabela.innerHTML = ''; // Limpa a tabela antes de preencher
    // Adiciona cada produto na tabela
    produtos.forEach(produto => {
      const linha = document.createElement('tr');

      linha.innerHTML = `
      <td>${produto.nome}</td>
      <td>${produto.tipo}</td>
      <td>R$ ${produto.preco}</td>
      <td>${produto.quantidade}</td>
      <td>${produto.situacao}</td>
      <td>
  <button onclick="editarProduto('${produto.id}')">Editar</button>
  <button onclick="excluirProduto('${produto.id}')">Excluir</button>
</td>
    `;

      tabela.appendChild(linha);
    });
  }

firebase.auth().onAuthStateChanged(user => {
    if (user){
        findProducts(user);
    }
});

function findProducts(user) {
    firebase.firestore()
      .collection('produtos')
      .where('usuario', '==', user.uid)
      .get()
      .then(snapshot => {
        const produtos = [];
  
        snapshot.forEach(doc => {
          const dados = doc.data();
          console.log(`Produto carregado:`, dados);
          produtos.push({
            id: doc.id,
            nome: dados.nome,
            tipo: dados.tipo,
            preco: dados.preco,
            quantidade: dados.quantidade,
            situacao: dados.situacao
          });
        });
  
        produtosAtuais = produtos;
        preencherTabela(produtos);
      })
      .catch(error => {
        console.error("Erro ao buscar produtos: ", error);
      }); 
  }
  
      
  
  function novoProduto() {
    const form = document.getElementById('form-produto');
    form.style.display = 'flex'; // Mostra o formulário
  }

  function cancelarProduto() {
    const form = document.getElementById('form-produto');
    form.style.display = 'none';
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => input.value = '');
    produtoEmEdicaoId = null;
  }
  
  
  
  function salvarProduto() {
    const user = firebase.auth().currentUser;
    if (!user) {
      alert('Usuário não autenticado!');
      return;
    }
  
    const nome = document.getElementById('nome').value;
    const tipo = document.getElementById('tipo').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const situacao = document.getElementById('situacao').value;
  
    if (!nome || !tipo || isNaN(preco) || isNaN(quantidade) || !situacao) {
      alert('Preencha todos os campos corretamente!');
      return;
    }
  
    const produtoParaSalvar = {
      usuario: user.uid,
      nome,
      tipo,
      preco,
      quantidade,
      situacao
    };
  
    if (produtoEmEdicaoId) {
      // Atualiza produto existente
      firebase.firestore()
        .collection('produtos')
        .doc(produtoEmEdicaoId)
        .update(produtoParaSalvar)
        .then(() => {
          console.log('Produto atualizado:', produtoEmEdicaoId);
  
          // Atualiza a lista local
          produtosAtuais = produtosAtuais.map(p => 
            p.id === produtoEmEdicaoId ? { id: produtoEmEdicaoId, ...produtoParaSalvar } : p
          );
          preencherTabela(produtosAtuais);
          cancelarProduto();
          produtoEmEdicaoId = null;
        })
        .catch(error => {
          console.error('Erro ao atualizar produto:', error);
          alert('Erro ao atualizar produto.');
        });
  
    } else {
      // Cria novo produto
      firebase.firestore()
        .collection('produtos')
        .add(produtoParaSalvar)
        .then(docRef => {
          console.log('Produto adicionado com ID:', docRef.id);
  
          produtosAtuais.unshift({
            id: docRef.id,
            ...produtoParaSalvar
          });
          preencherTabela(produtosAtuais);
          cancelarProduto();
        })
        .catch(error => {
          console.error('Erro ao salvar produto:', error);
          alert('Erro ao salvar produto.');
        });
    }
  }
    

  function excluirProduto(id) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      firebase.firestore()
        .collection('produtos')
        .doc(id)
        .delete()
        .then(() => {
          console.log("Produto excluído com sucesso:", id);
          // Remove da lista local e atualiza a tabela
          produtosAtuais = produtosAtuais.filter(p => p.id !== id);
          preencherTabela(produtosAtuais);
        })
        .catch(error => {
          console.error("Erro ao excluir produto:", error);
          alert("Erro ao excluir produto.");
        });
    }
  }

  function editarProduto(id) {
    const produto = produtosAtuais.find(p => p.id === id);
    if (!produto) return alert("Produto não encontrado!");
  
    // Preenche os campos
    document.getElementById('nome').value = produto.nome;
    document.getElementById('tipo').value = produto.tipo;
    document.getElementById('preco').value = produto.preco;
    document.getElementById('quantidade').value = produto.quantidade;
    document.getElementById('situacao').value = produto.situacao;
  
    // Mostra o formulário
    document.getElementById('form-produto').style.display = 'flex';
  
    // Guarda o ID em edição
    produtoEmEdicaoId = id;
  }
  
  function aplicarFiltros() {
    const tipo = document.getElementById('filtro-tipo').value.toLowerCase();
    const situacao = document.getElementById('filtro-situacao').value;
    const precoMin = parseFloat(document.getElementById('preco-min').value);
    const precoMax = parseFloat(document.getElementById('preco-max').value);
  
    const produtosFiltrados = produtosAtuais.filter(p => {
      const tipoMatch = !tipo || p.tipo.toLowerCase().includes(tipo);
      const situacaoMatch = !situacao || p.situacao === situacao;
      const precoMatch =
        (!precoMin || p.preco >= precoMin) &&
        (!precoMax || p.preco <= precoMax);
  
      return tipoMatch && situacaoMatch && precoMatch;
    });
  
    preencherTabela(produtosFiltrados);
  }
  function aplicarFiltros() {
    const tipoFiltro = document.getElementById('filtro-tipo').value.trim().toLowerCase();
    const situacaoFiltro = document.getElementById('filtro-situacao').value;
    const precoMin = parseFloat(document.getElementById('preco-min').value);
    const precoMax = parseFloat(document.getElementById('preco-max').value);
  
    let filtrados = produtosAtuais.filter(produto => {
      const tipoMatch = tipoFiltro === '' || produto.tipo.toLowerCase().includes(tipoFiltro);
      const situacaoMatch = situacaoFiltro === '' || produto.situacao === situacaoFiltro;
      const precoMatch =
        (isNaN(precoMin) || produto.preco >= precoMin) &&
        (isNaN(precoMax) || produto.preco <= precoMax);
  
      return tipoMatch && situacaoMatch && precoMatch;
    });
  
    preencherTabela(filtrados);
  }    