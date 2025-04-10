import { useEffect, useState } from 'react'
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap'
import { atualizarPatrimonio, excluirPatrimonio } from './services/patrimonioService'

function ModalEditarPatrimonio({ show, onHide, patrimonio, onUpdate }) {
    const [nome, setNome] = useState('')
    const [descricao, setDescricao] = useState('')
    const [valor, setValor] = useState('')

    useEffect(() => {
        if (patrimonio) {
            setNome(patrimonio.Nome || '')
            setDescricao(patrimonio.Descricao || '')
            setValor(formatarValor((patrimonio.Valor || 0).toFixed(2)))
        }
    }, [patrimonio])

    const formatarValor = (valor) => {
        let num = valor.toString().replace(/\D/g, '')
        if (num === '') return ''
        return (parseInt(num, 10) / 100).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
        })
    }

    const converterValorParaNumero = (valor) => {
        return parseFloat(valor.replace(/\./g, '').replace(',', '.'))
    }

    const handleValorChange = (e) => {
        setValor(formatarValor(e.target.value))
    }

    const handleAtualizar = async () => {
        if (!nome.trim() || !descricao.trim() || !valor.trim()) {
            alert('Todos os campos são obrigatórios!')
            return
        }

        const valorNumerico = converterValorParaNumero(valor)

        await atualizarPatrimonio({
            ...patrimonio,
            Nome: nome,
            Descricao: descricao,
            Valor: valorNumerico,
        })

        onUpdate()
        onHide()
    }

    const handleExcluir = async () => {
        if (window.confirm('Tem certeza que deseja excluir este item?')) {
          try {
            await excluirPatrimonio(patrimonio)
            onUpdate()
            onHide()
          } catch (error) {
            console.error('Erro ao excluir patrimônio:', error.message || error)
            alert('Erro ao excluir patrimônio: ' + (error.message || 'Erro desconhecido'))
          }
        }
      }

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Patrimônio</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Ex: Carro, Casa..."
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                            type="text"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Detalhes do item"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Valor</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>R$</InputGroup.Text>
                            <Form.Control
                                type="text"
                                value={valor}
                                onChange={handleValorChange}
                                placeholder="0,00"
                                inputMode="numeric"
                            />
                        </InputGroup>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Row className="w-100">
                    <Col>
                        <Button variant="danger" onClick={handleExcluir} className="w-100">
                            Excluir
                        </Button>
                    </Col>
                    <Col>
                        <Button variant="success" onClick={handleAtualizar} className="w-100">
                            Atualizar
                        </Button>
                    </Col>
                </Row>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalEditarPatrimonio