import Subtitle from '../Subtitle'
import './styles.css'

export default function List({
  header,
  columns,
  items,
  loading,
  error,
  emptyMessage = 'Nenhum item cadastrado.',
  rowClassName,
  keyExtractor = (item, i) => item._id ?? item.id ?? i,
}) {
  if (loading) return <p className="list__status">Carregando...</p>
  if (error) return <p className="list__status list__status--error">{error}</p>
  if (items.length === 0) return <p className="list__status">{emptyMessage}</p>

  return (
    <div className="list">
      {header && <Subtitle>{header}</Subtitle>}
      <table className="list__table">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr
              key={keyExtractor(item, i)}
              className={rowClassName ? rowClassName(item) : undefined}
            >
              {columns.map((col, colI) => (
                <td key={colI} className={col.cellClassName}>
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
