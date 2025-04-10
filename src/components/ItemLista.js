import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { FaInfoCircle, FaEdit } from 'react-icons/fa'; // Ícones de info e edição

function ItemLista({ valor, data, descricao, tipo, index, showTipo }) {
    const [showModal, setShowModal] = useState(false);

    // Formatar a data para xx/xx/xxxx
    const formatData = (dataStr) => {
        const date = new Date(dataStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Alternando cores das linhas (cinza claro em linhas pares)
    const rowClass = index % 2 === 0 ? 'bg-light' : '';

    // Verificando a largura da tela para definir se estamos em dispositivo pequeno
    const isSmallScreen = window.innerWidth < 768;

    return (
        <tr className={rowClass}>
            {/* Exibindo o tipo apenas se showTipo for verdadeiro */}
            {showTipo && <td>{tipo}</td>}
            <td>R$ {valor.toFixed(2)}</td>
            <td>{formatData(data)}</td>
            <td>
                {isSmallScreen ? (
                    // Em dispositivos menores, mostra apenas o ícone de informação
                    <FaInfoCircle 
                        style={{ cursor: 'pointer' }} 
                        onClick={() => setShowModal(true)} 
                    />
                ) : (
                    descricao
                )}
            </td>
            <td>
                {/* Botão quadrado com bordas arredondadas, fundo preto e ícone branco */}
                <button 
                    style={{
                        backgroundColor: 'black', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px',  // Bordas arredondadas
                        padding: '10px 20px', // Tamanho do botão
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center', 
                        justifyContent: 'center',
                    }} 
                    onClick={() => alert('Editando...')} // Coloque aqui a função de edição desejada
                >
                    <FaEdit style={{ fontSize: '16px' }} />
                </button>
            </td>

            {/* Modal para Descrição */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Descrição Completa</Modal.Title>
                </Modal.Header>
                <Modal.Body>{descricao}</Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                        Fechar
                    </button>
                </Modal.Footer>
            </Modal>
        </tr>
    );
}

export default ItemLista;
