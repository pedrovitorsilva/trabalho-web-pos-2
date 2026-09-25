import "./styles.css";

export default function FormField({
  id,
  label,
  type = "text",
  as = "input",
  value,
  onChange,
  error,
  required,
  ...rest
}) {
  const control =
    as === "textarea" ? (
      <textarea
        id={id}
        className="form-field__control"
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        {...rest}
      />
    ) : (
      <input
        id={id}
        className="form-field__control"
        type={type}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        {...rest}
      />
    );

  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={id}>
        {label}
        {required && " *"}
      </label>
      {control}
      {error && (
        <p className="form-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
