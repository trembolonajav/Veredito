# Fechamento Pendente Fase 2.3 - Veredito

## Objetivo

Listar objetivamente o que ainda falta para considerar a Fase 2.3 encerrada no projeto atual.

## O que falta para fechar a 2.3

| Prioridade | Item pendente | Motivo |
|---|---|---|
| alta | conectar a listagem ao preview real | hoje o fluxo `listagem -> preview` nao existe |
| alta | transformar o preview em centro operacional minimo do fluxo | hoje o preview nao exibe status, acoes, checklist ou camada operacional |
| alta | unificar o modelo de edicao entre listagem e editor principal | a edicao rapida em modal enfraquece o modelo por tipo |
| alta | consolidar a regra unica de transicao editorial | o workflow existe no formulario, mas nao esta fechado como circuito operacional unico |
| alta | implementar historico editorial mockado | a 2.3.9 continua ausente |
| alta | implementar notas editoriais mockadas | a 2.3.10 continua ausente |
| media | revisar a cobertura dos campos por tipo | artigo e opiniao ainda nao fecham tudo que foi historicamente planejado |
| media | revisar a coerencia do preview por tipo | decisao tem bloco proprio; os demais tipos seguem simplificados demais |
| media | ampliar a coerencia da listagem com todos os status do fluxo | filtros rapidos ainda cobrem so parte dos estados existentes |
| baixa | reduzir a distancia entre docs historicos e implementacao real | evita nova leitura errada do status da fase |

## Dependencias internas

- preview depende de um modelo editorial minimo de status e etapa atual
- historico e notas dependem de uma regra unica de eventos editoriais mockados
- fechamento do modal de listagem depende de decidir se ele sera removido, reduzido ou alinhado ao editor principal
- coerencia por tipo depende de fechar primeiro o fluxo base entre listagem, editor e preview

## O que deve ser resolvido antes de abrir a 2.4

1. Garantir acesso real ao preview a partir da listagem.
2. Fechar o fluxo minimo `listagem -> preview -> editar -> workflow -> retorno coerente`.
3. Definir um modelo unico de status/transicao para o modulo.
4. Resolver a lacuna de historico e notas, ao menos em mock local coerente.
5. Parar de depender da edicao rapida como substituto do editor principal.

## Ordem recomendada de execucao do fechamento

1. Fechar navegacao e consistencia entre listagem, preview e editor principal.
2. Fechar workflow editorial como circuito unico entre essas telas.
3. Adicionar historico editorial mockado.
4. Adicionar notas editoriais mockadas.
5. Revisar lacunas finais de campos por tipo e alinhamento de preview.
6. Revalidar a 2.3 contra a documentacao consolidada.

## Conclusao objetiva

A Fase 2.3 **nao pode ser considerada encerrada** no projeto atual.

Ela possui base real suficiente para ser reconhecida como existente, mas ainda carece de fechamento funcional e operacional para sustentar o restante do roadmap com seguranca.
