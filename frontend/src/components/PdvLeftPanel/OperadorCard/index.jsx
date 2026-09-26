import Card from '../../Card'
import SelectField from '../../SelectField'
import Subtitle from '../../Subtitle'

export default function OperadorCard({ funcionarios, operadorId, setOperadorId }) {
  return (
    <Card>
      <Subtitle>Operador</Subtitle>
      <SelectField
        id="operador"
        value={operadorId}
        onChange={(e) => setOperadorId(e.target.value)}
        options={funcionarios.map((f) => ({
          value: f._id,
          label: f.nome,
        }))}
      />
    </Card>
  )
}
