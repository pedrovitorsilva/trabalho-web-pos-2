import { useEffect, useState } from "react";
import {
    createPessoa,
    deletePessoa,
    listPessoas,
    updatePessoa,
} from "../services/api";
import FeedbackMessage from "../components/FeedbackMessage";
import PersonForm from "../components/PersonForm";
import PersonList from "../components/PersonList";
import Title from "../components/Title";

export default function Pessoas() {
    const [pessoas, setPessoas] = useState([]);
    const [listLoading, setListLoading] = useState(true);
    const [listError, setListError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [editingPerson, setEditingPerson] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                setPessoas(await listPessoas());
            } catch {
                setListError("Erro ao carregar pessoas.");
            } finally {
                setListLoading(false);
            }
        }
        load();
    }, []);

    async function handleSave(payload) {
        setSubmitting(true);
        try {
            if (editingPerson) {
                const id = editingPerson._id ?? editingPerson.id;
                const updatedPerson = await updatePessoa(id, payload);
                setPessoas((previous) =>
                    previous.map((person) =>
                        (person._id ?? person.id) === id ? updatedPerson : person,
                    ),
                );
                setEditingPerson(null);
                setFeedback({ type: "success", message: "Pessoa atualizada com sucesso." });
            } else {
                const newPerson = await createPessoa(payload);
                setPessoas((previous) => [newPerson, ...previous]);
                setFeedback({ type: "success", message: "Pessoa cadastrada com sucesso." });
            }
            return true;
        } catch (err) {
            setFeedback({
                type: "error",
                message: err.response?.data?.message || err.response?.data?.error || "Erro ao salvar pessoa.",
            });
            return false;
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(person) {
        const id = person._id ?? person.id;
        if (!id || !window.confirm(`Deseja excluir ${person.nome}?`)) return;

        try {
            await deletePessoa(id);
            setPessoas((previous) => previous.filter((item) => (item._id ?? item.id) !== id));
            if ((editingPerson?._id ?? editingPerson?.id) === id) setEditingPerson(null);
            setFeedback({ type: "success", message: "Pessoa excluída com sucesso." });
        } catch (err) {
            setFeedback({
                type: "error",
                message: err.response?.data?.message || err.response?.data?.error || "Erro ao excluir pessoa.",
            });
        }
    }

    function handleEdit(person) {
        setEditingPerson(person);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <main>
            <Title>Mercadinho São Miguel - Pessoas</Title>
            <FeedbackMessage type={feedback?.type} message={feedback?.message} />
            <PersonForm
                person={editingPerson}
                onSubmit={handleSave}
                submitting={submitting}
                onCancel={() => setEditingPerson(null)}
            />
            <PersonList
                people={pessoas}
                loading={listLoading}
                error={listError}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </main>
    );
}