# Registro do processo — Guia Inclusivo 2026

**Última atualização:** 2026-10-08 09:14 (BRT)

## Decisão da versão pública de formação

O aplicativo será disponibilizado como **simulador público de formação**, sem autenticação, banco de dados, persistência, IA ou analytics próprios, usando exclusivamente casos fictícios.

Os campos podem funcionar somente em memória e devem desaparecer ao atualizar a página. O aviso de formação e de não persistência deve aparecer de forma visível no próprio aplicativo.

A versão só poderá ser liberada quando a publicação pública não carregar mecanismos de coleta de cliques, erros, navegação, rede ou conteúdo digitado.

## Estado do GitHub

Repositório: `simoneananiaseducacional-prog/guia-inclusivo-2026-auditoria`

| Branch | Commit confirmado | Estado |
|---|---|---|
| `fase1-pdi` | `4200fa11fe06ac2ae262421328f745ea1e5da3d4` | Branch atual — PDI + registro de auditoria corrigido |
| `main` | `2f9e23281e8ccac51173016aab9139a84b440adc` | Ainda sem o PDI |

**Não houve merge nem publicação nova nesta auditoria.**

**Correção documental anterior:** `92e455fa9f709bd8bca94910738a562834fdbce6`.

**Registro inicial da auditoria:** `51de6b7885f459794651276d8becd320a1e94542`.

**PDI funcional auditado originalmente no commit:** `f1391e88df0bbdd49dec8e43328c7f787185a723` — base funcional anterior ao registro documental.

## O que foi auditado na `fase1-pdi`

- `pnpm check`: aprovado.
- `pnpm build`: aprovado.
- O PDI está presente com cinco etapas.
- O caso é fictício e está identificado como formação.
- O campo do ACLTA permite observações, sem permitir escolher ou editar habilidades.
- A pendência de validação do CRMG está explícita.
- Não foram encontrados no código da branch usos de `localStorage`, `sessionStorage`, IndexedDB, `fetch`, XHR, `sendBeacon`, analytics ou telemetria própria.
- O coletor `client/public/__manus__/debug-collector.js` não está versionado na branch PDI.
- O tema não é persistido.
- As abas do Estudo de Caso e do PDI usam `role="tab"`, `aria-selected`, `aria-controls`, `role="tabpanel"` e navegação por teclado.

## Testes anteriores de acessibilidade

### Aprovados

- Link “Pular para o conteúdo”.
- Acesso por `Tab` aos controles.
- Ativação de abas com `Enter`.
- Estados independentes dos cinco blocos do PAEE.
- Campos do PAEE desaparecem após recarregar a página.

### Corrigidos na `fase1-pdi`

- Associação semântica entre abas e painéis.
- Navegação por setas, `Home` e `End` nas abas.
- Remoção da persistência local do tema.

### Pendente de confirmação final no build público

- Zoom de 200% sem overflow horizontal.
- Navegação completa em desktop, tablet e celular.

## Bloqueio encontrado na publicação Manus

O endereço público atualmente testado foi:

`https://guiainclu-pnwwkho8.manus.space`

A resposta HTTP foi `200`, mas o HTML público injeta:

```html
<script defer src="https://manus-analytics.com/script.js"></script>
```

Também estão acessíveis os endpoints:

- `/__manus__/debug-collector.js`
- `/__manus__/logs`

O coletor Manus declara capturar e enviar para `/__manus__/logs`:

- logs de console;
- requisições de rede;
- cliques;
- digitação em campos;
- navegação;
- scroll;
- erros do navegador.

O código do aplicativo estar sem persistência não elimina essa coleta da camada de hospedagem. Portanto, **não é permitido afirmar que nada é enviado enquanto essa instrumentação permanecer ativa na publicação**.

## Critério para liberar

Antes do merge na `main` e da liberação do link para formação, é necessário cumprir uma destas alternativas:

1. desabilitar a injeção de analytics e do coletor na publicação Manus e confirmar que os endpoints não coletam dados; ou
2. usar uma hospedagem pública sem essa instrumentação, mantendo o mesmo build estático.

Depois disso:

1. testar o build sem autenticação;
2. testar as rotas principais diretamente;
3. confirmar ausência de scripts externos de analytics/coleta;
4. testar teclado, abas, PAEE e zoom de 200%;
5. fazer merge de `fase1-pdi` na `main`;
6. publicar a versão da `main`;
7. testar em janela anônima e em dispositivos diferentes;
8. registrar os hashes finais e o link aprovado.

## Regra de comunicação

Não afirmar que houve merge, publicação, ausência de coleta ou conclusão dos testes sem evidência verificável no GitHub e no endereço público final.
