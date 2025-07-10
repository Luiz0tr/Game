const somClick = document.getElementById("somClick");
const caixaPerguntas = document.getElementById("caixaPerguntas");
const caixaAlternativas = document.getElementById("caixaAlternativas");
const caixaResultado = document.getElementById("caixaResultado");
const textoResultado = document.getElementById("textoResultado");
const loader = document.getElementById("loader");
const btnMenu = document.getElementById("btnMenu");
const menuLateral = document.getElementById("menuLateral");
const barraSanidade = document.querySelector("#barraSanidade .nivel");

btnMenu.addEventListener("click", () => {
  menuLateral.classList.toggle("ativo");
});

function tocarSom() {
  somClick.currentTime = 0;
  somClick.play();
}

let sanidade = 100;
let timerSanidade;

const narrativa = [
  // Aqui entram os blocos que você já tem (0 a 16)
  {
    texto: "Você acorda em uma cápsula escura. A sirene de emergência toca baixo, quase um sussurro eletrônico. Há sangue seco na parede. Uma voz metálica diz: 'BEM-VINDO DE VOLTA... SUJEITO 17'.",
    opcoes: [
      { texto: "Sair da cápsula com cuidado", sanidade: 0, proximo: 1, mensagem: null },
      { texto: "Forçar a tampa da cápsula", sanidade: -15, proximo: 2, mensagem: "O barulho estridente atraiu a atenção de algo nas sombras." }
    ],
  },
  {
    texto: "Você sai da cápsula e o corredor está escuro, iluminado apenas por luzes piscantes. Você ouve algo se arrastando. O que faz?",
    opcoes: [
      { texto: "Esconder-se e esperar", sanidade: 0, proximo: 3, mensagem: null },
      { texto: "Correr em direção à porta ao final do corredor", sanidade: -10, proximo: 4, mensagem: "O som da sua corrida ecoa, despertando algo hostil." }
    ],
  },
  {
    texto: "Algo se aproxima com passos pesados. O barulho que você fez abriu o caminho para uma criatura desconhecida. Prepare-se!",
    opcoes: [
      { texto: "Lutar com o que vier", sanidade: -20, proximo: 5, mensagem: "O combate é brutal e deixa sua mente abalada." },
      { texto: "Tentar fugir rapidamente", sanidade: -5, proximo: 4, mensagem: "Você foge, mas sente que está perdendo o controle." }
    ],
  },
  {
    texto: "Você espera em silêncio e vê uma luz passar. Parece seguro por enquanto. O que faz agora?",
    opcoes: [
      { texto: "Avançar com cautela", sanidade: 0, proximo: 6, mensagem: null },
      { texto: "Tentar comunicar-se com a voz metálica", sanidade: -10, proximo: 7, mensagem: "A voz responde com risadas distorcidas, aumentando sua ansiedade." }
    ],
  },
  {
    texto: "Você alcança uma porta trancada com um painel eletrônico. Como procede?",
    opcoes: [
      { texto: "Hackear o painel cuidadosamente", sanidade: 0, proximo: 8, mensagem: null },
      { texto: "Forçar a porta bruscamente", sanidade: -15, proximo: 9, mensagem: "O barulho ativa o alarme e a instalação começa a se fechar." }
    ],
  },
  {
    texto: "Você luta bravamente e derrota a criatura, mas seu corpo e mente estão exaustos. O que faz?",
    opcoes: [
      { texto: "Descansar por um momento", sanidade: 0, proximo: 10, mensagem: null },
      { texto: "Seguir em frente sem pausa", sanidade: -10, proximo: 11, mensagem: "Sua exaustão causa alucinações." }
    ],
  },
  {
    texto: "O caminho parece aberto. Você sente um alívio temporário, mas algo dentro de você alerta perigo.",
    opcoes: [
      { texto: "Investigar a fonte do alerta", sanidade: -10, proximo: 12, mensagem: "Era um alarme falso, mas sua mente fica perturbada." },
      { texto: "Ignorar e seguir adiante", sanidade: 0, proximo: 13, mensagem: null }
    ],
  },
  {
    texto: "A voz metálica começa a te guiar, mas suas palavras parecem contraditórias e confusas.",
    opcoes: [
      { texto: "Confiar na voz", sanidade: -15, proximo: 14, mensagem: "Você começa a duvidar da sua própria sanidade." },
      { texto: "Desligar o comunicador", sanidade: 0, proximo: 13, mensagem: null }
    ],
  },
  {
    texto: "O painel é hackeado com sucesso e a porta se abre lentamente. Você avança.",
    opcoes: [
      { texto: "Explorar a sala escura", sanidade: -5, proximo: 15, mensagem: "A escuridão pesa na sua mente." },
      { texto: "Passar rapidamente para o corredor ao lado", sanidade: 0, proximo: 13, mensagem: null }
    ],
  },
  {
    texto: "O alarme soa alto e as portas começam a se fechar. Você está preso!",
    final: true,
    resultado: "Você foi capturado pela segurança automatizada da instalação. Fim ruim.",
  },
  {
    texto: "Você descansa e recupera um pouco da sanidade, pronto para continuar.",
    opcoes: [
      { texto: "Continuar a explorar", sanidade: 0, proximo: 13, mensagem: null }
    ],
  },
  {
    texto: "Sua mente está fraca e começa a distorcer a realidade, criando ilusões perturbadoras.",
    final: true,
    resultado: "Você enlouqueceu, preso para sempre em sua própria mente. Fim ruim.",
  },
  {
    texto: "Você descobre uma sala com suprimentos médicos e consome algo para aliviar o estresse.",
    opcoes: [
      { texto: "Tomar o medicamento", sanidade: +10, proximo: 13, mensagem: "Você sente um alívio momentâneo." },
      { texto: "Ignorar e seguir em frente", sanidade: 0, proximo: 13, mensagem: null }
    ],
  },
  {
    texto: "Você segue pelo corredor com mais calma, sentindo que consegue controlar o medo.",
    opcoes: [
      { texto: "Investigar ruídos estranhos", sanidade: -10, proximo: 15, mensagem: "Os sons despertam seus piores pesadelos." },
      { texto: "Ignorar e seguir adiante", sanidade: 0, proximo: 16, mensagem: null }
    ],
  },
  {
    texto: "A voz metálica te guia para uma saída secreta. Você sente esperança.",
    final: true,
    resultado: "Você escapou da instalação! Fim bom.",
  },
  {
    texto: "A sala está vazia, exceto por sombras que se movem nas paredes.",
    final: true,
    resultado: "Você se perde nas sombras para sempre. Fim neutro.",
  },

  // CONTINUAÇÃO CRIATIVA

  // 16 já existe — vou começar o próximo índice no 17
  {
    texto: "Ao seguir adiante, você encontra uma escotilha no chão, semiaberta. Parece levar a um nível inferior. O que faz?",
    opcoes: [
      { texto: "Descer pela escotilha", sanidade: 0, proximo: 17, mensagem: null },
      { texto: "Ignorar e continuar pelo corredor", sanidade: -5, proximo: 18, mensagem: "Você sente que perdeu algo importante ao ignorar a escotilha." }
    ],
  },
  {
    texto: "Você desce pela escotilha e encontra uma sala cheia de equipamentos antigos. Um terminal piscando chama sua atenção.",
    opcoes: [
      { texto: "Tentar acessar o terminal", sanidade: -5, proximo: 19, mensagem: "O sistema está corrompido, mas você encontra pistas sobre o local." },
      { texto: "Ignorar o terminal e explorar a sala", sanidade: 0, proximo: 20, mensagem: null }
    ],
  },
  {
    texto: "Você continua pelo corredor e chega a uma bifurcação: um lado tem uma luz fraca piscando; o outro é mergulhado em completa escuridão.",
    opcoes: [
      { texto: "Ir para a luz fraca", sanidade: 0, proximo: 21, mensagem: null },
      { texto: "Aventurar-se na escuridão", sanidade: -10, proximo: 22, mensagem: "Você tropeça em algo desconhecido e sente uma dor aguda." }
    ],
  },
  {
    texto: "No terminal, você descobre uma mensagem enigmática: 'Não confie na voz. Ela quer que você se perca.'",
    opcoes: [
      { texto: "Desligar o comunicador de vez", sanidade: +5, proximo: 23, mensagem: "Você sente um pouco de clareza na mente." },
      { texto: "Ignorar a mensagem e continuar", sanidade: -10, proximo: 24, mensagem: "Sua sanidade começa a vacilar." }
    ],
  },
  {
    texto: "A sala parece um laboratório abandonado. Você encontra amostras congeladas, algumas com seu nome escrito nelas.",
    opcoes: [
      { texto: "Investigar as amostras", sanidade: -15, proximo: 25, mensagem: "Uma visão perturbadora invade sua mente." },
      { texto: "Sair rapidamente da sala", sanidade: 0, proximo: 21, mensagem: null }
    ],
  },
  {
    texto: "Você escolhe a luz fraca e encontra uma porta com símbolos estranhos. Está trancada, mas um painel parece poder ser hackeado.",
    opcoes: [
      { texto: "Tentar hackear o painel", sanidade: -5, proximo: 26, mensagem: "O painel exibe códigos que mexem com sua cabeça." },
      { texto: "Bater na porta até abrir", sanidade: -15, proximo: 27, mensagem: "O barulho desperta algo, você ouve passos rápidos." }
    ],
  },
  {
    texto: "Na escuridão, algo te agarra. Você consegue se soltar, mas está ferido e sua sanidade cai.",
    final: true,
    resultado: "Você foi pego pela criatura das sombras. Fim ruim.",
  },
  {
    texto: "Você desliga o comunicador e sente a mente clarear. O caminho à frente parece menos ameaçador.",
    opcoes: [
      { texto: "Seguir em frente com confiança", sanidade: +10, proximo: 28, mensagem: null },
      { texto: "Ficar parado, tentando entender o que está acontecendo", sanidade: -10, proximo: 29, mensagem: "O silêncio te consome." }
    ],
  },
  {
    texto: "Você ignora a mensagem e segue, mas a voz começa a sussurrar segredos que não deveria saber.",
    final: true,
    resultado: "Sua sanidade se despedaça com os segredos obscuros. Fim ruim.",
  },
  {
    texto: "Você vê seu próprio rosto em uma das amostras, mas está desfigurado e... em decomposição.",
    final: true,
    resultado: "A verdade sobre você é horrível demais para suportar. Fim ruim.",
  },
  {
    texto: "Você retorna ao corredor da bifurcação para escolher outro caminho.",
    opcoes: [
      { texto: "Aventurar-se na escuridão", sanidade: -10, proximo: 22, mensagem: "Os perigos ainda o esperam." },
      { texto: "Seguir por um caminho diferente", sanidade: 0, proximo: 16, mensagem: null }
    ],
  },
  {
    texto: "O painel começa a mostrar imagens de sua vida, distorcidas e fragmentadas.",
    opcoes: [
      { texto: "Fechar os olhos e tentar se concentrar", sanidade: +5, proximo: 28, mensagem: "Você recupera um pouco de controle." },
      { texto: "Continuar olhando", sanidade: -20, proximo: 29, mensagem: "As imagens quebram sua mente." }
    ],
  },
  {
    texto: "Você bate na porta com força e ela se abre, revelando um corredor vazio. Mas algo está observando.",
    opcoes: [
      { texto: "Avançar rapidamente", sanidade: -10, proximo: 30, mensagem: "Algo parece estar te seguindo." },
      { texto: "Esperar e observar", sanidade: 0, proximo: 31, mensagem: null }
    ],
  },
  {
    texto: "Com a mente mais clara, você encontra um terminal que permite desligar o sistema de segurança da instalação.",
    opcoes: [
      { texto: "Desligar o sistema", sanidade: 0, proximo: 32, mensagem: "Você sente que pode controlar seu destino." },
      { texto: "Ignorar e seguir", sanidade: 0, proximo: 30, mensagem: null }
    ],
  },
  {
    texto: "Parado, você começa a ouvir vozes dentro de sua cabeça, confundindo o que é real.",
    final: true,
    resultado: "Você perde a noção da realidade e nunca mais é visto. Fim ruim.",
  },
  {
    texto: "Você avança pelo corredor, sentindo que a criatura ainda está atrás de você.",
    opcoes: [
      { texto: "Esconder-se em uma sala lateral", sanidade: 0, proximo: 31, mensagem: null },
      { texto: "Correr para tentar despistar", sanidade: -15, proximo: 33, mensagem: "Você sente seu coração disparar." }
    ],
  },
  {
    texto: "A sala lateral está vazia, mas você encontra suprimentos que restauram um pouco da sanidade.",
    opcoes: [
      { texto: "Usar os suprimentos", sanidade: +10, proximo: 28, mensagem: "Você sente um pouco de paz." },
      { texto: "Ignorar e continuar", sanidade: 0, proximo: 30, mensagem: null }
    ],
  },
  {
    texto: "Você corre, mas escorrega e cai. A criatura está próxima.",
    final: true,
    resultado: "Sua fuga termina em tragédia. Fim ruim.",
  },
  {
    texto: "Com o sistema desligado, as portas se abrem e uma saída aparece à sua frente. Finalmente, a liberdade!",
    final: true,
    resultado: "Você escapou da instalação e recuperou sua sanidade. Fim ótimo!",
  },
];

