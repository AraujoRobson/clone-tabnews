import * as cheerio from "cheerio";
import { baixarTexto, emParalelo } from "../http";
import {
  aplicarCaracteristicas,
  aplicarValoresDoTexto,
  capitalizar,
  novoImovel,
  parseDinheiro,
  parseQuantidade,
} from "../normalizar";

/**
 * Voxsis — site renderizado no servidor. A listagem traz nome, valor, bairro
 * e cômodos; taxas (IPTU, condomínio, seguro) e elevador só aparecem na página
 * do anúncio, então cada imóvel custa uma requisição extra.
 */

const FILTRO = { aluguel: "Aluguel", compra: "Venda" };
const DETALHES_SIMULTANEOS = 4;

const texto = (s) => s.replace(/\s+/g, " ").trim();

async function completarComDetalhes(imovel) {
  const $ = cheerio.load(await baixarTexto(imovel.url));
  const pares = [];
  $("span.f2").each((_, span) => {
    const rotulo = texto($(span).text());
    const valor = texto($(span).parent().text()).slice(rotulo.length).trim();
    if (!rotulo.endsWith(":")) return;
    switch (rotulo) {
      case "Endereço:":
        imovel.endereco = capitalizar(valor);
        break;
      case "Bairro:":
        imovel.bairro = capitalizar(valor);
        break;
      case "Cidade:":
        imovel.cidade = capitalizar(valor);
        break;
      case "Valor:":
        imovel.valor ??= parseDinheiro(valor);
        break;
      case "Referência:":
        break;
      default:
        pares.push([rotulo, valor]);
    }
  });
  aplicarCaracteristicas(imovel, pares);

  const adicionais = texto($("span.f4").parent().next(".texto").text());
  if (adicionais) {
    imovel.caracteristicas["Informações adicionais"] = adicionais;
    aplicarValoresDoTexto(imovel, adicionais);
  }
}

export default async function coletarVoxsis(imobiliaria, finalidade) {
  const $ = cheerio.load(
    await baixarTexto(
      `${imobiliaria.site}/imoveis/filtros/?tr=${FILTRO[finalidade]}`,
    ),
  );

  const imoveis = new Map();
  $('a[href*="/imovel/"]').each((_, a) => {
    const cartao = $(a);
    const url = cartao.attr("href") ?? "";
    const codigo = url.match(/\/imovel\/(\d+)\//)?.[1];
    const nome = texto(cartao.find(".nome").text());
    if (!codigo || !nome || imoveis.has(codigo)) return;

    const imovel = novoImovel(imobiliaria, finalidade, {
      codigo,
      url,
      tipo: nome,
    });
    // o site não tem campo de tipo: mostramos a categoria deduzida do nome
    imovel.tipo = imovel.categoria === "Outros" ? "Imóvel" : imovel.categoria;
    imovel.titulo = nome;
    imovel.foto = cartao.find(".img img").attr("src") ?? null;
    imovel.valor = parseDinheiro(cartao.find(".valor").text());
    imovel.bairro = capitalizar(cartao.find(".info").text());
    imovel.quartos = parseQuantidade(cartao.find(".dormitorios span").text());
    imovel.banheiros = parseQuantidade(cartao.find(".banheiros span").text());
    imovel.vagas = parseQuantidade(cartao.find(".garagem span").text());
    imoveis.set(codigo, imovel);
  });

  const lista = [...imoveis.values()];
  await emParalelo(lista, DETALHES_SIMULTANEOS, async (imovel) => {
    try {
      await completarComDetalhes(imovel);
    } catch {
      // sem os detalhes o imóvel ainda aparece com os dados da listagem
    }
  });
  return lista;
}
