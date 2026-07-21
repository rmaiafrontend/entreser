import type { Conteudo } from '@/features/admin/conteudos/types'

/**
 * Seed único do app da Usuária (modo mock) — biblioteca de conteúdos publicados
 * + trilhas. Alimenta os mocks de feed, conteúdos, busca e trilhas para que toda
 * a superfície seja demoável sem backend. Adaptado do protótipo `../entreser`.
 *
 * Tags referenciam os ids do seed do backoffice (`admin/tags/seed`); a Usuária
 * vê os nomes via `tagNome`. Fases citadas nas descrições seguem `admin/fases/seed`.
 */

const T = '2026-05-10T12:00:00.000Z'

function artigo(
  id: string,
  titulo: string,
  descricao: string,
  tags: string[],
  duracao: number,
  corpo: string,
  publicadoEm: string,
): Conteudo {
  return {
    id, titulo, descricao, formato: 'artigo', publicado: true, tags, duracao,
    corpo, media: null, thumb: null, criadoEm: T, atualizadoEm: T, publicadoEm,
  }
}

function midia(
  id: string,
  titulo: string,
  descricao: string,
  formato: 'video' | 'audio',
  tags: string[],
  duracao: number,
  media: string,
  publicadoEm: string,
): Conteudo {
  return {
    id, titulo, descricao, formato, publicado: true, tags, duracao,
    corpo: '', media, thumb: null, criadoEm: T, atualizadoEm: T, publicadoEm,
  }
}

export const SEED_CONTEUDOS: Conteudo[] = [
  artigo(
    'c-1',
    'Como lidar com a ansiedade na espera do beta',
    'Estratégias práticas para atravessar a espera pelo resultado com mais leveza.',
    ['t-1', 't-2'],
    5,
    `A espera pelo resultado do beta-hCG é, para muitas mulheres, um dos momentos mais intensos de todo o tratamento. É natural sentir uma mistura de esperança e medo.

## Por que essa fase é tão difícil

Depois de tanto esforço, a espera nos coloca diante de algo que não podemos controlar. O corpo continua trabalhando em silêncio, e a mente tende a preencher esse silêncio com perguntas.

> Sentir ansiedade não significa que algo está errado. Significa que isso importa profundamente para você.

## O que pode ajudar

- Mantenha uma rotina leve: caminhadas curtas, descanso e atividades que tragam prazer.
- Evite pesquisar sintomas em excesso — cada corpo reage de forma diferente.
- Compartilhe o que sente com alguém de confiança.

Lembre-se: você não precisa dar conta de tudo sozinha.`,
    '2026-05-20T12:00:00.000Z',
  ),
  midia(
    'c-2',
    'Meditação guiada para relaxamento',
    'Um áudio de 12 minutos para acalmar o corpo e a mente antes de dormir.',
    'audio',
    ['t-2', 't-8'],
    12,
    'conteudo/c-2/media.mp3',
    '2026-05-18T12:00:00.000Z',
  ),
  midia(
    'c-3',
    'O que esperar após a transferência embrionária',
    'Um vídeo curto sobre os primeiros dias após a transferência.',
    'video',
    ['t-1', 't-3'],
    8,
    'conteudo/c-3/media.mp4',
    '2026-05-16T12:00:00.000Z',
  ),
  artigo(
    'c-4',
    'Fortalecendo a relação do casal durante o tratamento',
    'Como cuidar da parceria e da comunicação em meio à jornada.',
    ['t-4', 't-2'],
    7,
    `O tratamento de fertilidade é uma travessia a dois — mesmo quando o corpo de uma pessoa carrega a parte mais visível do processo.

## Falar sobre o que sentimos

Cada pessoa vive a jornada no seu ritmo. Reservar um tempo para conversar, sem cobranças, ajuda a evitar que o silêncio vire distância.

- Combine momentos livres do assunto "tratamento".
- Divida as tarefas e as decisões.
- Celebrem as pequenas conquistas juntos.

Cuidar da relação também é cuidar do tratamento.`,
    '2026-05-14T12:00:00.000Z',
  ),
  midia(
    'c-5',
    'Respiração 4-7-8 para momentos de crise',
    'Uma técnica rápida de respiração para acalmar picos de ansiedade.',
    'audio',
    ['t-1', 't-2'],
    5,
    'conteudo/c-5/media.mp3',
    '2026-05-12T12:00:00.000Z',
  ),
  midia(
    'c-6',
    'Depoimento: minha jornada de 2 anos até o positivo',
    'Uma história real de persistência e esperança.',
    'video',
    ['t-5', 't-2'],
    15,
    'conteudo/c-6/media.mp4',
    '2026-05-08T12:00:00.000Z',
  ),
  artigo(
    'c-7',
    'Sono e alimentação durante a estimulação',
    'Hábitos simples para apoiar o corpo na fase de estimulação.',
    ['t-8', 't-7', 't-3'],
    6,
    `Durante a estimulação ovariana, pequenos ajustes na rotina podem fazer diferença no seu bem-estar.

## Sono

Priorize horários regulares e um ritual de desaceleração à noite. O descanso é parte do tratamento.

## Alimentação

- Prefira refeições coloridas e variadas.
- Hidrate-se ao longo do dia.
- Evite se cobrar por uma dieta "perfeita".

O objetivo é cuidado, não controle.`,
    '2026-05-06T12:00:00.000Z',
  ),
  artigo(
    'c-8',
    'Entendendo o protocolo de estimulação ovariana',
    'Um guia acessível sobre como funciona a estimulação.',
    ['t-3', 't-1'],
    9,
    `A estimulação ovariana usa medicações para estimular o desenvolvimento de vários folículos em um mesmo ciclo.

## O acompanhamento

Ultrassons e exames de sangue acompanham o crescimento dos folículos. Cada ajuste é feito pensando no seu caso.

> Dúvidas são bem-vindas. Anote-as e leve para a sua equipe médica.

Entender o processo ajuda a reduzir a ansiedade do desconhecido.`,
    '2026-05-04T12:00:00.000Z',
  ),
  midia(
    'c-9',
    'Diário de gratidão guiado',
    'Um áudio para praticar a gratidão nos dias difíceis.',
    'audio',
    ['t-2', 't-5'],
    8,
    'conteudo/c-9/media.mp3',
    '2026-05-02T12:00:00.000Z',
  ),
]

