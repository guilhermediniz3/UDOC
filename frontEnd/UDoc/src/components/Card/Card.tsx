import "./index.css";

import * as FaIcons from "react-icons/fa";
import * as ImIcons from "react-icons/im";
import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";
import * as FiIcons from "react-icons/fi";
import * as HiIcons from "react-icons/hi";
import * as RiIcons from "react-icons/ri";
import * as TbIcons from "react-icons/tb";

interface CardProps {
  titulo: string;
  descricao: string;
  icone?: string | null;
}

/*
  Une todos os pacotes em um único objeto.
  A chave será o nome do componente, por exemplo:
  - FaUsers
  - ImAlarm
  - MdHome
  - AiFillHeart
*/
const icones = {
  ...FaIcons,
  ...ImIcons,
  ...MdIcons,
  ...AiIcons,
  ...BsIcons,
  ...FiIcons,
  ...HiIcons,
  ...RiIcons,
  ...TbIcons,
};

export default function Card({
  titulo,
  descricao,
  icone,
}: CardProps) {
  const nomeIcone = icone?.trim() || "";

  /*
    Procura dinamicamente pelo nome informado.
    Se não existir, retorna undefined.
  */
  const Icone =
    nomeIcone !== ""
      ? icones[nomeIcone as keyof typeof icones]
      : undefined;

  return (
    <div className="card">
      {/* Renderiza somente se o ícone existir */}
      {Icone && (
        <div className="card-icon">
          <Icone size={32} />
        </div>
      )}

      <h2>{titulo}</h2>
      <p>{descricao}</p>
    </div>
  );
}