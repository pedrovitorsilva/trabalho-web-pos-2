// Spec OpenAPI 3.0 escrita a mao, cobrindo os 3 microsservicos do Mercadinho
// Sao Miguel (produtos, pessoas, vendas). Mantida como objeto JS simples para
// nao depender de geracao automatica via JSDoc nas rotas existentes.

const idParam = (name, description, schema = { type: "string" }) => ({
  name,
  in: "path",
  required: true,
  description,
  schema,
});

const respostaErro = {
  type: "object",
  properties: {
    error: { type: "string" },
  },
};

const respostaHealth = {
  type: "object",
  properties: {
    servico: { type: "string" },
    banco: { type: "string", enum: ["conectado", "desconectado"] },
  },
};

const respostaInfo = {
  type: "object",
  properties: {
    servico: { type: "string" },
    descricao: { type: "string" },
    rotas: { type: "array", items: { type: "string" } },
  },
};

function rotasComuns() {
  const tagServico = "Info";
  return {
    "/": {
      get: {
        tags: [tagServico],
        summary: "Informações do serviço (mesma rota nos 3 servidores, cada um retorna seus próprios dados)",
        responses: {
          200: {
            description: "Nome, descrição e rotas disponíveis do serviço",
            content: { "application/json": { schema: respostaInfo } },
          },
        },
      },
    },
    "/health": {
      get: {
        tags: [tagServico],
        summary: "Status de saúde do serviço e da conexão com o MongoDB",
        responses: {
          200: {
            description: "Serviço e banco de dados conectados",
            content: { "application/json": { schema: respostaHealth } },
          },
          503: {
            description: "Banco de dados desconectado",
            content: { "application/json": { schema: respostaHealth } },
          },
        },
      },
    },
  };
}

function crud({ tag, base, schemaName, criarSchemaName = schemaName, extras = {} }) {
  const ref = `#/components/schemas/${schemaName}`;
  const criarRef = `#/components/schemas/${criarSchemaName}`;

  return {
    [base]: {
      get: {
        tags: [tag],
        summary: `Lista todos os registros de ${tag.toLowerCase()}`,
        responses: {
          200: {
            description: "Lista de registros",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: ref } },
              },
            },
          },
        },
      },
      post: {
        tags: [tag],
        summary: `Cria um novo registro de ${tag.toLowerCase()}`,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: criarRef } } },
        },
        responses: {
          201: {
            description: "Registro criado",
            content: { "application/json": { schema: { $ref: ref } } },
          },
          400: {
            description: "Dados inválidos",
            content: { "application/json": { schema: respostaErro } },
          },
        },
      },
    },
    [`${base}/{id}`]: {
      get: {
        tags: [tag],
        summary: "Busca um registro pelo id",
        parameters: [idParam("id", "Id (ObjectId) do documento no MongoDB")],
        responses: {
          200: {
            description: "Registro encontrado",
            content: { "application/json": { schema: { $ref: ref } } },
          },
          404: {
            description: "Registro não encontrado",
            content: { "application/json": { schema: respostaErro } },
          },
        },
      },
      patch: {
        tags: [tag],
        summary: "Atualiza parcialmente um registro pelo id",
        parameters: [idParam("id", "Id (ObjectId) do documento no MongoDB")],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: criarRef } } },
        },
        responses: {
          200: {
            description: "Registro atualizado",
            content: { "application/json": { schema: { $ref: ref } } },
          },
          404: {
            description: "Registro não encontrado",
            content: { "application/json": { schema: respostaErro } },
          },
        },
      },
      delete: {
        tags: [tag],
        summary: "Remove um registro pelo id",
        parameters: [idParam("id", "Id (ObjectId) do documento no MongoDB")],
        responses: {
          200: { description: "Registro removido" },
          404: {
            description: "Registro não encontrado",
            content: { "application/json": { schema: respostaErro } },
          },
        },
      },
    },
    ...extras,
  };
}

