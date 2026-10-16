import buscaImoveis from "models/buscaimoveis";

// a primeira coleta consulta todos os sites e pode levar alguns segundos
export const config = { maxDuration: 60 };

async function imoveis(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response
      .status(405)
      .json({ erro: `Método ${request.method} não permitido` });
  }

  const { finalidade, atualizar } = request.query;
  if (!buscaImoveis.FINALIDADES.includes(finalidade)) {
    return response.status(400).json({
      erro: "Informe finalidade=aluguel ou finalidade=compra",
    });
  }

  const resultado = await buscaImoveis.listar(finalidade, {
    forcar: atualizar !== undefined,
  });
  response.setHeader("Cache-Control", "no-store");
  return response.status(200).json(resultado);
}

export default imoveis;
