import * as cheerio from "cheerio";
import { baixarTexto, emParalelo } from "../http";
import {
  aplicarCaracteristicas,
  aplicarValoresDoTexto,
  capitalizar,
  novoImovel,
  parseDinheiro,
} from "../normalizar";

/**
 * Imotools — site renderizado no servidor (Laravel/Livewire). A listagem só é
 * usada para descobrir os links; os dados vêm do JSON-LD (schema.org
 * RealEstateListing) que cada página de anúncio publica.
 */

const FILTRO = { aluguel: "locacao", compra: "venda" };
const MAX_PAGINAS = 30;
const DETALHES_SIMULTANEOS = 4;

async function listarLinks(site, finalidade) {
  const links = new Map();
  for (let pagina = 1; pagina <= MAX_PAGINAS; pagina++) {
    const $ = cheerio.load(
      await baixarTexto(
        `${site}/imoveis?finalidade=${FILTRO[finalidade]}&page=${pagina}`,
      ),
    );
    const antes = links.size;
    $('a[href*="/imovel/"]').each((_, a) => {
      const url = $(a).attr("href") ?? "";
      const id = url.match(/-id-(\d+)$/)?.[1];
      if (id && !links.has(id)) links.set(id, url);
    });
    if (links.size === antes) break;
  }
  return links;
}

function lerJsonLd(html) {
  const $ = cheerio.load(html);
  const blocos = [];
  $('script[type="application/ld+json"]').each((_, script) => {
    try {
      blocos.push(JSON.parse($(script).text()));
    } catch {
      // bloco malformado: ignora
    }
  });
  return blocos;
}

function valorCaracteristica(valor) {
  if (valor === true) return "Sim";
  if (valor === false) return "Não";
  return String(valor ?? "");
}

export default async function coletarImotools(imobiliaria, finalidade) {
  const links = await listarLinks(imobiliaria.site, finalidade);

  const imoveis = await emParalelo(
    [...links],
    DETALHES_SIMULTANEOS,
    async ([id, url]) => {
      const blocos = lerJsonLd(await baixarTexto(url));
      const anuncio = blocos.find((b) => b["@type"] === "RealEstateListing");
      if (!anuncio) return null;
      const trilha = blocos.find((b) => b["@type"] === "BreadcrumbList");
      const entidade = anuncio.mainEntity ?? {};

      const imovel = novoImovel(imobiliaria, finalidade, {
        codigo: anuncio.identifier?.value ?? id,
        url,
        tipo: anuncio.name ?? entidade.name ?? "Imóvel",
      });
      imovel.endereco = capitalizar(entidade.address?.streetAddress);
      imovel.bairro = capitalizar(
        trilha?.itemListElement?.find((i) => i.item?.includes("bairro="))?.name,
      );
      imovel.cidade = capitalizar(entidade.address?.addressLocality);
      const foto = Array.isArray(anuncio.image)
        ? anuncio.image[0]
        : anuncio.image;
      // o site guarda a miniatura ao lado da original, com o prefixo "thumbnail_"
      imovel.foto =
        foto?.replace(/\/originals\/(?!thumbnail_)/, "/originals/thumbnail_") ??
        null;
      const preco = anuncio.offers?.price;
      imovel.valor = parseDinheiro(
        typeof preco === "string" ? Number(preco) : preco,
      );
      imovel.quartos = entidade.numberOfBedrooms ?? null;
      imovel.banheiros =
        entidade.numberOfBathroomsTotal ??
        entidade.numberOfFullBathrooms ??
        null;
      imovel.area = entidade.floorSize?.value ?? null;
      aplicarCaracteristicas(
        imovel,
        (entidade.amenityFeature ?? []).map((c) => [
          c.name ?? "",
          valorCaracteristica(c.value),
        ]),
      );
      aplicarValoresDoTexto(imovel, anuncio.description);
      return imovel;
    },
  );

  return imoveis.filter((imovel) => imovel !== null);
}
