import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import estilos from "styles/buscaimoveis.module.css";

const FINALIDADES = ["aluguel", "compra"];
const ESCOPO = "Casas e apartamentos em São Miguel do Oeste";

const FILTROS_INICIAIS = {
  imobiliaria: "",
  categoria: "",
  bairro: "",
  quartos: "",
  valorMaximo: "",
  ordem: "valor-asc",
};

// ---------- formatação ----------

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const moedaInteira = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});
const dinheiro = (valor) =>
  (Number.isInteger(valor) ? moedaInteira : moeda).format(valor);
const plural = (n, singular, pluralTexto) =>
  `${n} ${n === 1 ? singular : pluralTexto}`;

function tempoDesde(iso) {
  const minutos = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (minutos < 1) return "agora";
  if (minutos < 60) return `há ${minutos} min`;
  return `há ${Math.round(minutos / 60)} h`;
}

const linkSeguro = (url) => (/^https?:\/\//.test(url ?? "") ? url : undefined);

// ---------- regras de exibição ----------

const adicionais = (imovel) =>
  (imovel.condominio ?? 0) + (imovel.iptu ?? 0) + (imovel.seguroIncendio ?? 0);
const totalMensal = (imovel) =>
  imovel.valor == null ? null : imovel.valor + adicionais(imovel);

function textoComodos(imovel) {
  const partes = [];
  if (imovel.quartos != null) {
    const suites = imovel.suites
      ? ` (${plural(imovel.suites, "suíte", "suítes")})`
      : "";
    partes.push(plural(imovel.quartos, "quarto", "quartos") + suites);
  } else if (imovel.suites) {
    partes.push(plural(imovel.suites, "suíte", "suítes"));
  }
  if (imovel.banheiros != null) {
    partes.push(plural(imovel.banheiros, "banheiro", "banheiros"));
  }
  if (imovel.vagas != null) {
    partes.push(
      imovel.vagas === 0
        ? "sem garagem"
        : plural(imovel.vagas, "vaga", "vagas"),
    );
  }
  if (imovel.elevador != null) {
    partes.push(imovel.elevador ? "com elevador" : "sem elevador");
  }
  if (imovel.area != null) {
    partes.push(`${imovel.area.toLocaleString("pt-BR")} m²`);
  }
  return partes.join(" · ");
}

function textoAdicionais(imovel) {
  const partes = [];
  if (imovel.condominio != null) {
    partes.push(`Condomínio ${dinheiro(imovel.condominio)}`);
  }
  if (imovel.iptu != null) partes.push(`IPTU ${dinheiro(imovel.iptu)}`);
  if (imovel.seguroIncendio != null) {
    partes.push(`Seguro incêndio ${dinheiro(imovel.seguroIncendio)}`);
  }
  return partes.join(" · ");
}

// ---------- filtros ----------

const unicos = (imoveis, campo) =>
  [...new Set(imoveis.map((i) => i[campo]).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );

const ORDENACOES = {
  // sem valor (sob consulta) sempre no fim
  "valor-asc": (a, b) => (a.valor ?? Infinity) - (b.valor ?? Infinity),
  "valor-desc": (a, b) => (b.valor ?? -Infinity) - (a.valor ?? -Infinity),
  "total-asc": (a, b) =>
    (totalMensal(a) ?? Infinity) - (totalMensal(b) ?? Infinity),
  imobiliaria: (a, b) =>
    a.imobiliaria.localeCompare(b.imobiliaria, "pt-BR") ||
    ORDENACOES["valor-asc"](a, b),
};

function aplicarFiltros(imoveis, filtros) {
  const quartos = Number(filtros.quartos) || 0;
  const valorMaximo = Number(filtros.valorMaximo) || 0;
  return imoveis
    .filter(
      (i) =>
        (!filtros.imobiliaria || i.imobiliaria === filtros.imobiliaria) &&
        (!filtros.categoria || i.categoria === filtros.categoria) &&
        (!filtros.bairro || i.bairro === filtros.bairro) &&
        (!quartos || (i.quartos ?? 0) >= quartos) &&
        (!valorMaximo || (i.valor != null && i.valor <= valorMaximo)),
    )
    .sort(ORDENACOES[filtros.ordem] ?? ORDENACOES["valor-asc"]);
}

const contarFiltrosAtivos = (filtros) =>
  Object.entries(filtros).filter(
    ([nome, valor]) => nome !== "ordem" && valor !== "",
  ).length;

// ---------- componentes ----------

function Escolha() {
  return (
    <main className={estilos.escolha}>
      <h1>O que você procura?</h1>
      <p className={estilos.escopo}>{ESCOPO}</p>
      <div className={estilos.escolhaOpcoes}>
        <Link className={estilos.escolhaOpcao} href="?finalidade=aluguel">
          <strong>Alugar</strong>
          <span>Imóveis para locação</span>
        </Link>
        <Link className={estilos.escolhaOpcao} href="?finalidade=compra">
          <strong>Comprar</strong>
          <span>Imóveis à venda</span>
        </Link>
      </div>
    </main>
  );
}

function Foto({ url }) {
  const [falhou, setFalhou] = useState(false);
  const src = linkSeguro(url);
  return (
    <span className={estilos.foto}>
      {src && !falhou ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFalhou(true)}
        />
      ) : (
        "Sem foto"
      )}
    </span>
  );
}

