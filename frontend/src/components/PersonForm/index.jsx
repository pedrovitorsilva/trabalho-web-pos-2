import { useEffect, useState } from "react";
import { formatCpf, formatPhone, isValidCpf, normalizeCpf, normalizePhone } from "../../utils/format";
import Button from "../Button";
import FormField from "../FormField";
import SelectField from "../SelectField";
import Subtitle from "../Subtitle";
import "./styles.css";

const INITIAL_VALUES = {
    tipo_pessoa: "Cliente",
    nome: "",
    telefone: "",
    cpf: "",
    cargo: "",
    pontos_acumulados: "",
    cidade: "",
    uf: "",
};

function getInitialValues(person) {
    if (!person) return { ...INITIAL_VALUES };

    return {
        tipo_pessoa: person.tipo_pessoa || "Cliente",
        nome: person.nome || "",
        telefone: formatPhone(person.telefone || ""),
        cpf: formatCpf(person.cpf || ""),
        cargo: person.cargo || "",
        pontos_acumulados: person.pontos_acumulados == null ? "" : String(person.pontos_acumulados),
        cidade: person.endereco?.cidade || "",
        uf: person.endereco?.uf || "",
    };
}

export default function PersonForm({ person, onSubmit, onCancel, submitting }) {
    const [values, setValues] = useState(() => getInitialValues(person));
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        setValues(getInitialValues(person));
        setFieldErrors({});
    }, [person]);

    const handleChange = (field) => (event) => {
        let value = event.target.value;
        if (field === "cpf") value = formatCpf(value);
        if (field === "telefone") value = formatPhone(value);

        setValues((previous) => ({ ...previous, [field]: value }));
        setFieldErrors((previous) => ({ ...previous, [field]: undefined }));
    };

    function validate() {
        const errors = {};
        if (!values.tipo_pessoa) errors.tipo_pessoa = "Selecione o tipo de pessoa.";
        if (!values.nome.trim()) errors.nome = "Informe o nome.";
        if (values.cpf.trim() && !isValidCpf(values.cpf)) {
            errors.cpf = "Informe um CPF com 11 dígitos numéricos.";
        }
        if (values.tipo_pessoa === "Cliente" && values.pontos_acumulados.trim()) {
            const points = Number(values.pontos_acumulados);
            if (!Number.isFinite(points) || points < 0) {
                errors.pontos_acumulados = "Informe um número válido (maior ou igual a zero).";
            }
        }
        return errors;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        const payload = {
            tipo_pessoa: values.tipo_pessoa,
            nome: values.nome.trim(),
        };
        const setFields = { ...payload };
        const unsetFields = {};
        const clientFields = ["pontos_acumulados", "cidade", "uf"];
        const employeeFields = ["cargo"];
        const fields = ["telefone", "cpf", ...clientFields, ...employeeFields];

        for (const field of fields) {
            const isAddressField = field === "cidade" || field === "uf";
            const path = isAddressField ? `endereco.${field}` : field;
            const belongsToType =
                field === "telefone" ||
                field === "cpf" ||
                (values.tipo_pessoa === "Cliente" && clientFields.includes(field)) ||
                (values.tipo_pessoa === "Funcionario" && employeeFields.includes(field));
            const value = values[field].trim();

            if (belongsToType && value) {
                let normalizedValue = value;
                if (field === "cpf") normalizedValue = normalizeCpf(value);
                else if (field === "telefone") normalizedValue = normalizePhone(value);
                else if (field === "pontos_acumulados") normalizedValue = Number(value);

                if (isAddressField && !person) {
                    setFields.endereco = { ...setFields.endereco, [field]: normalizedValue };
                } else {
                    setFields[path] = normalizedValue;
                }
            } else if (person && (person[field] != null || (isAddressField && person.endereco?.[field] != null))) {
                unsetFields[path] = 1;
            }
        }

        const submission = person
            ? { $set: setFields, ...(Object.keys(unsetFields).length > 0 && { $unset: unsetFields }) }
            : setFields;
        const succeeded = await onSubmit(submission);

        if (succeeded && !person) {
            setValues(getInitialValues(null));
            setFieldErrors({});
        }
    }

    const field = (name, label, props = {}) => (
        <FormField
            id={`person-${name}`}
            label={label}
            value={values[name]}
            onChange={handleChange(name)}
            error={fieldErrors[name]}
            disabled={submitting}
            {...props}
        />
    );

    return (
        <form className="person-form" onSubmit={handleSubmit} noValidate>
            <Subtitle>{person ? "Editar pessoa" : "Nova pessoa"}</Subtitle>
            <div className="person-form__grid">
                <SelectField
                    id="person-tipo_pessoa"
                    label="Tipo de pessoa"
                    value={values.tipo_pessoa}
                    onChange={handleChange("tipo_pessoa")}
                    options={[
                        { value: "Cliente", label: "Cliente" },
                        { value: "Funcionario", label: "Funcionario" },
                    ]}
                    error={fieldErrors.tipo_pessoa}
                    required
                    disabled={submitting}
                />
                {field("nome", "Nome", {
                    required: true,
                    placeholder: "Ex.: Maria da Silva",
                })}
                {field("cpf", "CPF", {
                    inputMode: "numeric",
                    maxLength: 14,
                    placeholder: "Ex.: 123.456.789-09",
                })}
                {field("telefone", "Telefone", {
                    inputMode: "tel",
                    maxLength: 16,
                    placeholder: "Ex.: (11) 99999-9999",
                })}
                {values.tipo_pessoa === "Funcionario" && field("cargo", "Cargo", {
                    placeholder: "Ex.: Vendedor",
                })}
                {values.tipo_pessoa === "Cliente" && (
                    <>
                        {field("pontos_acumulados", "Pontos acumulados", {
                            type: "number",
                            min: "0",
                            step: "1",
                            placeholder: "Ex.: 250",
                        })}
                        {field("cidade", "Cidade", {
                            placeholder: "Ex.: São Paulo",
                        })}
                        {field("uf", "UF", {
                            maxLength: 2,
                            autoCapitalize: "characters",
                            placeholder: "Ex.: SP",
                        })}
                    </>
                )}
            </div>
            <div className="person-form__actions">
                <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? "Salvando..." : person ? "Salvar alterações" : "Cadastrar pessoa"}
                </Button>
                {person && onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
                        Cancelar
                    </Button>
                )}
            </div>
        </form>
    );
}