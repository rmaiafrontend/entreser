/** Um passo do "passo a passo" de uma área do manual. */
export interface ManualPasso {
  titulo: string
  descricao: string
}

/** Um campo de formulário e sua regra real (validação, obrigatoriedade, limite). */
export interface ManualCampo {
  nome: string
  obrigatorio: boolean
  regra: string
}

/**
 * Uma área do backoffice documentada no manual. O conteúdo é escrito para a
 * administradora de conteúdo (não-técnica) e reflete o comportamento REAL do
 * sistema — campos, validações, o que bloqueia e efeitos no app da usuária.
 */
export interface ManualSecao {
  /** Âncora na página (`#slug`) e chave do índice. */
  slug: string
  titulo: string
  /** 1–2 frases: o que é essa área. */
  resumo: string
  /** Por que existe / quando usar. */
  paraQueServe: string
  passos: ManualPasso[]
  campos: ManualCampo[]
  /** Como se conecta com as outras áreas. */
  relacoes: string
  /** Avisos e pegadinhas: o que bloqueia, o que não dá pra desfazer. */
  atencao: string[]
}