const paths = {
  ...rotasComuns(),

  ...crud({
    tag: "Produtos",
    base: "/produtos",
    schemaName: "Produto",
    extras: {
      "/produtos/descricao/{descricao}": {
        get: {
          tags: ["Produtos"],
          summary: "Busca produtos por descrição (contém, case-insensitive)",
          parameters: [idParam("descricao", "Trecho da descrição buscada")],
          responses: {
            200: {
              description: "Produtos encontrados",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Produto" } },
                },
              },
            },
          },
        },
      },
      "/produtos/codigo/{codigo_barras}": {
        get: {
          tags: ["Produtos"],
          summary: "Busca um produto pelo código de barras",
          parameters: [idParam("codigo_barras", "Código de barras do produto")],
          responses: {
            200: {
              description: "Produto encontrado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Produto" } } },
            },
            404: {
              description: "Produto não encontrado",
              content: { "application/json": { schema: respostaErro } },
            },
          },
        },
      },
      "/produtos/barcode/{codigo_barras}": {
        get: {
          tags: ["Produtos"],
          summary: "Alias de /produtos/codigo/{codigo_barras} (compatibilidade com o monolito original)",
          parameters: [idParam("codigo_barras", "Código de barras do produto")],
          responses: {
            200: {
              description: "Produto encontrado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Produto" } } },
            },
            404: {
              description: "Produto não encontrado",
              content: { "application/json": { schema: respostaErro } },
            },
          },
        },
      },
    },
  }),

  ...crud({
    tag: "Campanhas",
    base: "/campanha",
    schemaName: "Campanha",
    extras: {
      "/campanha/ativas": {
        get: {
          tags: ["Campanhas"],
          summary: "Lista campanhas vigentes na data atual",
          responses: {
            200: {
              description: "Campanhas ativas",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Campanha" } },
                },
              },
            },
          },
        },
      },
      "/campanha/descricao/{descricao}": {
        get: {
          tags: ["Campanhas"],
          summary: "Busca campanhas por descrição (contém, case-insensitive)",
          parameters: [idParam("descricao", "Trecho da descrição buscada")],
          responses: {
            200: {
              description: "Campanhas encontradas",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Campanha" } },
                },
              },
            },
          },
        },
      },
    },
  }),

  ...crud({
    tag: "Entradas",
    base: "/entrada",
    schemaName: "Entrada",
    extras: {
      "/entrada/produto/{nomeProduto}": {
        get: {
          tags: ["Entradas"],
          summary: "Lista entradas de estoque que contêm um produto pelo nome",
          parameters: [idParam("nomeProduto", "Nome (ou trecho) do produto")],
          responses: {
            200: {
              description: "Entradas encontradas",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Entrada" } },
                },
              },
            },
          },
        },
      },
    },
  }),

  ...crud({
    tag: "Pessoas",
    base: "/pessoa",
    schemaName: "Pessoa",
    extras: {
      "/pessoa/clientes": {
        get: {
          tags: ["Pessoas"],
          summary: "Lista pessoas do tipo Cliente",
          responses: {
            200: {
              description: "Clientes",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Pessoa" } },
                },
              },
            },
          },
        },
      },
      "/pessoa/funcionarios": {
        get: {
          tags: ["Pessoas"],
          summary: "Lista pessoas do tipo Funcionario",
          responses: {
            200: {
              description: "Funcionários",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Pessoa" } },
                },
              },
            },
          },
        },
      },
      "/pessoa/nome/{nome}": {
        get: {
          tags: ["Pessoas"],
          summary: "Busca pessoas por nome (contém, case-insensitive)",
          parameters: [idParam("nome", "Trecho do nome buscado")],
          responses: {
            200: {
              description: "Pessoas encontradas",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Pessoa" } },
                },
              },
            },
          },
        },
      },
    },
  }),

  ...crud({
    tag: "Vendas",
    base: "/vendas",
    schemaName: "Venda",
    extras: {
      "/vendas/cliente/{idCliente}": {
        get: {
          tags: ["Vendas"],
          summary: "Lista vendas de um cliente pelo id",
          parameters: [idParam("idCliente", "Id do cliente", { type: "integer" })],
          responses: {
            200: {
              description: "Vendas do cliente",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Venda" } },
                },
              },
            },
          },
        },
      },
    },
  }),

  ...crud({
    tag: "Resgates",
    base: "/resgate",
    schemaName: "Resgate",
    extras: {
      "/resgate/cliente/{idCliente}": {
        get: {
          tags: ["Resgates"],
          summary: "Lista resgates de pontos de um cliente pelo id",
          parameters: [idParam("idCliente", "Id do cliente", { type: "integer" })],
          responses: {
            200: {
              description: "Resgates do cliente",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Resgate" } },
                },
              },
            },
          },
        },
      },
    },
  }),
};

