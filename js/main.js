// Repeat the reveal in both scroll directions, without hiding content if JS fails.
function setupScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const selector = [
    '.hero-content > *', '.values .container > *', '.section-heading',
    '.service-card', '.about-grid > *', '#depoimentos > .eyebrow',
    '#depoimentos > h2', '#depoimentos > .small-note', '.testimonial',
    '.visit-grid > *', '.map', '.contact-grid > *', '.closing .container',
    '.service-intro > .back-link', '.service-detail-grid > *',
    '.detail-content > *', '.faq > .eyebrow', '.faq > h2',
    '.accordion-item', '.footer-top > *', '.footer-bottom', 'footer > .academic',
  ].join(', ');
  const elements = [...document.querySelectorAll(selector)];
  let observer;

  const refresh = () => {
    observer?.disconnect();
    elements.forEach(element => element.classList.remove('scroll-reveal', 'is-visible'));
    if (motionPreference.matches) return;

    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { rootMargin: '-85px 0px -28px 0px', threshold: 0 });

    elements.forEach(element => {
      // Preserve the first viewport and restored scroll positions without a flash.
      const rect = element.getBoundingClientRect();
      element.classList.toggle('is-visible', rect.bottom > 85 && rect.top < window.innerHeight - 28);
      element.classList.add('scroll-reveal');
      observer.observe(element);
    });
  };

  motionPreference.addEventListener('change', refresh);
  refresh();
}

setupScrollReveal();

document.querySelectorAll('#menu a').forEach(link => link.addEventListener('click', () => {
  const menu = document.getElementById('menu');
  if (menu.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(menu).hide();
}));
const dateInput = document.querySelector('input[type="date"]');
if (dateInput) {
  dateInput.min = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo' }).format(new Date());
}

document.querySelectorAll('form[data-api]').forEach(form => {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    if (button.disabled || !form.reportValidity()) return;

    const status = form.querySelector('[role="status"]');
    button.disabled = true;
    status.textContent = 'Enviando…';
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
      });
      const result = await response.json();
      status.textContent = result.mensagem;
      if (response.ok) form.reset();
    } catch {
      status.textContent = 'Não foi possível confirmar o envio. Confira a conexão.';
    } finally {
      button.disabled = false;
    }
  });
});

const formatoPreco = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function criarCartao(servico, modelo) {
  const cartao = modelo.content.cloneNode(true);
  cartao.querySelectorAll('a').forEach(link => {
    link.href = /^servico[0-9]+\.html$/.test(servico.pagina) ? servico.pagina : '#servicos';
  });
  cartao.querySelector('.card-img-top').src = 'movitare-assets/' + encodeURIComponent(servico.imagem);
  cartao.querySelector('.service-icon').src = 'movitare-assets/' + encodeURIComponent(servico.icone);
  cartao.querySelector('h3').textContent = servico.nome;
  cartao.querySelector('p').textContent = servico.descricao;
  cartao.querySelector('.price strong').textContent = formatoPreco.format(Number(servico.preco));
  return cartao;
}

async function carregarServicos() {
  const lista = document.getElementById('services-list');
  if (!lista) return;

  const status = document.getElementById('services-status');
  const modelo = document.getElementById('service-template');
  try {
    const response = await fetch('api/servicos.php');
    if (!response.ok) throw new Error('Falha ao consultar serviços.');
    const { servicos } = await response.json();
    lista.replaceChildren(...servicos.map(servico => criarCartao(servico, modelo)));
    status.textContent = servicos.length ? '' : 'Nenhum serviço disponível no momento.';
  } catch {
    status.textContent = 'Não foi possível carregar os serviços. Atualize a página para tentar novamente.';
  }
}

carregarServicos().then(setupScrollReveal);