/** Trilha do seed: curadoria ordenada de conteúdos (M05). */
export interface SeedTrilha {
  id: string
  titulo: string
  descricao: string
  thumb: string | null
  /** Ids de conteúdo, na ordem sugerida. */
  conteudos: string[]
}

export const SEED_TRILHAS: SeedTrilha[] = [
  {
    id: 'tr-1',
    titulo: 'Apoio no Beta',
    descricao: 'Suporte emocional para a fase de espera do resultado — uma das mais intensas.',
    thumb: null,
    conteudos: ['c-1', 'c-5', 'c-3', 'c-6'],
  },
  {
    id: 'tr-2',
    titulo: 'Preparação para a estimulação',
    descricao: 'O essencial para atravessar a fase de estimulação com mais tranquilidade.',
    thumb: null,
    conteudos: ['c-8', 'c-7', 'c-2'],
  },
  {
    id: 'tr-3',
    titulo: 'Autocuidado diário',
    descricao: 'Práticas curtas para manter corpo e mente em equilíbrio ao longo da jornada.',
    thumb: null,
    conteudos: ['c-9', 'c-5', 'c-2'],
  },
]

/** Lookup por id — usado pelos mocks de conteúdo/trilha/feed. */
export const SEED_CONTEUDOS_POR_ID = new Map(SEED_CONTEUDOS.map((c) => [c.id, c]))

/** Mapa conteudoId → trilha (a primeira que o contém) para o selo "em trilha" do feed. */
export const TRILHA_POR_CONTEUDO = new Map<string, SeedTrilha>()
for (const t of SEED_TRILHAS) {
  for (const id of t.conteudos) {
    if (!TRILHA_POR_CONTEUDO.has(id)) TRILHA_POR_CONTEUDO.set(id, t)
  }
}
