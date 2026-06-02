async function guardarPlanoNoServidor() {
  const erva = document.querySelector('#view-planos select').value; // Apanha a erva selecionada
  const tipo = document.getElementById('tipoPlano').value;

  if (!tipo) {
    alert("Por favor, selecione o tipo de plano!");
    return;
  }

  // Objeto base que vai ser enviado por JSON
  let dadosForm = {
    ervaAromatica: erva,
    tipo: tipo
  };

  // Preenche dinamicamente os dados dependendo do tipo selecionado
  if (tipo === 'regular') {
    dadosForm.temperatura = document.getElementById('plano-temp').value;
    dadosForm.humidade = document.getElementById('plano-hum').value;
    dadosForm.luminosidade = document.getElementById('plano-luz').value;
    dadosForm.planoRega = document.getElementById('plano-rega').value;
    dadosForm.fertilizacao = document.getElementById('plano-fertilizacao').value;
    dadosForm.duracaoPrevistaDias = document.getElementById('plano-duracao').value;
  } else if (tipo === 'emergencia') {
    dadosForm.problema = document.getElementById('plano-problema').value;
    dadosForm.tipoIntervencao = document.getElementById('plano-intervencao').value;
    dadosForm.dosagemIntensidade = document.getElementById('plano-intensidade').value;
    dadosForm.intervaloMinIntervencoesMinutos = document.getElementById('plano-intervalo').value;
  } else if (tipo === 'pontual') {
    dadosForm.descricao = document.getElementById('plano-descricao').value;
    dadosForm.motivo = document.getElementById('plano-motivo').value;
  }

  try {
    // Faz o pedido POST para o teu backend local (Porta standard 5000 ou 3000)
    const resposta = await fetch('http://localhost:5000/api/planos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosForm)
    });

    const resultado = await resposta.json();
    
    if (resposta.ok) {
      alert("Sucesso: " + resultado.mensagem);
    } else {
      alert("Erro do servidor: " + resultado.erro);
    }
  } catch (error) {
    console.error("Erro na rede:", error);
    alert("Não foi possível contactar o servidor backend.");
  }
}