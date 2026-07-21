/**
 * Tag — vocabulário que classifica conteúdos e fases (M05). A entidade só tem
 * `nome`; as contagens de uso são informativas (bloqueiam remoção quando > 0).
 */
export interface TagItem {
  id: string
  nome: string
  usoConteudos: number
  usoFases: number
}
