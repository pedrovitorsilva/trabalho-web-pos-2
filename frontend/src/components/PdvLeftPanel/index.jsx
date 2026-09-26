import ClienteCard from './ClienteCard'
import OperadorCard from './OperadorCard'
import ProdutoCard from './ProdutoCard'
import PontosCard from './PontosCard'
import './styles.css'

export default function PdvLeftPanel({
  clientes,
  funcionarios,
  clienteSelecionado,
  cpfSearch,
  setCpfSearch,
  buscarClientePorCpf,
  useClienteList,
  setUseClienteList,
  selecionarClientePorNome,
  operadorId,
  setOperadorId,
  showGrade,
  setShowGrade,
  codigoBarrasInput,
  setCodigoBarrasInput,
  buscarPorBarcode,
  produtos,
  produtosColumns,
  pontosGanhos,
  getDayRangeLabel,
}) {
  return (
    <div className="pdv-left-panel">
      <ClienteCard
        clientes={clientes}
        clienteSelecionado={clienteSelecionado}
        cpfSearch={cpfSearch}
        setCpfSearch={setCpfSearch}
        buscarClientePorCpf={buscarClientePorCpf}
        useClienteList={useClienteList}
        setUseClienteList={setUseClienteList}
        selecionarClientePorNome={selecionarClientePorNome}
      />

      <OperadorCard
        funcionarios={funcionarios}
        operadorId={operadorId}
        setOperadorId={setOperadorId}
      />

      <ProdutoCard
        showGrade={showGrade}
        setShowGrade={setShowGrade}
        codigoBarrasInput={codigoBarrasInput}
        setCodigoBarrasInput={setCodigoBarrasInput}
        buscarPorBarcode={buscarPorBarcode}
        produtos={produtos}
        produtosColumns={produtosColumns}
      />

      <PontosCard
        pontosGanhos={pontosGanhos}
        getDayRangeLabel={getDayRangeLabel}
      />
    </div>
  );
}
