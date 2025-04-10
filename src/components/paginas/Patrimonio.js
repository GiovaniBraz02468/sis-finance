import { useEffect, useState } from 'react'
import Titulo from '../Titulo'
import { Button } from 'react-bootstrap'
import { Plus } from 'lucide-react'
import ModalCadastroPatrimonio from '../CadastroModalPatrimonio'
import ModalEditarPatrimonio from '../ModalEditarPatrimonio'
import { getPatrimonios, getResumoPatrimonioECofre } from '../services/patrimonioService'
import { useAuth } from '../services/AuthContext'

function Patrimonio() {
    const [showModal, setShowModal] = useState(false)
    const [showModalEditar, setShowModalEditar] = useState(false)
    const [patrimonios, setPatrimonios] = useState([])
    const [patrimonioSelecionado, setPatrimonioSelecionado] = useState(null)
    const [mostrarResumo, setMostrarResumo] = useState(false)
    const [resumo, setResumo] = useState({ Vr_Patrimonio: 0, Vr_Cofre: 0 })

    const { user } = useAuth()

    const carregarDados = async () => {
        const dados = await getPatrimonios()
        setPatrimonios(dados)
    }

    const carregarResumo = async () => {
        if (!user) return
        const dados = await getResumoPatrimonioECofre(user.id)
        if (dados) {
            setResumo(dados)
        }
    }

    useEffect(() => {
        carregarDados()
        carregarResumo()
    }, [user])

    const abrirEdicao = (item) => {
        setPatrimonioSelecionado(item)
        setShowModalEditar(true)
    }

    const toggleResumo = () => {
        setMostrarResumo(!mostrarResumo)
    }

    const formatarMoeda = (valor) =>
        valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    return (
        <div>
            <Titulo titulo="Patrimônio" />
            <div className="d-flex justify-content-end gap-2 mb-2">
                <Button variant="dark" onClick={toggleResumo}>
                    {mostrarResumo ? 'Ocultar' : 'Exibir Tudo'}
                </Button>
                <Button variant="dark" onClick={() => setShowModal(true)}>
                    <Plus size={18} className="me-1" />
                    Novo Patrimônio
                </Button>
            </div>
            {mostrarResumo && (
                <div className="row mb-3">
                    <div className="col-md-4 mb-2">
                        <div className="border rounded shadow-sm p-3 h-100 bg-light">
                            <h6 className="text-muted">Patrimônio</h6>
                            <h4 className="text-primary">{formatarMoeda(resumo.Vr_Patrimonio)}</h4>
                        </div>
                    </div>
                    <div className="col-md-4 mb-2">
                        <div className="border rounded shadow-sm p-3 h-100 bg-light">
                            <h6 className="text-muted">Cofre</h6>
                            <h4 className="text-success">{formatarMoeda(resumo.Vr_Cofre)}</h4>
                        </div>
                    </div>
                    <div className="col-md-4 mb-2">
                        <div className="border rounded shadow-sm p-3 h-100 bg-light">
                            <h6 className="text-muted">Total</h6>
                            <h4 className="text-dark">{formatarMoeda(resumo.Vr_Patrimonio + resumo.Vr_Cofre)}</h4>
                        </div>
                    </div>
                </div>
            )}

            {patrimonios.map((item) => (
                <div key={item.Id} className="card mb-2" onClick={() => abrirEdicao(item)} style={{ cursor: 'pointer' }}>
                    <div className="card-body">
                        <h5>{item.Nome}</h5>
                        <p>{item.Descricao}</p>
                        <strong>{formatarMoeda(item.Valor)}</strong>
                    </div>
                </div>
            ))}

            <ModalCadastroPatrimonio
                show={showModal}
                onHide={() => {
                    setShowModal(false)
                    carregarDados()
                    carregarResumo()
                }}
            />

            <ModalEditarPatrimonio
                show={showModalEditar}
                onHide={() => {
                    setShowModalEditar(false)
                    setPatrimonioSelecionado(null)
                }}
                onUpdate={() => {
                    carregarDados()
                    carregarResumo()
                }}
                patrimonio={patrimonioSelecionado}
            />
        </div>
    )
}

export default Patrimonio