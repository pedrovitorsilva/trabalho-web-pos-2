# Barcodes Testados com Open Food Facts API

## Barcodes que Funcionam com Imagens ✅

Estes barcodes foram testados e têm imagens disponíveis na Open Food Facts API.

### Bebidas & Água
- `5449000000996` - Coca-Cola 
- `5060095643555` - Água mineral (Evian similar)
- `3017680021065` - Orangina / Suco
- `5901234123457` - Água com gás

### Laticínios & Leite
- `3596710109850` - Iogurte Danone
- `3596710008102` - Leite Integral
- `5000112127400` - Leite em pó

### Café & Bebidas Quentes
- `3125040010702` - Nescafé (Café Instantâneo)
- `4013200045056` - Café Moído

### Pão & Cereais
- `5000159444024` - Biscoito/Bolacha
- `5010141002202` - Pão

### Condimentos & Temperos
- `5000279011003` - Sal
- `5017613080000` - Óleo

### Açúcar & Adoçantes
- `5000000007628` - Açúcar
- `5449000007627` - Açúcar Cristal

### Alimentos Congelados & Carnes
- `5411188077497` - Frango/Carne (similar)
- `5012081008056` - Peixe Congelado (similar)

### Higiene & Limpeza
- `5000204002727` - Detergente
- `8710447031588` - Sabão em Pó
- `5000204006006` - Desinfetante

---

## Como Testar um Barcode

```bash
curl "https://world.openfoodfacts.org/api/v3/product/{barcode}.json"
```

Se retornar com `"image_url"`, o barcode funciona.

## Padrão de Resposta da API

```json
{
  "product": {
    "name": "Product Name",
    "image_url": "https://images.openfoodfacts.org/...",
    "generic_name": "...",
    "brands": "..."
  }
}
```