function Linha({ imovel }) {
  const detalhe = [imovel.titulo, imovel.endereco].filter(Boolean).join(" — ");
  const comodos = textoComodos(imovel);
  const taxas = textoAdicionais(imovel);
  const mostrarTotal =
    imovel.finalidade === "aluguel" &&
    imovel.valor != null &&
    adicionais(imovel) > 0;

  return (
    <a
      className={estilos.linha}
      href={linkSeguro(imovel.url)}
      target="_blank"
      rel="noopener noreferrer"
      title={Object.entries(imovel.caracteristicas)
        .map(([rotulo, valor]) => `${rotulo}: ${valor}`)
        .join("\n")}
    >
      <Foto url={imovel.foto} />
      <span className={estilos.info}>
        <span className={estilos.imobiliaria}>{imovel.imobiliaria}</span>
        <strong>
          {[imovel.tipo, imovel.bairro].filter(Boolean).join(" · ")}
        </strong>
        {detalhe && <small>{detalhe}</small>}
        {comodos && <span>{comodos}</span>}
        {taxas && <span className={estilos.adicionais}>{taxas}</span>}
      </span>
      <span className={estilos.valor}>
        <strong>
          {imovel.valor == null ? "Sob consulta" : dinheiro(imovel.valor)}
        </strong>
        {mostrarTotal && <small>total ≈ {dinheiro(totalMensal(imovel))}</small>}
      </span>
    </a>
  );
}

