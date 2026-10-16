import coletarImotools from "./imotools";
import coletarSimob from "./simob";
import coletarVoxsis from "./voxsis";

/** Um coletor por plataforma: (imobiliaria, finalidade) => Promise<imovel[]> */
const coletores = {
  simob: coletarSimob,
  voxsis: coletarVoxsis,
  imotools: coletarImotools,
};

export default coletores;
