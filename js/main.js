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
  const now = new Date();
  dateInput.min = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}
document.getElementById('contact-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = `Nome: ${data.get('nome')}\nE-mail: ${data.get('email')}\n\n${data.get('mensagem')}`;
  window.location.href = `mailto:kleberdebiasi@gmail.com?subject=${encodeURIComponent('Contato pelo site Movitare')}&body=${encodeURIComponent(message)}`;
  form.querySelector('[role="status"]').textContent = 'Confirme o envio no seu aplicativo de e-mail. Se ele não abrir, use o link do WhatsApp ao lado.';
});
document.getElementById('quote-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const d = new FormData(form);
  const message = `Olá! Gostaria de solicitar um orçamento para ${form.dataset.service}.\nNome: ${d.get('nome')}\nE-mail: ${d.get('email')}\nTelefone: ${d.get('telefone')}\nEndereço: ${d.get('endereco')}\nCidade: ${d.get('cidade')} / ${d.get('uf')}\nData desejada: ${String(d.get('data')).split('-').reverse().join('/')}\nObservações: ${d.get('observacoes') || 'Nenhuma'}`;
  window.location.assign(`https://wa.me/5549984330704?text=${encodeURIComponent(message)}`);
});
