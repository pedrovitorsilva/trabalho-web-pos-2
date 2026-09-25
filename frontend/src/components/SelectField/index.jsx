import './styles.css'

export default function SelectField({
  id,
  label,
  value,
  onChange,
  options = [],
  error,
  required,
  ...rest
}) {
  return (
    <div className="select-field">
      {label && (
        <label htmlFor={id} className="select-field__label">
          {label} {required && <span className="select-field__required">*</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="select-field__input"
        {...rest}
      >
        <option value="">— Selecionar —</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="select-field__error">{error}</p>}
    </div>
  )
}
