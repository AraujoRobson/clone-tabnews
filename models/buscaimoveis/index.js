import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { CATEGORIAS, CIDADE, FINALIDADES } from "./busca";
import imobiliarias from "./imobiliarias";
import { semAcento } from "./normalizar";
import coletores from "./plataformas";

// pasta temporária do sistema: também é a única gravável na Vercel
const PASTA_CACHE = join(tmpdir(), "clone-tabnews-buscaimoveis");
/** Depois disso a próxima consulta busca tudo de novo nos sites. */
const VALIDADE_MS = 6 * 60 * 60 * 1000;

const cidadeBuscada = semAcento(CIDADE);
const naBusca = (imovel) =>
  CATEGORIAS.includes(imovel.categoria) &&
  semAcento(imovel.cidade ?? "") === cidadeBuscada;

/** Evita duas coletas simultâneas da mesma finalidade. */
const emAndamento = new Map();

const arquivoCache = (finalidade) => join(PASTA_CACHE, `${finalidade}.json`);

async function lerCache(finalidade) {
  try {
    const cache = JSON.parse(await readFile(arquivoCache(finalidade), "utf8"));
    const idade = Date.now() - Date.parse(cache.coletadoEm);
    return idade < VALIDADE_MS ? cache : null;
  } catch {
    return null;
  }
}

async function coletarDosSites(finalidade) {
  const imoveis = [];
  const erros = [];

  await Promise.all(
    imobiliarias.map(async (imobiliaria) => {
      try {
        const coletar = coletores[imobiliaria.plataforma];
        const encontrados = await coletar(imobiliaria, finalidade);
        imoveis.push(...encontrados.filter(naBusca));
      } catch (erro) {
        erros.push({
          imobiliariaId: imobiliaria.id,
          imobiliaria: imobiliaria.nome,
          mensagem: erro instanceof Error ? erro.message : String(erro),
        });
      }
    }),
  );

  const resultado = {
    finalidade,
    coletadoEm: new Date().toISOString(),
    imoveis,
    erros,
  };
  await mkdir(PASTA_CACHE, { recursive: true });
  await writeFile(arquivoCache(finalidade), JSON.stringify(resultado));
  return resultado;
}

/** Devolve os imóveis da finalidade, usando o cache em disco enquanto ele for recente. */
async function listar(finalidade, { forcar = false } = {}) {
  if (!forcar) {
    const cache = await lerCache(finalidade);
    if (cache) return cache;
  }
  let coleta = emAndamento.get(finalidade);
  if (!coleta) {
    coleta = coletarDosSites(finalidade).finally(() =>
      emAndamento.delete(finalidade),
    );
    emAndamento.set(finalidade, coleta);
  }
  return coleta;
}

const buscaImoveis = {
  FINALIDADES,
  CIDADE,
  listar,
};

export default buscaImoveis;
