/**
 * Cada imobiliária cadastra as características com rótulos e formatos próprios
 * ("DORMITÓRIO(S)": "03 - sendo 01 suíte", "CONDOMÍNIO +/-": "+- 140,00"...).
 * Este módulo traduz esses pares rótulo/valor para os campos do imóvel.
 */

export function semAcento(texto) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

const MINUSCULAS = new Set(["de", "do", "da", "dos", "das", "e", "em"]);

/** "SÃO MIGUEL DO OESTE" -> "São Miguel do Oeste" */
export function capitalizar(texto) {
  const limpo = texto?.replace(/\s+/g, " ").trim();
  if (!limpo) return null;
  return limpo
    .toLowerCase()
    .split(" ")
    .map((palavra, i) =>
      i > 0 && MINUSCULAS.has(palavra)
        ? palavra
        : palavra.charAt(0).toUpperCase() + palavra.slice(1),
    )
    .join(" ");
}

/** Aceita "1.250,00", "250.00", "R$ +- 450,00, podendo variar". Sem número -> null. */
export function parseDinheiro(texto) {
  if (texto == null) return null;
  if (typeof texto === "number") return texto > 0 ? texto : null;
  // "1/12 avos" e "20% do salário" não são valores em reais
  if (/\d\s*(\/|%)/.test(texto)) return null;
  const numero = texto.match(/\d[\d.]*(?:,\d{1,2})?/)?.[0];
  if (!numero) return null;
  let normalizado;
  if (numero.includes(",")) {
    normalizado = numero.replace(/\./g, "").replace(",", ".");
  } else if (/^\d+\.\d{1,2}$/.test(numero)) {
    normalizado = numero;
  } else {
    normalizado = numero.replace(/\./g, "");
  }
  const valor = Number(normalizado);
  return Number.isFinite(valor) && valor > 0 ? valor : null;
}

/** "03 - sendo 01 suíte" -> 3; "Sim" -> 1; "Não" -> 0 */
export function parseQuantidade(textoOriginal) {
  if (!textoOriginal) return null;
  // "Vaga nº 27" identifica a vaga, não é quantidade
  const texto = textoOriginal.replace(/n[º°o.]\s*\d+/gi, "");
  const numero = texto.match(/\d+/)?.[0];
  if (numero) {
    const n = Number(numero);
    return n <= 50 ? n : null;
  }
  const t = semAcento(texto);
  if (/^(nao|sem)\b/.test(t)) return 0;
  return t ? 1 : null;
}

export function parseSimNao(texto) {
  if (!texto) return null;
  const t = semAcento(texto);
  if (!t) return null;
  return !/^(nao|sem|0+)\b/.test(t);
}

function parseArea(texto) {
  const numero = texto.match(/\d[\d.]*(?:,\d+)?/)?.[0];
  if (!numero) return null;
  let valor;
  if (numero.includes(",")) {
    valor = Number(numero.replace(/\./g, "").replace(",", "."));
  } else if (/^\d{1,3}(\.\d{3})+$/.test(numero)) {
    valor = Number(numero.replace(/\./g, ""));
  } else {
    valor = Number(numero);
  }
  return Number.isFinite(valor) && valor > 0 ? valor : null;
}

export function classificarTipo(texto) {
  const t = semAcento(texto);
  if (/kitnet|quitinet|kitinete|studio|loft/.test(t)) return "Kitnet";
  if (/apartamento|apto|cobertura|duplex/.test(t)) return "Apartamento";
  if (/galpao|barracao|pavilhao/.test(t)) return "Galpão";
  if (/rural|chacara|sitio|fazenda/.test(t)) return "Rural";
  if (/lote|terreno/.test(t)) return "Terreno";
  if (/garagem|box/.test(t)) return "Garagem";
  if (/sala|loja|comercial|ponto|predio/.test(t)) return "Comercial";
  if (/casa|sobrado|porao/.test(t)) return "Casa";
  return "Outros";
}

/** Imóvel com os campos vazios; cada coletor preenche o que o site informa. */
export function novoImovel(imobiliaria, finalidade, { codigo, url, tipo }) {
  return {
    id: `${imobiliaria.id}:${codigo}`,
    imobiliariaId: imobiliaria.id,
    imobiliaria: imobiliaria.nome,
    finalidade,
    codigo,
    url,
    tipo: capitalizar(tipo) ?? "Imóvel",
    categoria: classificarTipo(tipo),
    titulo: null,
    endereco: null,
    bairro: null,
    cidade: null,
    foto: null,
    valor: null,
    condominio: null,
    iptu: null,
    seguroIncendio: null,
    quartos: null,
    suites: null,
    banheiros: null,
    vagas: null,
    elevador: null,
    area: null,
    caracteristicas: {},
  };
}

/**
 * Preenche os campos do imóvel a partir dos pares [rótulo, valor] da
 * imobiliária. Campos já preenchidos não são sobrescritos.
 */
export function aplicarCaracteristicas(imovel, pares) {
  let areaTotal = null;
  for (const [rotuloOriginal, valorOriginal] of pares) {
    const rotulo = rotuloOriginal.replace(/\s+/g, " ").replace(/:$/, "").trim();
    const valor = valorOriginal.replace(/\s+/g, " ").trim();
    if (!rotulo) continue;
    imovel.caracteristicas[rotulo] ??= valor;

    const r = semAcento(rotulo);
    if (/^(dormitorio|quarto)/.test(r)) {
      imovel.quartos ??= parseQuantidade(valor);
    } else if (/^suite/.test(r)) {
      imovel.suites ??= parseQuantidade(valor);
    } else if (/^(banheiro|bwc)/.test(r)) {
      imovel.banheiros ??= parseQuantidade(valor);
    } else if (/garagem|^vaga/.test(r)) {
      imovel.vagas ??= parseQuantidade(valor);
    } else if (/^elevador/.test(r)) {
      imovel.elevador ??= parseSimNao(valor);
    } else if (/^(taxa de )?condominio/.test(r)) {
      imovel.condominio ??= parseDinheiro(valor);
    } else if (/^iptu/.test(r)) {
      imovel.iptu ??= parseDinheiro(valor);
    } else if (/^seg.*incendio|^seguro$/.test(r)) {
      imovel.seguroIncendio ??= parseDinheiro(valor);
    } else if (/^area (privativa|util|da unidade|und|construida)/.test(r)) {
      imovel.area ??= parseArea(valor);
    } else if (/^area (total|do terreno)/.test(r)) {
      areaTotal ??= parseArea(valor);
    }
  }
  imovel.area ??= areaTotal;
}

/**
 * Alguns sites informam as taxas só em texto livre
 * ("Seguro Incêndio: R$65,00 mensal."). Preenche o que ainda estiver vazio.
 */
export function aplicarValoresDoTexto(imovel, texto) {
  if (!texto) return;
  const buscar = (padrao) => {
    const achado = texto.match(
      new RegExp(`${padrao}[^\\d\\n]{0,25}(\\d[\\d.,]*\\S*)`, "i"),
    );
    return achado ? parseDinheiro(achado[1]) : null;
  };
  imovel.condominio ??= buscar("condom[ií]nio");
  imovel.iptu ??= buscar("iptu");
  imovel.seguroIncendio ??= buscar("seguro\\s+(?:de\\s+)?inc[eê]ndio");
}
