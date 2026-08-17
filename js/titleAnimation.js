const CHARS = '!<>-_\\/[]{}—=+*^?#••••';

export function initTitleAnimation(elementId, phrases, interval = 3200) {
  const el = document.getElementById(elementId);
  if (!el) return;
  let index = 0;

  function scrambleTo(text) {
    let frame = 0;
    const totalFrames = 18;

    function tick() {
      let output = '';
      for (let i = 0; i < text.length; i++) {
        if (i < (frame / totalFrames) * text.length) {
          output += text[i];
        } else {
          output += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      el.innerText = output;
      frame++;
      if (frame <= totalFrames) requestAnimationFrame(tick);
      else el.innerText = text;
    }
    tick();
  }

  scrambleTo(phrases[0]);
  setInterval(() => {
    index = (index + 1) % phrases.length;
    scrambleTo(phrases[index]);
  }, interval);
}