const schemas = {
  Pessoa: {
    type: "object",
    required: ["tipo_pessoa", "nome"],
    properties: {
      _id: { type: "string" },
      tipo_pessoa: { type: "string", enum: ["Cliente", "Funcionario"] },
      nome: { type: "string" },
      cpf: { type: "string" },
      cargo: { type: "string" },
      telefone: { type: "string" },
      pontos_acumulados: { type: "number", default: 0 },
      endereco: {
        type: "object",
        properties: {
          cidade: { type: "string" },
          uf: { type: "string" },
        },
      },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },

  Produto: {
    type: "object",
    required: ["nome", "preco_venda", "preco_custo", "codigo_barras"],
    properties: {
      _id: { type: "string" },
      nome: { type: "string" },
      descricao: { type: "string" },
      preco_venda: { type: "number" },
      preco_custo: { type: "number" },
      codigo_barras: { type: "string" },
      qtd_atual: { type: "number", default: 0 },
      qtd_minima: { type: "number", default: 10 },
      id_fornecedor: { type: "number" },
      campanhas_ativas: { type: "array", items: {} },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },

  Campanha: {
    type: "object",
    required: ["data_inicio", "data_termino", "tipo_desconto"],
    properties: {
      _id: { type: "string" },
      data_inicio: { type: "string", format: "date-time" },
      data_termino: { type: "string", format: "date-time" },
      descricao: { type: "string" },
      tipo_desconto: { type: "string" },
    },
  },

  Entrada: {
    type: "object",
    required: ["data_entrada"],
    properties: {
      _id: { type: "string" },
      data_entrada: { type: "string", format: "date-time" },
      valor_total: { type: "number" },
      id_fornecedor: {
        description: "Código numérico do fornecedor ou documento completo da pessoa",
      },
      itens: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id_produto: { type: "number" },
            nome_produto: { type: "string" },
            quantidade: { type: "number" },
            valor_unitario_custo: { type: "number" },
          },
        },
      },
    },
  },

  Venda: {
    type: "object",
    required: ["data_venda"],
    properties: {
      _id: { type: "string" },
      data_venda: { type: "string", format: "date-time" },
      valor_total: { type: "number" },
      pontos_ganhos_total: { type: "number" },
      id_cliente: {
        description: "Código numérico do cliente ou documento completo da pessoa",
      },
      id_funcionario: {
        description: "Código numérico do funcionário ou documento completo da pessoa",
      },
      itens: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id_produto: { type: "number" },
            nome_produto: { type: "string" },
            quantidade: { type: "number" },
            preco_unitario: { type: "number" },
            desconto: { type: "number" },
            pontos_ganhos_unit: { type: "number" },
          },
        },
      },
      pagamentos: {
        type: "array",
        items: {
          type: "object",
          required: ["tipo", "valor", "data"],
          properties: {
            tipo: { type: "string" },
            valor: { type: "number" },
            data: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },

  Resgate: {
    type: "object",
    required: ["data_resgate", "id_cliente", "pontos_usados_total", "itens_resgatados"],
    properties: {
      _id: { type: "string" },
      data_resgate: { type: "string", format: "date-time" },
      id_cliente: { type: "number" },
      pontos_usados_total: { type: "number" },
      itens_resgatados: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          required: ["id_produto", "nome_produto", "quantidade", "pontos_usados_unit"],
          properties: {
            id_produto: { type: "number" },
            nome_produto: { type: "string" },
            quantidade: { type: "number" },
            pontos_usados_unit: { type: "number" },
          },
        },
      },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
};

const spec = {
  openapi: "3.0.3",
  info: {
    title: "Mercadinho São Miguel — API",
    description:
      "Documentação das APIs dos 3 microsserviços do Mercadinho São Miguel (produtos, pessoas, vendas). Selecione o servidor correspondente antes de usar o 'Try it out'.",
    version: "1.0.0",
  },
  servers: [
    { url: "http://localhost:7001", description: "miguel-produtos (produtos, entrada, campanha)" },
    { url: "http://localhost:7002", description: "miguel-pessoas (pessoa)" },
    { url: "http://localhost:7003", description: "miguel-vendas (vendas, resgate)" },
  ],
  tags: [
    { name: "Info" },
    { name: "Produtos" },
    { name: "Campanhas" },
    { name: "Entradas" },
    { name: "Pessoas" },
    { name: "Vendas" },
    { name: "Resgates" },
  ],
  paths,
  components: { schemas },
};

export default spec;
