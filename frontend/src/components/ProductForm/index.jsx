import { useState } from "react";
import FormField from "../FormField";
import Subtitle from "../Subtitle";
import Button from "../Button";
import "./styles.css";

const INITIAL = {
  nome: "",
  codigo_barras: "",
  preco_venda: "",
  preco_custo: "",
  descricao: "",
  qtd_atual: "",
  qtd_minima: "",
  id_fornecedor: "",
};

const OPTIONAL_NUMBERS = ["qtd_atual", "qtd_minima", "id_fornecedor"];

export default function ProductForm({ onSubmit, submitting }) {
  const [values, setValues] = useState(INITIAL);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  function validate() {
    const errors = {};
    if (!values.nome.trim()) errors.nome = "Informe o nome.";
    if (!values.codigo_barras.trim())
      errors.codigo_barras = "Informe o código de barras.";
    for (const field of ["preco_venda", "preco_custo"]) {
      const n = Number(values[field]);
      if (values[field].trim() === "" || !Number.isFinite(n) || n <= 0)
        errors[field] = "Informe um valor maior que zero.";
    }
    for (const field of OPTIONAL_NUMBERS) {
      if (values[field].trim() === "") continue;
      const n = Number(values[field]);
      if (!Number.isFinite(n) || n < 0)
        errors[field] = "Informe um número válido (≥ 0).";
    }
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const payload = {
      nome: values.nome.trim(),
      codigo_barras: values.codigo_barras.trim(),
      preco_venda: Number(values.preco_venda),
      preco_custo: Number(values.preco_custo),
    };
    if (values.descricao.trim()) payload.descricao = values.descricao.trim();
    for (const field of OPTIONAL_NUMBERS) {
      if (values[field].trim() !== "") payload[field] = Number(values[field]);
    }

    const ok = await onSubmit(payload);
    if (ok) {
      setValues(INITIAL);
      setFieldErrors({});
    }
  }

  const field = (name, label, props = {}) => (
    <FormField
      id={`produto-${name}`}
      label={label}
      value={values[name]}
      onChange={handleChange(name)}
      error={fieldErrors[name]}
      {...props}
    />
  );

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <Subtitle>Novo produto</Subtitle>
      <div className="product-form__grid">
        {field("nome", "Nome", { required: true })}
        {field("codigo_barras", "Código de barras", { required: true })}
        {field("preco_venda", "Preço de venda (R$)", {
          required: true,
          type: "number",
          step: "0.01",
          min: "0",
        })}
        {field("preco_custo", "Preço de custo (R$)", {
          required: true,
          type: "number",
          step: "0.01",
          min: "0",
        })}
        {field("qtd_atual", "Quantidade atual", { type: "number", min: "0" })}
        {field("qtd_minima", "Quantidade mínima", { type: "number", min: "0" })}
        {field("id_fornecedor", "ID do fornecedor", {
          type: "number",
          min: "0",
        })}
      </div>
      {field("descricao", "Descrição", { as: "textarea" })}
      <Button
        className="product-form__submit"
        type="submit"
        disabled={submitting}
      >
        {submitting ? "Salvando..." : "Cadastrar produto"}
      </Button>
    </form>
  );
}
