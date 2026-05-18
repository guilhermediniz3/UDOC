import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { FaTrash } from 'react-icons/fa';

import Tabs from '../../../components/Tabs/Tabs';
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog';
import RichTextEditor from '../../../components/RichTextEditor/RichTextEditor';

import type { Tab } from '../../../types/Tab';
import type { Card } from '../../../types/Card';

import {
  saveCard,
  deleteCard,
} from '../../../services/cardService';

export default function AdminPage() {
  const [card, setCard] = useState<Card>({
    titulo: '',
    descricao: '',
    icone: '',
    slug: '',
    content: '',
  });

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<
    'success' | 'error'
  >('success');

  const [modalExcluirAberto, setModalExcluirAberto] =
    useState(false);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setCard((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSalvando(true);
      setMensagem('');

      const isEdicao = !!card.id;

      // Salva todos os campos, inclusive content
      const cardSalvo = await saveCard(card);

      setCard(cardSalvo);

      setTipoMensagem('success');
      setMensagem(
        isEdicao
          ? 'Card atualizado com sucesso!'
          : 'Card criado com sucesso!'
      );
    } catch (error) {
      console.error('Erro ao salvar o card:', error);

      setTipoMensagem('error');
      setMensagem('Erro ao salvar o card.');
    } finally {
      setSalvando(false);
    }
  }

  function handleDelete() {
    setModalExcluirAberto(true);
  }

  async function confirmarDelete() {
    if (!card.id) {
      return;
    }

    try {
      setSalvando(true);
      setMensagem('');

      await deleteCard(card.id);

      // Limpa o formulário
      setCard({
        titulo: '',
        descricao: '',
        icone: '',
        slug: '',
        content: '',
      });

      setTipoMensagem('success');
      setMensagem('Card removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover o card:', error);

      setTipoMensagem('error');
      setMensagem('Erro ao remover o card.');
    } finally {
      setSalvando(false);
      setModalExcluirAberto(false);
    }
  }

  const tabs: Tab[] = [
    {
      id: 'card',
      label: 'Card',
      content: (
        <div>
          {/* Cabeçalho do formulário */}
          <div className="form-header">
            <div>
              <h2>Cadastro de Card</h2>
              <p>
                Preencha as informações abaixo para criar
                ou editar um card.
              </p>
            </div>

            <div className="form-toolbar">
              {/* Exibe apenas após o primeiro salvamento */}
              {card.id && (
                <>
                  <label className="status-switch">
                    <input
                      type="checkbox"
                      checked={true}
                      readOnly
                    />
                    <span className="status-slider"></span>
                    <span className="status-text">
                      Ativo
                    </span>
                  </label>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={handleDelete}
                    disabled={salvando}
                  >
                    <FaTrash />
                    <span>Remover</span>
                  </button>
                </>
              )}

              <button
                type="button"
                className="save-button"
                onClick={() =>
                  document
                    .getElementById('card-form')
                    ?.requestSubmit()
                }
                disabled={salvando}
              >
                {salvando
                  ? 'Salvando...'
                  : 'Salvar'}
              </button>
            </div>
          </div>

          {/* Mensagens */}
          {mensagem && (
            <div
              className={`form-message ${
                tipoMensagem === 'error'
                  ? 'form-message-error'
                  : 'form-message-success'
              }`}
            >
              {mensagem}
            </div>
          )}

          {/* Formulário principal */}
          <form
            id="card-form"
            className="card-form"
            onSubmit={handleSubmit}
          >
            <div>
              <label htmlFor="titulo">
                Título
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={card.titulo}
                onChange={handleChange}
                placeholder="Digite o título do card"
              />
            </div>

            <div>
              <label htmlFor="descricao">
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                rows={4}
                value={card.descricao}
                onChange={handleChange}
                placeholder="Digite a descrição do card"
              />
            </div>

            <div>
              <label htmlFor="icone">
                Ícone
              </label>
              <input
                type="text"
                id="icone"
                name="icone"
                value={card.icone}
                onChange={handleChange}
                placeholder="Ex.: FaUsers"
              />
            </div>

            <div>
              <label htmlFor="slug">
                Slug
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={card.slug}
                onChange={handleChange}
                placeholder="exemplo-do-card"
              />
            </div>
          </form>
        </div>
      ),
    },

    {
      id: 'midias',
      label: 'Mídias',
      content: (
        <div>
          <h2>Mídias</h2>

          <p>
            Aqui você poderá criar o conteúdo completo
            do card com texto, imagens, vídeos, embeds
            de YouTube e Vimeo, links, tabelas,
            callouts e colagem de imagens com Ctrl + V.
          </p>

          <div style={{ marginTop: '24px' }}>
            <RichTextEditor
              value={card.content || ''}
              onChange={(html) =>
                setCard((prev) => ({
                  ...prev,
                  content: html,
                }))
              }
            />
          </div>
        </div>
      ),
    },

    {
      id: 'configuracoes',
      label: 'Configurações',
      content: (
        <div>
          <h2>Configurações</h2>
          <p>
            Defina opções adicionais do card, como
            status, visibilidade e publicação.
          </p>
        </div>
      ),
    },
  ];

  return (
    <>
      <Tabs tabs={tabs} />

      <ConfirmDialog
        open={modalExcluirAberto}
        title="Remover Card"
        message="Deseja realmente remover este card?"
        onConfirm={confirmarDelete}
        onCancel={() =>
          setModalExcluirAberto(false)
        }
        loading={salvando}
      />
    </>
  );
}