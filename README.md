# VIZION PAGE

Site institucional e landing page em HTML, CSS e JavaScript, sem dependências de build.

## Estrutura

- `index.html`: página principal.
- `styles.css`: identidade visual e animações.
- `script.js`: interações do site.
- `scroll-intro.js`: sequência de 120 frames controlada pela rolagem.
- `intro.js`: vídeo de abertura e transição para o Hero.
- `frames/`: arquivos WEBP originais, de `frame-0001.webp` a `frame-0120.webp`.
- `assets/vizion-intro.mp4`: vídeo de abertura.

## Visualização

Sirva esta pasta com um servidor HTTP estático. A sequência de abertura segue a ordem: frames por rolagem → vídeo → Hero. A preferência por movimento reduzido usa uma imagem estática.

## Vercel

Importe este repositório, selecione **Other** e mantenha a raiz como diretório do projeto. Não há comando de instalação ou build. Todos os arquivos públicos estão na raiz.
