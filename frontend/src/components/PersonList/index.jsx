import { formatCpf, formatPhone } from "../../utils/format";
import Button from "../Button";
import List from "../List";
import "./styles.css";

export default function PersonList({
    people = [],
    loading,
    error,
    onEdit,
    onDelete,
}) {
    const hasClientes = people.some((person) => person.tipo_pessoa === "Cliente");
    const columns = [
        { key: "nome", header: "Nome" },
        { key: "tipo_pessoa", header: "Tipo" },
        {
            key: "cpf",
            header: "CPF",
            cellClassName: "person-list__cell--nowrap",
            render: (person) => person.cpf ? formatCpf(person.cpf) : "-",
        },
        {
            key: "telefone",
            header: "Telefone",
            cellClassName: "person-list__cell--nowrap",
            render: (person) => person.telefone ? formatPhone(person.telefone) : "-",
        },
        ...(hasClientes
            ? [
                {
                    key: "pontos_acumulados",
                    header: "Pontos",
                    render: (person) => person.pontos_acumulados ?? "",
                },
                {
                    key: "endereco",
                    header: "Endereço",
                    render: (person) =>
                        [person.endereco?.cidade, person.endereco?.uf]
                            .filter(Boolean)
                            .join(" / "),
                },
            ]
            : []),
        {
            key: "acoes",
            header: "Ações",
            render: (person) => (
                <div className="person-list__actions">
                    <Button
                        type="button"
                        variant="secondary"
                        className="button--sm"
                        onClick={() => onEdit(person)}
                        aria-label={`Editar ${person.nome}`}
                    >
                        Editar
                    </Button>
                    <Button
                        type="button"
                        variant="danger"
                        className="button--sm"
                        onClick={() => onDelete(person)}
                        aria-label={`Excluir ${person.nome}`}
                    >
                        Excluir
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="person-list">
            <List
                header="Pessoas cadastradas"
                columns={columns}
                items={people}
                loading={loading}
                error={error}
                emptyMessage="Nenhuma pessoa cadastrada ainda."
            />
        </div>
    );
}