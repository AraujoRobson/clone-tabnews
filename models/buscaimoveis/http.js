const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36";
const TIMEOUT_MS = 30_000;
const TENTATIVAS = 2;

export async function baixar(url, init = {}) {
  // falhas de rede e erros 5xx são tentados de novo; 4xx não
  for (let tentativa = 1; ; tentativa++) {
    let resposta;
    try {
      resposta = await fetch(url, {
        ...init,
        headers: { "User-Agent": USER_AGENT, ...init.headers },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (erro) {
      if (tentativa < TENTATIVAS) continue;
      throw new Error(`Falha ao acessar ${url}`, { cause: erro });
    }
    if (resposta.ok) return resposta;
    if (resposta.status < 500 || tentativa >= TENTATIVAS) {
      throw new Error(`HTTP ${resposta.status} em ${url}`);
    }
  }
}

export async function baixarTexto(url) {
  return (await baixar(url)).text();
}

/** Executa `fn` para cada item com no máximo `limite` chamadas simultâneas. */
export async function emParalelo(itens, limite, fn) {
  const resultados = new Array(itens.length);
  let proximo = 0;
  async function trabalhador() {
    while (proximo < itens.length) {
      const i = proximo++;
      resultados[i] = await fn(itens[i]);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limite, itens.length) }, trabalhador),
  );
  return resultados;
}