function atualizarSanidade(valor) {
  sanidade += valor;
  if (sanidade > 100) sanidade = 100;
  if (sanidade < 0) sanidade = 0;

  barraSanidade.style.width = sanidade + "%";

  if (sanidade > 60) {
    barraSanidade.style.backgroundColor = "#28a745"; // verde
  } else if (sanidade > 30) {
    barraSanidade.style.backgroundColor = "#ffc107"; // amarelo
  } else {
    barraSanidade.style.backgroundColor = "#dc3545"; // vermelho
  }

  // Liga o glitch só quando sanidade <= 30, desliga caso contrário
  ativarGlitch(sanidade <= 30);
}

function mostrarLoader(callback) {
  loader.style.display = "block";
  caixaPerguntas.style.opacity = 0;
  caixaAlternativas.style.opacity = 0;
  caixaResultado.style.opacity = 0;

  setTimeout(() => {
    loader.style.display = "none";
    callback();
  }, 1000);
}

function ativarGlitch(ativar) {
  document.body.classList.toggle("glitch-effect", ativar);
}

function iniciarTimerSanidade() {
  clearInterval(timerSanidade);
  timerSanidade = setInterval(() => {
    if (sanidade > 0) {
      atualizarSanidade(-2);
      // Aqui não precisa ativar/desativar glitch, porque já está na função atualizarSanidade
      if (sanidade <= 0) {
        clearInterval(timerSanidade);
        mostrarLoader(() => {
          textoResultado.textContent = "Sua sanidade chegou a zero. Você sucumbiu à loucura. Fim ruim.";
          caixaResultado.style.opacity = 1;
          caixaPerguntas.style.opacity = 0;
          caixaAlternativas.style.opacity = 0;
          ativarGlitch(false);
        });
      }
    }
  }, 1000);
}