function Filtros({ finalidade, imoveis, filtros, setFiltros }) {
  // no celular os filtros começam recolhidos para a lista aparecer logo
  const [aberto, setAberto] = useState(true);
  useEffect(() => {
    if (window.matchMedia("(max-width: 720px)").matches) setAberto(false);
  }, []);

  const opcoes = useMemo(
    () => ({
      imobiliaria: unicos(imoveis, "imobiliaria"),
      categoria: unicos(imoveis, "categoria"),
      bairro: unicos(imoveis, "bairro"),
    }),
    [imoveis],
  );

  const alterar = (evento) =>
    setFiltros({ ...filtros, [evento.target.name]: evento.target.value });

  const selecao = (nome, rotulo, rotuloTodos) => (
    <label>
      {rotulo}
      <select name={nome} value={filtros[nome]} onChange={alterar}>
        <option value="">{rotuloTodos}</option>
        {opcoes[nome].map((valor) => (
          <option key={valor}>{valor}</option>
        ))}
      </select>
    </label>
  );

  const ativos = contarFiltrosAtivos(filtros);

  return (
    <details
      className={estilos.painelFiltros}
      open={aberto}
      onToggle={(evento) => setAberto(evento.currentTarget.open)}
    >
      <summary>Filtros {ativos > 0 && `(${ativos})`}</summary>
      <form
        className={estilos.filtros}
        onSubmit={(evento) => evento.preventDefault()}
      >
        {selecao("imobiliaria", "Imobiliária", "Todas")}
        {selecao("categoria", "Tipo", "Todos")}
        {selecao("bairro", "Bairro", "Todos")}
        <label>
          Quartos (mín.)
          <select name="quartos" value={filtros.quartos} onChange={alterar}>
            <option value="">Qualquer</option>
            {["1", "2", "3", "4"].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <label>
          Valor até
          <input
            name="valorMaximo"
            type="number"
            min="0"
            step="100"
            placeholder="R$"
            inputMode="numeric"
            value={filtros.valorMaximo}
            onChange={alterar}
          />
        </label>
        <label>
          Ordenar por
          <select name="ordem" value={filtros.ordem} onChange={alterar}>
            <option value="valor-asc">Menor valor</option>
            <option value="valor-desc">Maior valor</option>
            {finalidade === "aluguel" && (
              <option value="total-asc">Menor total mensal</option>
            )}
            <option value="imobiliaria">Imobiliária</option>
          </select>
        </label>
        <button type="button" onClick={() => setFiltros(FILTROS_INICIAIS)}>
          Limpar
        </button>
      </form>
    </details>
  );
}

function Lista({ finalidade }) {
  /** Resultado da API por finalidade, para não buscar de novo ao trocar de aba. */
  const [carregados, setCarregados] = useState({});
  // por finalidade: o usuário pode trocar de aba no meio de uma busca
  const [carregandoPor, setCarregandoPor] = useState({});
  const [falhaPor, setFalhaPor] = useState({});
  const [filtros, setFiltros] = useState(FILTROS_INICIAIS);

  async function carregar(atualizar = false) {
    setCarregandoPor((atuais) => ({ ...atuais, [finalidade]: true }));
    setFalhaPor((atuais) => ({ ...atuais, [finalidade]: null }));
    try {
      const resposta = await fetch(
        `/api/v1/buscaimoveis?finalidade=${finalidade}${
          atualizar ? "&atualizar=1" : ""
        }`,
      );
      const dados = await resposta.json();
      if (!resposta.ok)
        throw new Error(dados.erro ?? `HTTP ${resposta.status}`);
      setCarregados((anteriores) => ({ ...anteriores, [finalidade]: dados }));
    } catch (erro) {
      setFalhaPor((atuais) => ({ ...atuais, [finalidade]: erro.message }));
    } finally {
      setCarregandoPor((atuais) => ({ ...atuais, [finalidade]: false }));
    }
  }

  useEffect(() => {
    if (!carregados[finalidade] && !carregandoPor[finalidade]) carregar();
    // "Menor total mensal" só existe no aluguel
    if (finalidade !== "aluguel") {
      setFiltros((atuais) =>
        atuais.ordem === "total-asc"
          ? { ...atuais, ordem: "valor-asc" }
          : atuais,
      );
    }
  }, [finalidade]); // eslint-disable-line react-hooks/exhaustive-deps

  const dados = carregados[finalidade];
  const carregando = Boolean(carregandoPor[finalidade]);
  const falha = falhaPor[finalidade];
  const imoveis = useMemo(() => dados?.imoveis ?? [], [dados]);

  // um filtro que não existe na outra finalidade (ex.: bairro) volta para "todos"
  useEffect(() => {
    setFiltros((atuais) => {
      const ajustados = { ...atuais };
      for (const campo of ["imobiliaria", "categoria", "bairro"]) {
        if (
          ajustados[campo] &&
          !imoveis.some((i) => i[campo] === ajustados[campo])
        ) {
          ajustados[campo] = "";
        }
      }
      return ajustados;
    });
  }, [imoveis]);

  const visiveis = useMemo(
    () => aplicarFiltros(imoveis, filtros),
    [imoveis, filtros],
  );

  let mensagem = null;
  if (falha) mensagem = `Falha ao carregar os imóveis: ${falha}`;
  else if (!dados) {
    mensagem =
      "Consultando as imobiliárias… a primeira busca pode levar alguns segundos.";
  } else if (visiveis.length === 0)
    mensagem = "Nenhum imóvel com esses filtros.";

  return (
    <>
      <header className={estilos.topo}>
        <Link className={estilos.marca} href="/buscaimoveis">
          Busca Imóvel <small>{ESCOPO}</small>
        </Link>
        <nav className={estilos.abas} aria-label="Finalidade">
          <Link
            href="?finalidade=aluguel"
            className={finalidade === "aluguel" ? estilos.ativa : undefined}
          >
            Alugar
          </Link>
          <Link
            href="?finalidade=compra"
            className={finalidade === "compra" ? estilos.ativa : undefined}
          >
            Comprar
          </Link>
        </nav>
        <div className={estilos.situacao}>
          <span>
            {dados &&
              !carregando &&
              `${plural(visiveis.length, "imóvel", "imóveis")} de ${
                imoveis.length
              } · atualizado ${tempoDesde(dados.coletadoEm)}`}
          </span>
          <button
            type="button"
            disabled={carregando}
            onClick={() => carregar(true)}
          >
            Atualizar
          </button>
        </div>
      </header>

      <Filtros
        finalidade={finalidade}
        imoveis={imoveis}
        filtros={filtros}
        setFiltros={setFiltros}
      />

      {dados?.erros.length > 0 && (
        <p className={estilos.avisos}>
          {dados.erros
            .map(
              (e) =>
                `Não foi possível consultar ${e.imobiliaria}: ${e.mensagem}`,
            )
            .join(" · ")}
        </p>
      )}

      <main className={estilos.conteudo}>
        {!carregando && (
          <div className={estilos.lista}>
            {visiveis.map((imovel) => (
              <Linha key={imovel.id} imovel={imovel} />
            ))}
          </div>
        )}
        {(carregando || mensagem) && (
          <p className={estilos.vazio}>
            {carregando
              ? "Consultando as imobiliárias… a primeira busca pode levar alguns segundos."
              : mensagem}
          </p>
        )}
      </main>
    </>
  );
}

function BuscaImoveis() {
  const router = useRouter();
  const { finalidade } = router.query;
  const naLista = FINALIDADES.includes(finalidade);
  // a página é estática: o HTML do servidor sai sem query. Só renderiza a
  // tela depois de montar no navegador, para não divergir na hidratação.
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  return (
    <div className={estilos.pagina}>
      <Head>
        <title>Busca Imóvel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {montado &&
        router.isReady &&
        (naLista ? <Lista finalidade={finalidade} /> : <Escolha />)}

      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
}

export default BuscaImoveis;
