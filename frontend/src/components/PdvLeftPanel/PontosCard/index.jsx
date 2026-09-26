import Card from '../../Card'
import Tooltip from '../../Tooltip'
import './styles.css'

export default function PontosCard({ pontosGanhos, getDayRangeLabel }) {
  const content = (
    <div style={{ whiteSpace: 'normal', maxWidth: '250px', textAlign: 'left' }}>
      <div>Seg-Qua: &gt; R$10 = 1 pt</div>
      <div>Qui-Dom:</div>
      <div>&nbsp; até R$40 = 0,25 pt</div>
      <div>&nbsp; R$40-60 = 0,5 pt</div>
      <div>&nbsp; &gt; R$60 = 1 pt</div>
    </div>
  )

  return (
    <Card>
      <div className="pdv-left-panel__points">
        <p className="pdv-left-panel__points-label">
          Pontos desta Venda{' '}
          <Tooltip content={content}>🛈</Tooltip>
        </p>
        <p className="pdv-left-panel__points-value">
          {pontosGanhos.toFixed(2)}
        </p>
        <p className="pdv-left-panel__points-range">{getDayRangeLabel()}</p>
      </div>
    </Card>
  )
}