function mostrarPergunta(i) {
  const bloco = narrativa[i];

  if (bloco.final) {
    mostrarLoader(() => {
      textoResultado.textContent = bloco.resultado;
      caixaResultado.style.opacity = 1;
      caixaPerguntas.style.opacity = 0;
      caixaAlternativas.style.opacity = 0;
      clearInterval(timerSanidade);
      ativarGlitch(false);
    });
    return;
  }

  mostrarLoader(() => {
    caixaPerguntas.innerHTML = `<p>${bloco.texto}</p>`;
    caixaAlternativas.innerHTML = "";

    bloco.opcoes.forEach((op) => {
      const btn = document.createElement("button");
      btn.textContent = op.texto;
      btn.classList.add("botaoAlternativa");
      btn.addEventListener("click", () => {
        tocarSom();

        if (op.sanidade >= 0) {
          clearInterval(timerSanidade);
          textoResultado.textContent = "Bom caminho";
          textoResultado.style.color = "#28a745";
          caixaResultado.style.opacity = 1;
          atualizarSanidade(op.sanidade + 5);

          setTimeout(() => {
            caixaResultado.style.opacity = 0;
            textoResultado.style.color = "";
            mostrarPergunta(op.proximo);
            iniciarTimerSanidade();
          }, 5000);
        } else {
          if (op.mensagem) {
            textoResultado.textContent = op.mensagem;
            caixaResultado.style.opacity = 1;
          } else {
            textoResultado.textContent = "";
            caixaResultado.style.opacity = 0;
          }

          atualizarSanidade(op.sanidade);

          setTimeout(() => {
            caixaResultado.style.opacity = 0;
            mostrarPergunta(op.proximo);
          }, 2000);
        }
      });

      caixaAlternativas.appendChild(btn);
    });

    caixaPerguntas.style.opacity = 1;
    caixaAlternativas.style.opacity = 1;
  });
}

iniciarTimerSanidade();
mostrarPergunta(0);
