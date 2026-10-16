import { baixar } from "../http";
import {
  aplicarCaracteristicas,
  capitalizar,
  novoImovel,
  parseDinheiro,
} from "../normalizar";

/**
 * Simob Portal (Flexpro Sistemas) — o site é um app Angular que consome uma
 * API JSON. Usamos a mesma API: primeiro os parâmetros públicos do site
 * (endereço da API + token de integração), depois a busca de imóveis.
 */

const CENTRAL = "https://simob.com.br";
const CODIGO_FINALIDADE = { aluguel: 1, compra: 2 };
const POR_PAGINA = 500;
const CDN_FOTOS = "https://cdnmidia.simob.com.br";

async function carregarParametros(site) {
  const host = new URL(site).host.replace(/^www\./, "");
  const resposta = await baixar(
    `${CENTRAL}/v2/imobiliaria/site/params?host=${host}`,
  );
  const json = await resposta.json();
  if (!json.success || !json.result) {
    throw new Error(`Simob não reconheceu o site ${host}`);
  }
  return json.result;
}

async function buscarPagina(api, finalidade, inicio) {
  const filtro = {
    idsCategorias: [],
    finalidade: CODIGO_FINALIDADE[finalidade],
    ceps: [],
    idsBairros: [],
    rangeValue: { max: "", min: "" },
    caracteristicas: [],
    offset: { maxResults: POR_PAGINA, firstResult: inicio },
    acuracidade: 100,
    countResults: false,
    considerarPrevisaoSaida: true,
    calcularValorAbono: false,
    validade_opcao_venda: false,
    orderBy: [{ sort: "valor", order: "asc" }],
    // quantidade de características por imóvel; o site pede 3, queremos todas
    trazerCaracteristicas: 99,
  };
  const resposta = await baixar(
    `${api.urlApi}/v2/integracaoApi/imovel/filtro/categoria/caracteristicas`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${api.tokenIntegracao}`,
        From: "site",
      },
      // a API espera o filtro como string JSON dentro de `data`
      body: JSON.stringify({ data: JSON.stringify(filtro) }),
    },
  );
  const json = await resposta.json();
  if (json.success && Array.isArray(json.result)) return json.result;
  if (/nenhum im[oó]vel/i.test(json.message ?? "")) return [];
  throw new Error(json.message ?? "Resposta inesperada da API Simob");
}

function urlFoto(bruto) {
  const arquivo = bruto.imagem?.split("/").pop();
  const ponto = arquivo?.lastIndexOf(".") ?? -1;
  if (!arquivo || ponto < 1) return null;
  const nome = arquivo.slice(0, ponto);
  const extensao = arquivo.slice(ponto + 1);
  // `id` é o id interno do imóvel (diferente do código do anúncio)
  return `${CDN_FOTOS}/cdn/imovelImages/${bruto.id}/${nome}_miniatura_480x360.${extensao}?createBorders=false&idImobiliaria=${bruto.idImobiliaria}`;
}

export default async function coletarSimob(imobiliaria, finalidade) {
  const api = await carregarParametros(imobiliaria.site);

  const brutos = [];
  for (let inicio = 0; ; inicio += POR_PAGINA) {
    const pagina = await buscarPagina(api, finalidade, inicio);
    brutos.push(...pagina);
    if (pagina.length < POR_PAGINA) break;
  }

  return brutos.map((bruto) => {
    const imovel = novoImovel(imobiliaria, finalidade, {
      codigo: bruto.codigo,
      url: `${imobiliaria.site}/imovel/exibir/${encodeURIComponent(
        bruto.codigo,
      )}`,
      tipo: bruto.descricaoCategoria ?? "Imóvel",
    });
    imovel.titulo = capitalizar(bruto.edificio || bruto.nomeEmpreendimento);
    imovel.endereco = capitalizar(
      [bruto.endereco, bruto.numero].filter(Boolean).join(", "),
    );
    imovel.bairro = capitalizar(bruto.bairro);
    imovel.cidade = capitalizar(bruto.cidade);
    imovel.foto = urlFoto(bruto);
    imovel.valor = parseDinheiro(bruto.valor);
    aplicarCaracteristicas(
      imovel,
      (bruto.caracteristicas ?? []).map((c) => [
        c.descricao,
        String(c.valor ?? ""),
      ]),
    );
    return imovel;
  });
}
