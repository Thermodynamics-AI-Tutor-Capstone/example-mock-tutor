// Kel greets on each app startup, then stays quietly in the corner.
(() => {
  const companion = document.createElement('aside');
  companion.className = 'kel-companion';
  companion.setAttribute('aria-label', 'Kel, your thermodynamics companion');
  const greeting = document.createElement('p');
  greeting.className = 'kel-greeting';
  greeting.setAttribute('role', 'status');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'kel-button';
  button.setAttribute('aria-label', 'Make Kel dance');
  button.title = 'Make Kel dance';
  const image = document.createElement('img');
  image.src = '/assets/kel.png';
  image.alt = '';
  image.draggable = false;
  button.append(image);
  companion.append(greeting, button);
  let timer;
  function dance() {
    clearTimeout(timer);
    companion.classList.remove('kel-dancing');
    // Restart the finite dance even when Kel is clicked mid-animation.
    void button.offsetWidth;
    companion.classList.add('kel-dancing', 'kel-hello');
    greeting.textContent = "Hi, I'm Kel! Ready to warm up your thermo skills?";
    timer = setTimeout(() => {
      companion.classList.remove('kel-dancing', 'kel-hello');
      greeting.textContent = '';
    }, 5000);
  }
  button.addEventListener('click', dance);
  image.addEventListener('load', () => {
    (document.getElementById('studioCompanion') || document.body).append(companion);
    dance();
  }, { once: true });
})();
