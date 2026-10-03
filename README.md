# VIZION PAGE

Site em HTML, CSS e JavaScript, sem dependências de instalação ou build.

## Publicar na Vercel

1. Acesse https://vercel.com/new e conecte sua conta do GitHub.
2. Importe `gianluccatp/vizionpage`, branch `main`.
3. Mantenha **Root Directory** na raiz do repositório (`./`).
4. Use **Framework Preset: Other**. O `vercel.json` já define a saída como `.` e dispensa comandos de instalação e build.
5. Clique em **Deploy**.

Não são necessárias variáveis de ambiente. O vídeo e os 120 frames já estão no repositório. Alterações futuras na branch `main` são publicadas pela integração Git da Vercel.

## Arquivos

- `index.html`, `styles.css`: página e visual.
- `script.js`: interações existentes.
- `scroll-intro.js`: animação em canvas controlada pela rolagem.
- `intro.js`: vídeo de abertura na velocidade de 75% e fade para o Hero.
- `frames/frame-0001.webp` até `frames/frame-0120.webp`: sequência original.
- `assets/vizion-intro.mp4`: vídeo original.
- `vercel.json`: configuração de publicação estática.

A abertura segue a ordem: scroll animation → vídeo → Hero. A preferência por movimento reduzido apresenta uma imagem estática.
