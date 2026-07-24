import type { ManualSecao } from './types'

/**
 * Conteúdo do manual da plataforma, escrito a partir do comportamento REAL do
 * backoffice (campos, validações, o que o sistema bloqueia) para a
 * administradora de conteúdo.
 *
 * Ao mudar uma regra no sistema, atualize a seção correspondente aqui — este é
 * o texto que a equipe lê em /admin/manual.
 */
export const MANUAL: ManualSecao[] = [
  {
    "slug": "visao-geral",
    "titulo": "Visão geral da plataforma",
    "resumo": "O Entre Ser organiza o conteúdo em quatro peças que se encaixam: tags classificam tudo, fases agrupam tags, conteúdos recebem tags e trilhas reúnem conteúdos em uma sequência. O onboarding descobre em que fase a usuária está e, a partir daí, o app entrega para ela um feed feito sob medida para aquele momento.",
    "paraQueServe": "Esta página existe para você entender o encadeamento antes de sair cadastrando. No backoffice, o menu \"Conteúdo\" segue exatamente a ordem em que as coisas dependem umas das outras: Tags, Fases, Conteúdos, Trilhas e Onboarding. Se você começar pelo meio, vai esbarrar em listas vazias — não dá para atrelar uma tag que não existe, montar uma trilha sem conteúdos ou dar peso a uma fase que ainda não foi criada. Vale a leitura também quando a plataforma já está no ar e algo \"não aparece para a usuária\": quase sempre a resposta está em um elo dessa corrente (conteúdo sem tag, fase sem tag, conteúdo em rascunho ou pergunta inativa).",
    "passos": [
      {
        "titulo": "1. Crie as tags (o vocabulário da plataforma)",
        "descricao": "Tags são etiquetas curtas, de 2 a 50 caracteres, sem repetir nome. Elas são o motor de filtro de tudo: é por meio delas que um conteúdo chega ao feed de uma fase e que a usuária navega por assunto. Comece por um vocabulário enxuto (algo como 20 a 30 tags), porque toda tag criada aqui vai aparecer na lista de seleção das fases e dos conteúdos. Nenhuma outra área funciona bem antes desta: a tela de fases e a de conteúdos mostram um aviso de \"nenhuma tag cadastrada\" enquanto a lista estiver vazia."
      },
      {
        "titulo": "2. Cadastre as fases do ciclo e atrele as tags",
        "descricao": "Cada fase é um momento da jornada (preparação, estimulação, beta, pós-resultado...). Ao criar uma fase você informa nome, descrição, ordem e se ela está ativa — e marca, entre as tags já criadas, quais pertencem àquele momento. Essa marcação é o que define o feed: quem está na fase recebe os conteúdos que carregam aquelas tags. A ordem não é enfeite — ela desempata a inferência do onboarding e organiza a lista que a usuária vê ao trocar de fase manualmente. Você reordena as fases pelas setinhas do card, e a mudança é salva na hora."
      },
      {
        "titulo": "3. Cadastre os conteúdos e marque as tags de cada um",
        "descricao": "A biblioteca aceita três formatos: artigo (texto escrito no próprio editor), vídeo e áudio. Título é obrigatório; descrição, duração e capa são opcionais. O passo que realmente importa aqui é marcar as tags: sem nenhuma tag, o conteúdo simplesmente não aparece em feed personalizado nenhum nem na navegação por assunto — ele fica \"invisível\", mesmo publicado. Você pode salvar como rascunho e publicar depois; rascunho nunca é exibido para a usuária. Só faz sentido cadastrar conteúdo depois que as tags existem, senão você teria que voltar em cada item para etiquetar."
      },
      {
        "titulo": "4. Monte as trilhas com os conteúdos já publicados",
        "descricao": "Trilha é uma curadoria: você escolhe conteúdos da biblioteca e define a ordem sugerida com as setinhas. Por isso ela vem depois dos conteúdos — o seletor só oferece o que já foi cadastrado. Um mesmo conteúdo pode estar em várias trilhas, em nenhuma (o chamado conteúdo avulso, que continua sendo encontrado pelo feed, pela busca e pela navegação por tag), e a usuária percorre a trilha com total liberdade: pode pular, voltar e consumir fora de ordem. Título é obrigatório; a trilha também tem rascunho e publicação."
      },
      {
        "titulo": "5. Monte o onboarding: perguntas e opções de resposta",
        "descricao": "O onboarding é o questionário que descobre a fase inicial de cada nova usuária. Você cria a pergunta (texto e ordem) e, dentro dela, as opções de resposta. Toda pergunta nova nasce inativa de propósito — ela ainda não tem opções, então não teria como ir ao ar. Uma pergunta precisa de pelo menos duas opções para ser respondível."
      },
      {
        "titulo": "6. Dê os pesos: ligue cada opção de resposta às fases",
        "descricao": "Esta é a etapa que só é possível porque as fases já existem. Em cada opção, abra \"Mapeamento\" e distribua um peso de 0 a 10 para cada fase ativa. Exemplo: a opção \"estou fazendo estimulação\" pode dar 10 para Estimulação e 2 para Preparação. Quando a usuária responde, o sistema soma os pesos de todas as opções que ela escolheu e a fase com maior soma vence; em caso de empate, ganha a fase de menor ordem. Uma opção com todos os pesos em zero não contribui em nada — e trava a ativação da pergunta."
      },
      {
        "titulo": "7. Teste no simulador e só então ative as perguntas",
        "descricao": "Antes de ligar o onboarding, use o botão \"Simular\": ele deixa você escolher respostas e ver qual fase sairia, e ainda analisa todas as combinações possíveis para avisar sobre fases que nenhuma resposta alcança, empates e combinações que não determinam fase alguma. Com o mapeamento redondo, ative as perguntas. O sistema só permite ativar quem tem pelo menos duas opções e todas elas mapeadas para alguma fase — se você tentar salvar uma pergunta como ativa sem cumprir isso, ela é salva inativa e aparece o motivo."
      },
      {
        "titulo": "8. Confira o que a usuária vê e acompanhe as métricas",
        "descricao": "Com a corrente montada, o app da usuária funciona assim: ela se cadastra, responde o onboarding, recebe uma fase e cai no feed. A aba \"Para você\" traz os conteúdos publicados ligados às tags da fase dela, com os não consumidos na frente e os de trilha em andamento antes dos avulsos; a aba \"Trilhas\" mostra as trilhas publicadas; a aba \"Explorar\" permite buscar por palavra e filtrar por tag e formato. Ela também pode trocar de fase quando quiser, e o feed muda na hora. Em \"Métricas\" você acompanha o consumo de forma agregada — nunca dados individuais de uma usuária."
      }
    ],
    "campos": [],
    "relacoes": "A corrente é esta: as tags classificam os conteúdos e também são atreladas às fases; a fase da usuária define quais tags interessam a ela; e o feed entrega os conteúdos publicados que carregam pelo menos uma dessas tags. Um conteúdo pode ter várias tags, e uma tag pode estar em vários conteúdos e em várias fases. As trilhas ficam por cima dessa base: elas apenas reúnem conteúdos já existentes em uma ordem sugerida, sem tirá-los do feed nem da busca — um mesmo conteúdo pode estar em várias trilhas ou em nenhuma. O onboarding é a porta de entrada dessa personalização: cada opção de resposta distribui pesos entre as fases, o sistema soma os pesos das respostas escolhidas e atribui à usuária a fase vencedora (empate vai para a de menor ordem). Ou seja, o onboarding depende das fases, as fases dependem das tags, os conteúdos dependem das tags e as trilhas dependem dos conteúdos. Do lado da usuária, tudo desemboca no mesmo lugar: fase + tags da fase + conteúdos publicados = feed \"Para você\"; trilhas publicadas = aba \"Trilhas\"; e tags + busca = aba \"Explorar\". Se a usuária ficar sem fase (por exemplo, quando não há nenhuma pergunta ativa), o app não a bloqueia: ela entra normalmente, o feed personalizado dá lugar a um convite para descobrir a fase e ela vê os conteúdos mais recentes. As Métricas fecham o ciclo mostrando usuárias por fase, conteúdos mais consumidos, trilhas mais percorridas e taxa de conclusão, sempre de forma agregada.",
    "atencao": [
      "Tag em uso não pode ser removida. Se ela estiver ligada a algum conteúdo ou a alguma fase, o sistema bloqueia a exclusão e explica o motivo — é preciso desvincular de tudo antes. A própria lista mostra \"em uso · N conteúdos, N fases\".",
      "Fase não se exclui, se desativa. Não existe botão de excluir fase: a saída de uso é marcar a situação como \"Inativa\". Fase inativa não é oferecida para a usuária escolher e não entra no cálculo do onboarding — inclusive no desempate.",
      "Mudar as tags de uma fase muda o feed na mesma hora. Não há revisão nem agendamento: ao salvar, quem está naquela fase passa a ver outro conjunto de conteúdos.",
      "Conteúdo sem tag é conteúdo invisível. Mesmo publicado, ele não entra em nenhum feed personalizado nem na navegação por tag — só apareceria em uma busca por palavra ou dentro de uma trilha.",
      "Rascunho não aparece para a usuária, e isso vale dentro das trilhas também. Se você publicar uma trilha que contém conteúdos em rascunho, o sistema pede confirmação: a trilha vai ao ar com buracos.",
      "Publicar trilha vazia também pede confirmação, porque a experiência da usuária fica vazia.",
      "\"Excluir\" conteúdo é exclusão lógica. Ele some da biblioteca do backoffice e deixa de aparecer para as usuárias, mas o registro e o histórico de progresso continuam guardados. Despublicar, por outro lado, é totalmente reversível — basta publicar de novo.",
      "Conteúdo excluído continua referenciado nas trilhas. A trilha passa a mostrar uma linha \"Conteúdo indisponível\" naquela posição; abra a trilha e remova esses itens na mão.",
      "Ao editar uma trilha, a lista de conteúdos é substituída inteira pela que estiver na tela ao salvar. Confira a ordem antes de confirmar.",
      "Trilha não tem exclusão. O que existe é publicada ou rascunho — despublicar é o jeito de tirá-la do ar.",
      "Pergunta do onboarding nasce inativa e só liga com o mapeamento completo: no mínimo duas opções, todas com peso maior que zero para alguma fase. Se você editar tentando marcar \"ativa\" sem cumprir isso, ela é salva inativa e o sistema avisa o porquê.",
      "Zero perguntas ativas desliga o onboarding. Novas usuárias não respondem nada, não recebem fase e ficam sem feed personalizado. A tela mostra um alerta quando isso acontece.",
      "Se as respostas escolhidas não derem peso a nenhuma fase, o sistema não consegue determinar a fase. Rode o simulador antes de ativar: ele aponta essas combinações, os empates e as fases que nenhuma resposta alcança.",
      "Excluir pergunta ou opção é permanente e leva junto o mapeamento de pesos. Itens que já foram respondidos por usuárias podem ter a exclusão bloqueada — nesse caso, desative a pergunta em vez de excluir.",
      "Mexer nos pesos não reprocessa quem já passou pelo onboarding. O novo mapeamento vale para as próximas usuárias; quem já tem fase continua como está (e pode trocar sozinha, pelo app).",
      "A fase é do jeito que a usuária quiser. Ela pode trocar de fase manualmente a qualquer momento — o que o onboarding define é só o ponto de partida, e o progresso dela é preservado na troca.",
      "Reordenar fases, perguntas e opções salva imediatamente ao clicar nas setinhas, sem botão de confirmar. Já a ordem dos conteúdos dentro de uma trilha só é gravada quando você salva a trilha.",
      "A capa (de conteúdo e de trilha) é colada como endereço de uma imagem já hospedada na internet. O envio de arquivo de capa ainda não está disponível."
    ]
  },
  {
    "slug": "o-painel",
    "titulo": "O painel por dentro",
    "resumo": "O painel é a moldura onde a equipe Entre Ser trabalha: um menu à esquerda, uma barra fina no alto com o seu nome e, no meio, a tela que você abriu. Esta seção explica essa moldura — como circular por ela, o que cada perfil enxerga e onde ficam as opções da sua conta.",
    "paraQueServe": "Serve para você se localizar antes de mexer em qualquer coisa. Todo o resto deste manual diz \"abra Tags\", \"vá em Conteúdos\", \"volte para Trilhas\" — e é sempre desta moldura que estamos falando. Vale a leitura no primeiro acesso, para entender o que é a tela de Início (um ponto de partida, não um painel de controle), e também quando alguém da equipe estranha não encontrar uma área: quase sempre a explicação é o perfil de acesso daquela pessoa, e não uma tela sumida. Aqui também estão as opções da sua própria conta — trocar senha e sair —, que ficam escondidas atrás do seu nome, no canto superior direito, e não no menu lateral.",
    "passos": [
      {
        "titulo": "1. Entre e reconheça a tela de Início",
        "descricao": "Logo depois do login você cai na tela de Início. Ela abre com a etiqueta \"Painel administrativo\", um cumprimento com o seu primeiro nome (\"Olá, Marina.\" — o sistema usa só a primeira palavra do nome cadastrado) e a frase \"Gerencie pessoas, conteúdos e acompanhe o consumo da plataforma\". É uma tela de boas-vindas e de partida: nada é executado nem salvo a partir dela."
      },
      {
        "titulo": "2. Use os cartões-atalho para chegar às áreas",
        "descricao": "Abaixo do cumprimento, o Início repete o menu em forma de cartões, agrupados exatamente nas mesmas seções: Pessoas, Conteúdo, Análise e Ajuda. Cada cartão traz um ícone, o nome da área e uma linha explicando para que ela serve (\"Cadastre e gerencie as psicólogas da plataforma\", \"O vocabulário que classifica conteúdos e fases\", \"Biblioteca de artigos, vídeos e áudios\"...). Clicar no cartão abre a área — é o mesmo destino do item correspondente no menu lateral, só que com uma descrição para ajudar quem ainda está aprendendo os nomes."
      },
      {
        "titulo": "3. Circule pelo menu lateral",
        "descricao": "O menu fica sempre à esquerda, com a marca Entre Ser no topo, e é a sua bússola. Para a equipe interna, ele tem cinco grupos: Início (o próprio Início); Pessoas (Profissionais, Equipe, Usuárias); Conteúdo (Tags, Fases, Conteúdos, Trilhas, Onboarding); Análise (Métricas); e Ajuda (Manual — esta página que você está lendo). O item da tela em que você está fica destacado em rosé. Quando você entra mais fundo — criando um conteúdo, editando uma profissional, abrindo uma pergunta do onboarding — o destaque continua no item de origem, então dá para saber onde você está mesmo em telas internas."
      },
      {
        "titulo": "4. Recolha o menu quando precisar de espaço",
        "descricao": "No canto esquerdo da barra superior há um botão que encolhe o menu. Ao recolher, a faixa lateral fica estreita e mostra só os ícones: os títulos dos grupos (Pessoas, Conteúdo...) dão lugar a linhas divisórias finas e a marca vira apenas o símbolo. Passe o mouse sobre um ícone para ver o nome dele. O mesmo botão devolve o menu ao tamanho normal — a dica que aparece nele alterna entre \"Recolher menu\" e \"Expandir menu\". O painel guarda a sua escolha: da próxima vez que você entrar naquele mesmo navegador, ele abre do jeito que você deixou, e outras abas abertas se ajustam junto."
      },
      {
        "titulo": "5. Reconheça-se na barra superior",
        "descricao": "A barra fina do topo acompanha você enquanto rola a página. À direita ficam o seu nome, logo abaixo o rótulo do seu tipo de acesso — \"Admin Geral\" ou \"Profissional\" — e um círculo com as suas iniciais (as letras iniciais das duas primeiras palavras do seu nome). Esse rótulo é a maneira mais rápida de conferir com que perfil você está conectada, o que ajuda bastante quando a equipe tem mais de uma conta em uso no mesmo computador."
      },
      {
        "titulo": "6. Abra o menu da sua conta",
        "descricao": "Clique no seu nome (ou no círculo com as iniciais) e um painelzinho se abre logo abaixo. Ele mostra de novo o seu nome e, embaixo, o e-mail com que você entrou — útil para confirmar de qual conta se trata. Em seguida vêm duas opções: \"Trocar senha\" e \"Sair\", esta última em vermelho. Para fechar sem escolher nada, clique em qualquer ponto fora do painelzinho ou pressione a tecla Esc."
      },
      {
        "titulo": "7. Troque a senha (atenção: o caminho muda conforme o perfil)",
        "descricao": "Se você é da equipe interna (Admin Geral), \"Trocar senha\" não abre um formulário de senha atual e nova: ele te leva para a tela de recuperação por e-mail, que pede apenas o seu endereço e tem o botão \"Enviar link\" — a mesma tela do \"Esqueci minha senha\" da entrada. Você sai do painel nesse momento. Se você é Profissional, o caminho é direto: abre a tela \"Trocar senha\" dentro do painel, com os campos senha atual, nova senha e confirmação, e a listinha de requisitos que vai ficando verde conforme a nova senha atende a cada um."
      },
      {
        "titulo": "8. Saia com segurança",
        "descricao": "A opção \"Sair\" não encerra a sessão de imediato: aparece antes uma confirmação com o título \"Sair do backoffice?\" e o aviso de que a sua sessão será encerrada e você voltará à tela de login. Você pode cancelar. Ao confirmar, o painel se fecha e você volta para a tela de entrada do backoffice. Nada do que você já salvou se perde — mas o que estiver preenchido numa tela e ainda não salvo, sim."
      }
    ],
    "campos": [],
    "relacoes": "O painel é a moldura em que todas as outras seções deste manual acontecem. A ordem dos grupos no menu não é aleatória: \"Conteúdo\" lista Tags, Fases, Conteúdos, Trilhas e Onboarding exatamente na ordem em que uma coisa depende da outra, então percorrer o menu de cima para baixo é percorrer o caminho certo de configuração. O grupo \"Pessoas\" é onde nascem os próprios acessos ao painel: em Equipe você cadastra quem entra como Admin Geral e em Profissionais você cadastra as psicólogas — ou seja, o painel que uma pessoa vai encontrar quando entrar é decidido lá, no momento do convite. \"Análise\" só lê dados, nunca altera nada. E \"Ajuda › Manual\" é esta página, que fica sempre a um clique de distância de qualquer tela. Do lado da Profissional, o painel enxuto se conecta com a área de Profissionais: o que a equipe interna cadastra sobre ela vira o perfil público exibido às usuárias, e é em \"Meu perfil\" que ela mesma mantém foto, telefone, CRP, abordagem e bio atualizados.",
    "atencao": [
      "A tela de Início não executa nada — ela só leva. Não há ali nenhum botão de criar, publicar ou excluir, e ela também não mostra contadores, pendências nem alertas. Se você procura números, o lugar é Métricas.",
      "Na tela de Início, o cartão do Manual (seção Ajuda) aparece só com o nome, sem a frase de descrição que os outros cartões têm. É assim mesmo, não é um cartão com defeito.",
      "Pegadinha da senha, para a equipe interna: \"Trocar senha\" no menu da conta NÃO abre formulário de senha atual e nova. Ele leva para a recuperação por e-mail — a tela que pede só o seu endereço e tem o botão \"Enviar link\". É o mesmo caminho do \"Esqueci minha senha\" da tela de entrada.",
      "Ao cair nessa tela de recuperação, você sai do painel: o menu lateral e a barra superior deixam de existir ali. Para voltar sem trocar a senha, use \"Voltar para o login\" no rodapé e entre de novo.",
      "Enquanto a plataforma estiver em demonstração, nenhum e-mail é realmente enviado. Depois de \"Enviar link\" aparece um bloco \"Modo demonstração\" com o atalho \"Redefinir senha agora\" — é por ele que você conclui a troca. Se fechar a tela sem usar o atalho, é preciso pedir o link outra vez.",
      "Só o perfil Profissional cai no formulário direto de troca de senha, com senha atual, nova senha e confirmação. A nova senha precisa ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um número; se as duas digitadas não coincidirem, o sistema avisa antes de salvar.",
      "Depois que a Profissional troca a senha, todas as sessões ativas dela são encerradas e ela precisa entrar novamente — a própria tela avisa isso e oferece o botão \"Entrar novamente\".",
      "A psicóloga não enxerga Pessoas, Conteúdo, Análise nem Ajuda. O menu dela tem um único grupo, \"Conta\", com um único item: \"Meu perfil\". Não são telas trancadas com cadeado — elas simplesmente não são desenhadas para o acesso dela, porque quem cuida do vocabulário, das fases, da biblioteca e do onboarding é a equipe interna.",
      "Hoje, na prática, quem entra no backoffice entra como Admin Geral: o rótulo abaixo do nome mostra \"Admin Geral\" e o menu completo aparece. A visão reduzida da Profissional já está construída e funciona, mas ainda não é entregue pela tela de entrada — vale saber disso ao testar o painel com contas diferentes.",
      "Recolher o menu é preferência de aparência, não de permissão: ninguém perde acesso a nada por recolher. E a escolha vale apenas no navegador em que foi feita — em outro computador, o painel volta a abrir com o menu inteiro.",
      "\"Sair\" sempre pede confirmação, então um clique errado não te desconecta. Mas, ao confirmar, o que estiver preenchido numa tela e ainda não salvo se perde: salve antes de sair."
    ]
  },
  {
    "slug": "tags",
    "titulo": "Tags",
    "resumo": "As tags são o vocabulário que classifica conteúdos e fases dentro da plataforma. Uma tag é só um nome — e é esse nome que faz o conteúdo certo chegar na usuária certa.",
    "paraQueServe": "As tags são o motor de filtro do feed. Elas ligam os conteúdos às fases do ciclo: quando uma usuária está em determinada fase, o app prioriza os conteúdos que carregam as mesmas tags atreladas àquela fase. Use esta área para montar e manter o vocabulário da plataforma — criar uma tag nova antes de cadastrar um conteúdo que precisa dela, corrigir um nome mal escrito ou limpar tags que não são mais usadas. Vale lembrar: criar a tag aqui não a coloca em lugar nenhum sozinha; depois é preciso ir em Conteúdos ou em Fases e atrelá-la. Essa área fica no menu lateral, na seção Conteúdo, e é visível apenas para o perfil de Admin Geral.",
    "passos": [
      {
        "titulo": "Criar uma tag",
        "descricao": "No bloco \"Nova tag\", no topo da tela, escreva o nome (o exemplo sugerido é \"Autocompaixão\") e clique em \"Criar tag\". Atenção: apertar Enter não cria — é preciso clicar no botão. Se der tudo certo, aparece a mensagem \"Tag [nome] criada\", o campo se esvazia e a lista abaixo se recarrega já com a tag nova no lugar alfabético dela. A tag nasce sem nenhum vínculo, marcada como \"sem conteúdos\"."
      },
      {
        "titulo": "Encontrar uma tag na lista",
        "descricao": "Use o campo \"Buscar tag\", logo abaixo do bloco de criação. Ele filtra por qualquer trecho do nome e não diferencia maiúsculas de minúsculas — digitar \"son\" encontra \"Sono\". O contador acima da lista mostra quantas tags estão aparecendo do total (ex.: \"3 de 9 tags\"). Se nada corresponder, aparece a mensagem \"Nenhuma tag encontrada\". A busca só muda o que está na tela; nada é alterado nem excluído."
      },
      {
        "titulo": "Renomear uma tag",
        "descricao": "Na linha da tag, clique no ícone de lápis (\"Renomear\"). O nome vira um campo editável ali mesmo, com os botões \"Salvar\" e \"Cancelar\". Ajuste o texto e clique em Salvar — aparece a confirmação \"Tag renomeada\" e a lista se reordena alfabeticamente. O vínculo com conteúdos e fases é feito por um identificador interno, e não pelo texto: por isso, renomear é seguro e o nome novo passa a aparecer imediatamente em todos os conteúdos e fases que já usavam aquela tag, sem precisar reeditar nada. \"Cancelar\" descarta a edição sem salvar."
      },
      {
        "titulo": "Excluir uma tag",
        "descricao": "Na linha da tag, clique no ícone de lixeira (\"Remover\"). Se a tag não estiver em uso, abre a confirmação \"Remover tag?\", avisando que a exclusão é permanente e não pode ser desfeita. Clique em \"Remover\" para confirmar ou em \"Cancelar\" para desistir. Se a tag estiver vinculada a algum conteúdo ou fase, o sistema não deixa: abre um aviso \"Tag em uso\" pedindo que você a desvincule de tudo antes — esse aviso não tem opção de excluir mesmo assim."
      },
      {
        "titulo": "Desvincular uma tag antes de excluir",
        "descricao": "Para liberar uma tag em uso, vá até cada conteúdo que a utiliza (em Conteúdo › Conteúdos, abra o conteúdo, encontre o bloco \"Tags\" e clique na etiqueta marcada para desmarcá-la) e até cada fase (em Conteúdo › Fases, edite a fase e clique na tag no bloco \"Tags atreladas\" para removê-la). A indicação de uso na lista de Tags mostra quantos conteúdos e quantas fases ainda estão vinculados. Quando os dois números chegarem a zero, a exclusão passa a ser permitida."
      },
      {
        "titulo": "Conferir se a tela carregou",
        "descricao": "Enquanto a lista carrega aparece \"Carregando tags…\". Se houver falha de conexão, aparece a mensagem de que não foi possível carregar as tags, com um botão \"Tentar novamente\" — clique nele para recarregar. Se ainda não existir nenhuma tag cadastrada, a tela mostra \"Nenhuma tag ainda\" e convida a criar a primeira pelo bloco do topo."
      }
    ],
    "campos": [
      {
        "nome": "Nome da tag (bloco \"Nova tag\")",
        "obrigatorio": true,
        "regra": "É o único dado de uma tag — não existe cor, descrição, ícone nem ordem. Precisa ter de 2 a 50 caracteres, contando depois que os espaços do começo e do fim são descartados automaticamente. Não pode repetir o nome de outra tag já cadastrada, e a comparação ignora maiúsculas e minúsculas (\"Sono\" e \"sono\" contam como a mesma tag). Aceita acentos e espaços. O campo não trava a digitação no limite: se você passar de 50 caracteres, o aviso \"O nome deve ter de 2 a 50 caracteres\" só aparece ao clicar em \"Criar tag\". Nome repetido mostra \"Já existe uma tag com este nome\". Não há valor padrão — o campo começa vazio."
      },
      {
        "nome": "Nome da tag (edição na linha, ao renomear)",
        "obrigatorio": true,
        "regra": "Vale exatamente a mesma regra da criação: de 2 a 50 caracteres, sem repetir o nome de outra tag (ignorando maiúsculas e minúsculas). A própria tag que está sendo editada é desconsiderada nessa checagem, então salvar sem mudar nada, ou apenas trocar a caixa das letras (de \"sono\" para \"Sono\"), é aceito normalmente. O campo já vem preenchido com o nome atual."
      },
      {
        "nome": "Buscar tag",
        "obrigatorio": false,
        "regra": "Filtro apenas visual, para achar uma tag na lista. Compara qualquer trecho do nome, sem diferenciar maiúsculas de minúsculas, e os espaços das pontas são ignorados. Não altera, não salva e não exclui nada — basta apagar o texto para ver a lista inteira de novo."
      }
    ],
    "relacoes": "As tags são um vocabulário compartilhado e aparecem em dois lugares do backoffice. Em Conteúdo › Conteúdos, o formulário de cada conteúdo tem um bloco \"Tags\" com todas as tags cadastradas como etiquetas clicáveis — clique para marcar ou desmarcar. Se o conteúdo ficar sem nenhuma tag, ele não aparece em nenhum feed personalizado nem na navegação por tag do app. Em Conteúdo › Fases, cada fase tem o bloco \"Tags atreladas\", também com etiquetas clicáveis; as tags atreladas priorizam os conteúdos daquela fase no feed da usuária e orientam a identificação da fase no onboarding. Nos dois formulários, se ainda não houver nenhuma tag criada, aparece um aviso pedindo que você as cadastre aqui primeiro — ou seja, na prática o vocabulário de tags é o primeiro passo do fluxo de conteúdo. No aplicativo da usuária, as tags aparecem como rótulo dos cards e como as opções de navegação da aba Explorar; esses filtros são montados a partir das tags que estão realmente presentes nos conteúdos publicados, então uma tag recém-criada e ainda sem conteúdo não aparece para a usuária. Trilhas e Onboarding não usam tags diretamente.",
    "atencao": [
      "A exclusão é definitiva. Não existe lixeira nem \"desfazer\": ao confirmar \"Remover\", a tag some de vez. Recriar depois uma tag com exatamente o mesmo nome NÃO restaura os vínculos antigos — para o sistema é uma tag nova, e todos os conteúdos e fases teriam de ser reeditados um a um.",
      "Tag em uso não pode ser excluída. Se a tag estiver vinculada a qualquer conteúdo ou fase, o clique na lixeira abre o aviso \"Tag em uso\" e nada é apagado. Não existe exclusão em cascata: o sistema nunca desvincula os conteúdos por você.",
      "A indicação de uso na linha mostra a contagem real: \"em uso · 4 conteúdos, 2 fases\". É possível ver \"0 conteúdos\" e ainda assim a tag estar em uso — quando ela está atrelada só a fases. Nesses casos a tag continua bloqueada para exclusão.",
      "A etiqueta \"sem conteúdos\" indica que nenhum conteúdo e nenhuma fase estão usando a tag naquele momento. Mesmo assim, se alguém vincular a tag enquanto a sua tela está aberta, a confirmação de remoção pode falhar e o aviso \"Tag em uso\" aparece depois da confirmação — nada é excluído nesse caso, e a lista é atualizada.",
      "Renomear é seguro e imediato, mas cuidado com o efeito: o nome novo aparece na hora para as usuárias, em todos os conteúdos e fases que já usavam a tag. Não é uma mudança silenciosa de bastidor.",
      "Não existe fusão de tags. Se acabarem sendo criadas duas tags parecidas (\"Sono\" e \"Insônia\", por exemplo), elas seguem como vocabulários separados; consolidar exige reeditar manualmente cada conteúdo e cada fase. Vale conferir a lista antes de criar uma tag nova.",
      "A ordem da lista é sempre alfabética e não pode ser alterada — não há campo de posição, cor ou destaque. Se você precisa de uma hierarquia ou agrupamento visual, isso não existe nesta área.",
      "Apertar Enter no campo \"Nova tag\" não cria nada. É preciso clicar no botão \"Criar tag\".",
      "Criar a tag é só metade do trabalho: enquanto ela não for atrelada a um conteúdo ou a uma fase, ela não produz nenhum efeito no app da usuária e nem aparece como opção de navegação na aba Explorar."
    ]
  },
  {
    "slug": "fases",
    "titulo": "Fases",
    "resumo": "Fases são os momentos do ciclo da usuária (por exemplo: Preparação, Estimulação, Beta). Cada fase tem um nome, uma descrição, uma posição na ordem, uma situação (ativa ou inativa) e um conjunto de tags atreladas.",
    "paraQueServe": "A fase é o que faz a plataforma falar com a mulher no momento em que ela está. É a partir da fase que o aplicativo prioriza os conteúdos do feed — através das tags atreladas àquela fase — e é a fase que o questionário de onboarding tenta descobrir quando uma usuária nova entra. Você usa esta área para cadastrar os momentos do ciclo, escrever o texto que a usuária lê na tela \"Minha fase\", definir a ordem de progressão entre eles e escolher quais tags representam cada momento. Mexer aqui tem efeito imediato no aplicativo: não existe rascunho nem \"publicar depois\".",
    "passos": [
      {
        "titulo": "Abrir a área de Fases",
        "descricao": "No menu lateral, em Conteúdo, clique em Fases. A tela mostra todas as fases cadastradas, uma embaixo da outra, na ordem de progressão (o número aparece dentro do círculo, à esquerda de cada card). Em cada card você vê: o nome, o selo Ativa ou Inativa, a descrição e a lista de tags atreladas. Fases inativas aparecem esmaecidas e com a barra lateral cinza. Se ainda não houver nenhuma fase, a tela oferece o botão para criar a primeira. Se der algum problema de conexão, aparece um aviso com o botão Tentar novamente."
      },
      {
        "titulo": "Criar uma nova fase",
        "descricao": "Clique em Nova fase, no topo direito. Abre uma janela com todos os campos: Nome, Descrição, Ordem, Situação e Tags atreladas. A Ordem já vem preenchida com o próximo número livre (o final da fila) e a Situação já vem em Ativa — você pode mudar as duas. Marque as tags que quiser atrelar clicando nos chips. Clique em Criar fase para concluir; aparece um aviso verde confirmando (\"Fase [nome] criada\") e a fase entra na lista, já valendo para o aplicativo. A fase e as tags são gravadas na mesma operação: não precisa salvar duas vezes."
      },
      {
        "titulo": "Editar uma fase existente",
        "descricao": "Clique em Editar, dentro do card da fase. Abre a mesma janela, já preenchida com os dados atuais. Altere o que precisar e clique em Salvar alterações; aparece o aviso verde \"Fase atualizada\". Tudo o que você mudar (nome, descrição, tags) passa a valer na hora, inclusive para as usuárias que já estão nessa fase — elas leem a mesma ficha que você acabou de editar."
      },
      {
        "titulo": "Atrelar ou remover tags da fase",
        "descricao": "Na janela de criar ou editar, a seção Tags atreladas mostra todas as tags já cadastradas em forma de chips. Clique em um chip para atrelar (ele fica preenchido, com um sinal de conferido) e clique de novo para remover (volta ao contorno tracejado). O contador ao lado do título mostra quantas estão atreladas. Nada é gravado enquanto você não clicar em Criar fase ou Salvar alterações — e, ao salvar, vale exatamente a seleção que estiver na tela naquele momento: as que você desmarcou são desvinculadas. Só é possível escolher tags que já existam; se ainda não houver nenhuma, a janela avisa e você precisa criá-las antes em Conteúdo › Tags."
      },
      {
        "titulo": "Mudar a ordem das fases",
        "descricao": "Use as setinhas para cima e para baixo, à esquerda de cada card. Cada clique troca a fase de lugar com a vizinha e grava na hora — não existe botão de salvar nem de desfazer aqui (para voltar, clique na seta contrária). A seta fica apagada quando a fase já está no topo ou no fim da lista. Depois de mover, o sistema renumera todas as fases de 1 em diante, na sequência da tela. Se a gravação falhar, aparece um aviso vermelho (\"Não foi possível reordenar as fases\") e nada muda."
      },
      {
        "titulo": "Tirar uma fase de uso (desativar)",
        "descricao": "Não existe excluir fase. Para tirar uma fase de circulação, abra Editar, mude a Situação para Inativa e salve. A fase continua na lista do painel, esmaecida e com o selo Inativa, mas deixa de aparecer para a usuária escolher na tela \"Minha fase\" e passa a ser ignorada pelo questionário de onboarding. Para trazer de volta, é só editar de novo e voltar para Ativa. Não há tela de confirmação: o efeito é imediato assim que você salva."
      },
      {
        "titulo": "Conferir o efeito no onboarding",
        "descricao": "Toda vez que você criar, desativar ou reordenar fases, vale abrir Conteúdo › Onboarding e usar o Simulador. Ele mostra qual fase uma usuária receberia conforme as respostas e avisa se alguma fase ficou inalcançável (nenhuma combinação de respostas leva até ela), se há empates e se todas as fases estão inativas — situação em que nenhuma usuária nova consegue receber fase."
      }
    ],
    "campos": [
      {
        "nome": "Nome",
        "obrigatorio": true,
        "regra": "Texto curto, no máximo 100 caracteres. Não pode ficar em branco (só espaços não conta como preenchido) — se estiver vazio, aparece \"Informe o nome da fase\"; se passar de 100 caracteres, aparece \"Máximo de 100 caracteres\". Espaços sobrando no começo e no fim são removidos ao salvar. O sistema não impede dois nomes iguais. É o nome que a usuária vê no aplicativo, e que aparece no mapeamento do onboarding, na lista de Usuárias e nas Métricas."
      },
      {
        "nome": "Descrição",
        "obrigatorio": false,
        "regra": "Texto livre, mais longo, sem limite de tamanho (o campo abre com três linhas e cresce conforme você escreve). Espaços sobrando são removidos ao salvar. É o texto que a usuária lê na tela \"Minha fase\", tanto no destaque da fase atual quanto embaixo do nome de cada fase na hora de trocar. Se ficar em branco, o card no painel fica sem descrição e o aplicativo mostra um texto genérico no lugar."
      },
      {
        "nome": "Ordem",
        "obrigatorio": true,
        "regra": "Apenas números inteiros — nada de vírgula, sinal de menos ou letras; se digitar outra coisa, aparece \"A ordem deve ser um número inteiro\". Ao criar, já vem preenchida com o próximo número da fila (o maior número em uso mais um; 1 se não houver nenhuma fase ainda). Duas fases não podem ficar com o mesmo número: se você digitar um número que outra fase já usa, o sistema recusa a gravação. Esse número define a posição na lista e serve de critério de desempate quando o onboarding empata a pontuação entre duas fases — ganha sempre a de número menor."
      },
      {
        "nome": "Situação (Ativa / Inativa)",
        "obrigatorio": true,
        "regra": "Escolha entre dois botões; ao criar já vem marcado Ativa. Ativa significa que a fase aparece para a usuária escolher na tela \"Minha fase\" e conta no cálculo do onboarding. Inativa tira a fase de uso, mas ela continua visível no painel (esmaecida, com selo Inativa) e continua aparecendo na tela de mapeamento do onboarding, marcada como inativa. Não é possível excluir uma fase — desativar é o mecanismo de saída de uso."
      },
      {
        "nome": "Tags atreladas",
        "obrigatorio": false,
        "regra": "Seleção múltipla, feita clicando nos chips; pode ficar sem nenhuma. Só aparecem tags já cadastradas em Conteúdo › Tags — não dá para criar tag daqui. Ao salvar, vale exatamente a seleção da tela: o que você desmarcou é desvinculado. Desvincular uma tag da fase não apaga a tag; ela continua existindo para os conteúdos. São essas tags que fazem o feed priorizar conteúdos para quem está nessa fase."
      }
    ],
    "relacoes": "Tags: a fase não cria tags, ela se apoia nas que já existem em Conteúdo › Tags — por isso vale cadastrar as tags antes de montar as fases. E o caminho de volta também conta: uma tag atrelada a alguma fase fica marcada como \"em uso\" e não pode ser removida na tela de Tags enquanto não for desvinculada de todas as fases (e de todos os conteúdos). Conteúdos: não existe ligação direta entre conteúdo e fase — o encontro acontece pelas tags em comum. Um conteúdo publicado que tenha ao menos uma tag da fase da usuária é o que sobe no feed dela; por isso, mudar as tags de uma fase muda na hora o que aquelas mulheres passam a ver. Trilhas seguem a mesma lógica, pelos conteúdos que as compõem. Onboarding: cada opção de resposta do questionário distribui um peso de 0 a 10 para cada fase; ao finalizar, o sistema soma os pesos das respostas escolhidas e entrega a fase de maior pontuação (empate vai para a fase de menor número de ordem). Só fases ativas entram nessa conta. Aplicativo da usuária: na tela \"Minha fase\" ela vê o nome e a descrição da fase atual e pode trocar livremente entre as fases ativas — o feed se ajusta em seguida. Usuárias e Métricas: a listagem de usuárias mostra a fase atual de cada uma (ou \"sem fase\"), e o painel de Métricas traz a distribuição de \"Usuárias por fase\".",
    "atencao": [
      "Fase não se exclui. Não existe botão de excluir em nenhum lugar desta tela — o único jeito de tirar uma fase de circulação é mudar a Situação para Inativa. Isso é proposital: apagar uma fase deixaria usuárias órfãs.",
      "Desativar não pede confirmação e vale na hora. Assim que você salva, a fase some das opções da usuária e sai do cálculo do onboarding.",
      "Desativar não move ninguém. Quem já estava naquela fase continua nela — o sistema não reclassifica usuárias automaticamente. Mas, como a fase inativa não aparece mais na lista de escolha, se ela trocar de fase não consegue voltar para a antiga.",
      "Se todas as fases ficarem inativas, nenhuma usuária nova recebe fase e o onboarding quebra. Mantenha sempre pelo menos uma ativa (o Simulador, em Onboarding, avisa quando isso acontece).",
      "Fase inativa continua aparecendo na tela de mapeamento do onboarding, marcada como \"inativa\". Dar peso a ela é peso jogado fora: o cálculo ignora fases inativas.",
      "Prefira as setinhas a digitar na Ordem. As setas reordenam com segurança e renumeram tudo de 1 em diante; digitar um número já usado por outra fase faz o salvamento falhar com o aviso \"Não foi possível atualizar a fase\".",
      "A renumeração apaga os \"buracos\". Se você tinha ordens 1, 5 e 10 e usar as setas, tudo vira 1, 2, 3.",
      "Mexer na ordem mexe no desempate do onboarding. Quando duas fases empatam em pontos, ganha a de número menor — trocar a ordem pode fazer usuárias novas caírem em outra fase.",
      "Alterar as tags muda o feed na mesma hora, para todas as mulheres que estão naquela fase. Nenhum conteúdo é apagado, mas o que sobe primeiro muda.",
      "Ao salvar as tags, vale exatamente o que está marcado na tela — o que você desmarcou é desvinculado, sem aviso.",
      "Se a gravação falhar (conexão, por exemplo), a janela fecha do mesmo jeito e aparece um aviso vermelho no canto. O que você digitou se perde: confira na lista se a fase realmente foi criada ou atualizada antes de seguir.",
      "Clicar fora da janela ou apertar Esc fecha e descarta o que você digitou, sem perguntar nada. Durante o salvamento a janela fica travada, o que é normal.",
      "O sistema não bloqueia nomes repetidos — dá para criar duas fases com o mesmo nome, e isso confunde o mapeamento do onboarding e as métricas. Confira a lista antes de criar.",
      "Editar nome ou descrição afeta imediatamente quem já está na fase: é a mesma ficha que o aplicativo mostra a ela.",
      "Se as tags não carregarem (falha de conexão), os cards podem exibir \"Nenhuma atrelada\" e a janela dizer que não há tags cadastradas, mesmo existindo. Recarregue a página antes de concluir que as tags sumiram."
    ]
  },
  {
    "slug": "conteudos",
    "titulo": "Conteúdos",
    "resumo": "É a biblioteca da plataforma: todos os artigos, vídeos e áudios que as usuárias leem, assistem e escutam no app. Aqui você cria, edita, publica, tira do ar e organiza cada peça de conteúdo.",
    "paraQueServe": "Tudo o que a usuária consome no app nasce aqui. Um conteúdo pode ser um artigo escrito por você dentro do próprio painel, um vídeo ou um áudio. Use esta área sempre que precisar publicar material novo, corrigir um texto já no ar, tirar algo de circulação temporariamente ou preparar conteúdo com calma antes de mostrar para alguém — o formato rascunho existe justamente para isso. É também de onde as Trilhas puxam os itens: sem conteúdo cadastrado aqui, não há trilha para montar.",
    "passos": [
      {
        "titulo": "Encontrar um conteúdo na biblioteca",
        "descricao": "No menu lateral, seção Conteúdo, clique em \"Conteúdos\". A lista mostra título, formato, status (Publicado ou Rascunho), duração e data da última atualização. Você pode buscar pelo título (a busca não procura dentro da descrição nem do texto do artigo), filtrar por formato (Artigo, Vídeo, Áudio) e por status. A lista mostra 15 itens por página. Clicar em qualquer linha abre o conteúdo para edição."
      },
      {
        "titulo": "Criar um conteúdo novo",
        "descricao": "Clique em \"Novo conteúdo\", no canto superior direito. Escolha primeiro o formato — Artigo já vem selecionado — porque é ele que define o restante da tela: Artigo mostra o editor de texto; Vídeo e Áudio mostram a área de envio do arquivo. Depois preencha título, descrição, duração, capa e tags, e escreva o texto (ou anexe a mídia). Ao final, escolha entre \"Salvar rascunho\" e \"Publicar\"."
      },
      {
        "titulo": "Escrever o texto de um artigo",
        "descricao": "O editor fica na parte de baixo do formulário e usa Markdown, uma forma simples de formatar texto. Você não precisa decorar nada: a barra de ferramentas tem botões para títulos, negrito, itálico, tachado, citação, lista simples, lista numerada, link, imagem e linha divisória. No canto direito da barra há três modos: \"Escrever\" (só o texto), \"Dividir\" (texto e resultado lado a lado) e \"Pré-visualizar\" (só o resultado, exatamente como a usuária vai ver). No rodapé do editor aparece a contagem de palavras e caracteres."
      },
      {
        "titulo": "Salvar como rascunho",
        "descricao": "O botão \"Salvar rascunho\" guarda tudo sem mostrar nada para as usuárias. Ele cobra apenas título e, se houver duração preenchida, que ela seja válida — não exige o texto do artigo nem o arquivo de mídia. É o caminho para começar hoje e terminar amanhã. Ao salvar, você volta para a listagem e vê a mensagem \"Rascunho salvo\"."
      },
      {
        "titulo": "Publicar",
        "descricao": "O botão \"Publicar\" salva e coloca no ar de uma vez. Antes de publicar, o sistema confere: título preenchido, duração válida (se houver) e, principalmente, o texto do artigo (para o formato Artigo) ou o arquivo (para Vídeo e Áudio). Se faltar algo, a mensagem aparece embaixo do campo e nada é salvo. Publicado, o conteúdo passa a aparecer no feed, na busca e na navegação por tag do app."
      },
      {
        "titulo": "Editar um conteúdo existente",
        "descricao": "Clique na linha da lista, ou use o menu de três pontinhos e escolha \"Editar\". Altere o que precisar e salve. Se o conteúdo já está publicado, o botão principal aparece como \"Salvar e publicar\" — é ele que você deve usar para manter o conteúdo no ar. As alterações valem imediatamente para quem estiver usando o app."
      },
      {
        "titulo": "Publicar ou despublicar direto pela lista",
        "descricao": "No menu de três pontinhos de cada linha existe \"Publicar\" / \"Despublicar\". Publicar por ali é imediato, sem confirmação. Despublicar abre uma janela de confirmação avisando que o conteúdo deixa de aparecer no feed, na busca e na navegação — e lembrando que a ação é reversível: basta publicar de novo depois."
      },
      {
        "titulo": "Excluir um conteúdo",
        "descricao": "No menu de três pontinhos, escolha \"Excluir\" e confirme. A exclusão é lógica: o conteúdo sai da sua listagem e some do app, mas o registro e o histórico de progresso das usuárias (quem já marcou como concluído) permanecem guardados. Não existe uma lixeira no painel para restaurar por conta própria — se a ideia é apenas tirar do ar por um tempo, prefira \"Despublicar\"."
      }
    ],
    "campos": [
      {
        "nome": "Formato",
        "obrigatorio": true,
        "regra": "Três opções: Artigo, Vídeo ou Áudio. Já vem marcado como \"Artigo\". Escolha antes de tudo, porque muda o formulário inteiro: Artigo abre o editor de texto; Vídeo e Áudio abrem a área de envio de arquivo."
      },
      {
        "nome": "Título",
        "obrigatorio": true,
        "regra": "Único campo exigido até para salvar rascunho. No máximo 200 caracteres — acima disso aparece \"Máximo de 200 caracteres.\". Espaços no começo e no fim são removidos automaticamente, então um título só com espaços conta como vazio."
      },
      {
        "nome": "Descrição",
        "obrigatorio": false,
        "regra": "Texto curto que aparece nas listagens do app e no topo do leitor, logo abaixo do título. Não tem limite de tamanho na tela, mas foi pensado para uma ou duas frases. Não é usado pela busca da listagem do painel (que procura só no título)."
      },
      {
        "nome": "Duração estimada (min)",
        "obrigatorio": false,
        "regra": "Só aceita números, no máximo 3 dígitos. Se preenchida, precisa ser maior que zero e no máximo 600 minutos (10 horas) — acima disso aparece \"Máximo de 600 minutos (10h).\". Pode ficar em branco: nesse caso o app simplesmente não mostra o selo de tempo. Em artigos, o sistema calcula sozinho o tempo de leitura a partir do texto (cerca de 180 palavras por minuto) enquanto você não digitar nada no campo; assim que você digita, ele para de calcular e passa a respeitar o seu número. Para voltar ao valor calculado, clique no link \"Sugerir do texto (~X min)\" que aparece logo abaixo. Em vídeo e áudio o campo é sempre manual — informe a duração real da mídia. Para a usuária, artigos mostram \"X min de leitura\" e vídeo/áudio mostram \"X min\"."
      },
      {
        "nome": "Capa (opcional)",
        "obrigatorio": false,
        "regra": "Envio de arquivo de imagem ainda não está disponível. Cole o endereço (URL) de uma imagem já hospedada na internet, com link direto para .jpg, .png ou .webp. Quando o endereço começa com http:// ou https://, aparece uma pré-visualização logo abaixo do campo. Endereços muito longos (acima de 500 caracteres) podem ser recusados ao salvar."
      },
      {
        "nome": "Tags",
        "obrigatorio": false,
        "regra": "Clique nas tags para marcar e desmarcar (as marcadas ficam roxas com um ✓). Pode escolher quantas quiser, inclusive nenhuma — mas sem tag o conteúdo não entra em nenhum feed personalizado nem na navegação por tag do app. Se ainda não houver tags cadastradas, a área mostra um aviso: crie-as antes em Conteúdo › Tags."
      },
      {
        "nome": "Corpo do artigo",
        "obrigatorio": false,
        "regra": "Só existe no formato Artigo. Não é exigido para salvar rascunho, mas é obrigatório para publicar — sem texto aparece \"O corpo do artigo é obrigatório para publicar.\". Escrito em Markdown, com barra de ferramentas e pré-visualização. Aceita títulos, negrito, itálico, listas, citações, links e imagens (por endereço da web)."
      },
      {
        "nome": "Arquivo de vídeo / Arquivo de áudio",
        "obrigatorio": false,
        "regra": "Só existe nos formatos Vídeo e Áudio. Não é exigido para salvar rascunho, mas é obrigatório para publicar — sem arquivo aparece \"Envie a mídia para publicar.\". O seletor aceita apenas arquivos de vídeo (no formato Vídeo) ou de áudio (no formato Áudio), com até 500 MB; acima disso aparece \"Arquivo acima de 500 MB.\" e nada é anexado. Depois de escolhido, o nome do arquivo fica visível com a opção \"Substituir\"."
      }
    ],
    "relacoes": "As Tags, criadas em Conteúdo › Tags, são o motor que leva o conteúdo até a usuária certa: é por elas que ele entra no feed personalizado e na navegação por tag. Por isso, uma tag vinculada a algum conteúdo não pode ser removida — é preciso primeiro desmarcá-la em todos os conteúdos. As Fases usam esse mesmo vocabulário de tags, então a tag que você marca aqui é a mesma que conecta o conteúdo ao momento da jornada da usuária. As Trilhas são montadas a partir desta biblioteca: ao adicionar conteúdo a uma trilha, você escolhe itens daqui, e conteúdos em rascunho aparecem sinalizados como tal (a trilha avisa antes de publicar se ainda houver rascunho na curadoria). Em Métricas, os conteúdos alimentam o indicador \"Conteúdos publicados\" e o ranking dos mais consumidos. No app da usuária, cada conteúdo publicado aparece no feed, na busca e na navegação por tag, abre no leitor (texto formatado, player de vídeo ou player de áudio) e pode ser marcado como concluído — é esse registro que forma o histórico de progresso.",
    "atencao": [
      "Cuidado com \"Salvar rascunho\" em conteúdo que já está no ar: esse botão tira o conteúdo de circulação. Se você abriu um conteúdo publicado só para corrigir uma vírgula, use o botão \"Salvar e publicar\" — é ele que salva mantendo o conteúdo visível.",
      "Trocar o formato depois de escrever apaga o texto. Se você redigiu um artigo e depois mudou o formato para Vídeo ou Áudio, ao salvar o texto é descartado. Copie o conteúdo para outro lugar antes de trocar o formato, por segurança.",
      "Publicar pelo menu da listagem não confere se falta algo. As validações de texto do artigo e de arquivo de mídia acontecem só dentro do formulário. Ao publicar direto pela lista um item incompleto, o sistema pode recusar e mostrar apenas uma mensagem genérica de erro. Se isso acontecer, abra o conteúdo e publique de dentro dele — lá a mensagem indica exatamente o que falta.",
      "A exclusão não tem volta pelo painel. Ela é lógica (o registro e o histórico de progresso das usuárias continuam guardados), mas o item some da sua listagem e não há lixeira para restaurar. Para tirar algo do ar temporariamente, use \"Despublicar\", que é reversível a qualquer momento.",
      "Excluir um conteúdo que está dentro de uma trilha deixa um buraco: a trilha passa a mostrar o item como \"indisponível\", com um aviso de que ele não aparece mais para as usuárias. Confira as trilhas antes de excluir.",
      "Ao anexar vídeo ou áudio, o sistema registra por enquanto apenas o nome do arquivo — o envio do arquivo em si para a plataforma ainda não está disponível. Antes de publicar um vídeo ou áudio, alinhe com a equipe técnica como a mídia será hospedada, senão a usuária pode abrir o conteúdo e não conseguir reproduzir.",
      "A capa não aceita envio de imagem, só o endereço de uma imagem já publicada na internet. Se você colar um link que não seja direto para o arquivo de imagem, a pré-visualização não aparece — e é um bom sinal de que o link não vai funcionar no app.",
      "Conteúdo sem nenhuma tag fica invisível no feed personalizado e na navegação por tag. Ele existe e está publicado, mas praticamente ninguém chega até ele. Marque ao menos uma tag antes de publicar.",
      "Sair do formulário não avisa sobre alterações não salvas. Os botões \"Cancelar\" e \"Voltar para conteúdos\" descartam tudo que você digitou sem perguntar.",
      "Se der erro na hora de salvar, você continua na tela com tudo preenchido — nada do seu trabalho é perdido. Basta corrigir o que a mensagem indica e tentar de novo.",
      "A data da primeira publicação não se perde: despublicar e publicar novamente mantém o registro original de quando o conteúdo foi ao ar pela primeira vez.",
      "A busca da listagem procura só no título. Descrição e texto do artigo não entram na busca do painel — se você não lembra o título, use os filtros de formato e status para reduzir a lista."
    ]
  },
  {
    "slug": "trilhas",
    "titulo": "Trilhas",
    "resumo": "Trilhas são curadorias ordenadas de conteúdos da biblioteca — você escolhe quais conteúdos entram e em que sequência. No app, a usuária percorre a trilha no seu tempo, com o progresso dela sendo acompanhado.",
    "paraQueServe": "A área de Trilhas serve para dar um caminho a quem não sabe por onde começar: em vez de a usuária garimpar conteúdos soltos, ela encontra um roteiro pronto, montado por você, com começo, meio e fim sugeridos. Use quando vários conteúdos fizerem mais sentido juntos e numa certa ordem — por exemplo, uma introdução acolhedora ao tratamento ou um conjunto de práticas para o período de espera. A trilha só reúne e ordena conteúdos que já existem na biblioteca: ela não cria conteúdo novo. Trilhas publicadas ficam visíveis para todas as usuárias (não há segmentação por fase ou por tag nesta área).",
    "passos": [
      {
        "titulo": "Ver e encontrar trilhas",
        "descricao": "No menu lateral, em \"Conteúdo\", clique em \"Trilhas\". As trilhas aparecem como cartões em ordem alfabética por título, cada um com a capa, a etiqueta \"Publicada\" ou \"Rascunho\", a descrição e a quantidade de conteúdos. Para localizar uma trilha, use o campo \"Buscar por título\" (a busca considera só o título, não a descrição) e o filtro \"Todos os status\" para ver apenas publicadas ou apenas rascunhos. Clicar em qualquer cartão abre a trilha para edição."
      },
      {
        "titulo": "Criar uma trilha nova",
        "descricao": "Clique em \"Nova trilha\", no topo direito da listagem. Preencha o Título (obrigatório) e, se quiser, a Descrição e a Capa. Em seguida monte a curadoria de conteúdos. A trilha só passa a existir quando você clica em \"Salvar rascunho\" ou \"Publicar\" — sair antes disso descarta tudo."
      },
      {
        "titulo": "Adicionar conteúdos à trilha",
        "descricao": "No bloco \"Conteúdos da trilha\", clique em \"Adicionar conteúdo\". Abre uma janela com a biblioteca inteira, onde você pode buscar por título e filtrar por formato (Artigo, Vídeo ou Áudio). Marque quantos conteúdos quiser de uma vez e clique em \"Adicionar\". Eles entram no fim da lista, na ordem em que você os marcou. Conteúdos que já estão na trilha aparecem esmaecidos com a etiqueta \"Já na trilha\" e não podem ser marcados de novo."
      },
      {
        "titulo": "Ordenar os conteúdos",
        "descricao": "A ordem da lista é a sequência sugerida que a usuária vê no app — o número à esquerda de cada linha (1, 2, 3…) é a posição. Use as setinhas para cima e para baixo, à esquerda de cada conteúdo, para mover um item uma posição por vez. A seta de subir fica desativada no primeiro item e a de descer no último. Não há arrastar e soltar. A nova ordem só vale depois de salvar."
      },
      {
        "titulo": "Tirar um conteúdo da trilha",
        "descricao": "Clique no \"x\" à direita da linha do conteúdo. Ele sai apenas desta trilha — o conteúdo continua intacto na biblioteca e em outras trilhas. A numeração se reorganiza sozinha. Como toda alteração, só vale depois de salvar."
      },
      {
        "titulo": "Salvar como rascunho",
        "descricao": "Clique em \"Salvar rascunho\". A trilha fica guardada com tudo o que você montou, mas não aparece para nenhuma usuária. É o caminho para deixar uma curadoria pela metade e voltar depois. A mensagem de confirmação é \"Rascunho salvo\" (ou \"Alterações salvas\", quando você está editando)."
      },
      {
        "titulo": "Publicar a trilha",
        "descricao": "Clique em \"Publicar\" (em uma trilha já publicada o botão se chama \"Salvar e publicar\"). A partir daí ela aparece no app das usuárias, na aba Trilhas, no feed e no bloco \"Continue de onde parou\" da tela inicial de quem já começou. Se a trilha estiver sem nenhum conteúdo, ou se contiver conteúdos que ainda são rascunho, o sistema abre um aviso \"Publicar mesmo assim?\" antes de prosseguir — você pode voltar e ajustar ou confirmar com \"Publicar assim mesmo\"."
      },
      {
        "titulo": "Editar uma trilha existente",
        "descricao": "Clique no cartão da trilha na listagem (ou no link \"Editar\" dentro dele). Tudo é editável: título, descrição, capa, quais conteúdos entram e a ordem deles. Ao salvar, a lista de conteúdos é regravada inteira com o que estiver na tela naquele momento."
      },
      {
        "titulo": "Tirar uma trilha do ar",
        "descricao": "Abra a trilha e clique em \"Salvar rascunho\". Ela volta a ser rascunho e deixa de aparecer para as usuárias imediatamente, sem nenhuma tela de confirmação. Para colocá-la no ar de novo, basta abrir e clicar em \"Salvar e publicar\"."
      },
      {
        "titulo": "Desistir das alterações",
        "descricao": "Clique em \"Cancelar\" ou em \"Voltar para trilhas\". Você volta para a listagem e nada do que estava na tela é gravado. Não há pergunta de confirmação nem salvamento automático."
      }
    ],
    "campos": [
      {
        "nome": "Título",
        "obrigatorio": true,
        "regra": "Único campo obrigatório. No máximo 200 caracteres — o campo deixa você digitar mais, mas ao salvar aparece \"Máximo de 200 caracteres\" e nada é gravado até você encurtar. Espaços sobrando no começo e no fim são removidos automaticamente; um título só com espaços conta como vazio e gera o aviso \"Informe o título\". É o nome que a usuária vê no app e também é por ele que a listagem é ordenada e pesquisada."
      },
      {
        "nome": "Descrição",
        "obrigatorio": false,
        "regra": "Campo livre de várias linhas, sem limite de caracteres na tela. Pode ficar em branco — nesse caso o cartão da trilha simplesmente não mostra descrição. Espaços sobrando são removidos ao salvar. No cartão da listagem o texto é cortado em duas linhas, então as primeiras palavras são as que mais aparecem."
      },
      {
        "nome": "Capa (opcional)",
        "obrigatorio": false,
        "regra": "Aceita apenas o endereço (URL) de uma imagem já hospedada na internet — link direto para .jpg, .png ou .webp. Não existe upload de arquivo nesta versão, e o servidor recusa imagens coladas/embutidas. A pré-visualização só aparece quando o endereço começa com http:// ou https://. Se ficar em branco, a trilha usa uma capa padrão com o ícone de trilhas. Se o endereço for recusado pelo servidor, a mensagem de erro dele aparece na tela e nada é salvo."
      },
      {
        "nome": "Conteúdos da trilha (curadoria)",
        "obrigatorio": false,
        "regra": "Lista ordenada de conteúdos vindos da biblioteca. Pode ficar vazia para salvar rascunho; para publicar vazia o sistema pede confirmação. O mesmo conteúdo não pode entrar duas vezes na mesma trilha. Novos itens sempre entram no fim da lista. A ordem definida aqui é a sequência sugerida no app. Ao salvar, essa lista substitui por completo a que estava gravada antes."
      },
      {
        "nome": "Status (Publicada / Rascunho)",
        "obrigatorio": true,
        "regra": "Não é um campo para marcar: é definido pelo botão que você usa. \"Salvar rascunho\" deixa a trilha invisível para as usuárias; \"Publicar\" / \"Salvar e publicar\" coloca no ar. Toda trilha nova começa como rascunho até você publicar. A data da primeira publicação fica registrada e não muda se você despublicar e publicar de novo."
      }
    ],
    "relacoes": "Trilhas dependem inteiramente da área de Conteúdos: só é possível adicionar conteúdos que já existem na biblioteca, e cada linha da curadoria mostra o formato (Artigo, Vídeo ou Áudio) e a duração cadastrados lá. Se você editar o título, a capa ou a duração de um conteúdo, a mudança aparece automaticamente em todas as trilhas que o usam. Trilhas não têm tags nem fase próprias: a segmentação por tags e fases acontece no conteúdo e no onboarding, não aqui — uma trilha publicada fica disponível para todas as usuárias. No app da usuária, as trilhas publicadas aparecem na aba Trilhas, na aba Trilhas do feed e na tela inicial, no bloco \"Continue de onde parou\", com a barra de progresso de cada uma. Em Métricas, você acompanha o total de \"Trilhas criadas\" e o ranking de \"Trilhas mais percorridas\". A área de Trilhas só existe para o perfil de administração geral — profissionais não a enxergam no menu.",
    "atencao": [
      "Não existe excluir trilha. Nenhuma tela oferece exclusão de trilha — a única forma de tirar uma trilha do ar é despublicá-la (abrir e clicar em \"Salvar rascunho\"). Ela continua na listagem, marcada como rascunho.",
      "Despublicar é instantâneo e sem confirmação. O botão \"Salvar rascunho\" em uma trilha publicada a tira do ar na hora, sem perguntar nada. Cuidado ao usá-lo achando que está apenas \"salvando\" — para guardar alterações mantendo a trilha no ar, use \"Salvar e publicar\".",
      "Conteúdo em rascunho dentro da trilha some para a usuária. Um conteúdo não publicado aparece na sua lista com a etiqueta \"Rascunho\", mas não é exibido no app — a trilha chega incompleta e com menos itens do que você vê aqui. O sistema avisa antes de publicar, mas não impede.",
      "Excluir um conteúdo na área de Conteúdos não o remove das trilhas. A exclusão de conteúdo é lógica: o item vira rascunho e continua na curadoria, deixando de aparecer para as usuárias. Depois de excluir um conteúdo, vale revisar as trilhas que o usavam.",
      "\"Conteúdo indisponível\" em vermelho. Se um item da curadoria não for encontrado na biblioteca, ele aparece como uma linha vermelha \"Conteúdo indisponível\", ocupando a posição mas sem aparecer para as usuárias. Quando o sistema tem certeza de que ele sumiu mesmo, oferece o atalho \"Remover indisponíveis\". Se o aviso disser que a biblioteca não carregou, não remova nada: recarregue a página primeiro, porque pode ser falha momentânea.",
      "Nada é salvo automaticamente. Fechar a aba, clicar em \"Cancelar\" ou em \"Voltar para trilhas\" descarta título, descrição, capa e toda a ordenação sem aviso. Salve antes de sair.",
      "Se o salvamento falhar, você permanece na tela. Uma mensagem vermelha explica o problema e tudo o que você montou continua ali — não refaça o trabalho, apenas corrija e tente salvar de novo.",
      "A ordem é o produto. Reordenar é uma edição como outra qualquer: só entra no ar depois de salvar. E, ao salvar, a lista de conteúdos da trilha é regravada inteira conforme o que está na tela — se alguém alterou a mesma trilha em outra aba ou máquina, o que você salvar prevalece.",
      "A capa não pode ser enviada do computador. Só endereço de imagem já publicada na internet. Colar um link de página (em vez do link direto da imagem) resulta em capa quebrada ou recusada pelo servidor."
    ]
  },
  {
    "slug": "onboarding",
    "titulo": "Onboarding",
    "resumo": "O Onboarding é o questionário de boas-vindas que a nova usuária responde logo depois de entrar no app pela primeira vez. Pelas respostas, o sistema descobre sozinho em que fase da jornada ela está.",
    "paraQueServe": "Toda usuária nova precisa de uma fase para que o feed, as trilhas e os conteúdos façam sentido para o momento dela. Em vez de perguntar isso de forma direta e fria, o Onboarding faz algumas perguntas acolhedoras e deduz a fase a partir das respostas. Aqui você cadastra essas perguntas, as opções de resposta e quanto cada resposta \"puxa\" para cada fase. Use esta área sempre que a jornada mudar (uma fase nova, uma pergunta que não faz mais sentido, um texto que precisa ficar mais gentil) — e sempre passe pelo Simulador antes de deixar tudo no ar.",
    "passos": [
      {
        "titulo": "Criar uma pergunta",
        "descricao": "Em Conteúdo › Onboarding, clique em \"Nova pergunta\". Escreva o texto da pergunta e confirme a ordem sugerida (o sistema já preenche com o próximo número livre). Clique em \"Criar pergunta\". Ela nasce sempre INATIVA — isso é de propósito: uma pergunta sem opções não teria como ser respondida. Você a liga depois, no passo 4."
      },
      {
        "titulo": "Adicionar as opções de resposta",
        "descricao": "No card da pergunta, clique no link \"N opções · gerenciar\". Na tela que abre, use \"Adicionar opção\", escreva o texto da resposta e confirme a ordem. Repita para cada resposta possível. São necessárias no mínimo 2 opções para que a pergunta possa ir ao ar. Cada opção nasce sem mapeamento — ainda não vale pontos para nenhuma fase."
      },
      {
        "titulo": "Mapear os pontos de cada opção",
        "descricao": "Ainda na tela de opções, clique em \"Mapeamento\" ao lado de uma opção. Aparece a lista de todas as fases cadastradas, cada uma com um controle deslizante de 0 a 10. Puxe o controle da fase (ou fases) que aquela resposta indica. Exemplo: \"Aguardando o resultado do beta\" pode dar 10 para a fase de espera e 0 para as demais. Clique em \"Salvar mapeamento\". Faça isso para TODAS as opções — nenhuma pode ficar zerada."
      },
      {
        "titulo": "Ativar a pergunta",
        "descricao": "Volte para a lista e clique em \"Ativar\" no card da pergunta. Se ela tiver pelo menos 2 opções e todas estiverem mapeadas, ela entra no ar na hora e passa a aparecer para as próximas usuárias. Se faltar alguma coisa, o sistema recusa e explica o que falta — nada é salvo pela metade."
      },
      {
        "titulo": "Conferir no Simulador antes de confiar",
        "descricao": "No topo da tela, clique em \"Simular\". Escolha uma resposta para cada pergunta ativa, como se você fosse a usuária, e veja qual fase sairia — com a pontuação de cada fase em barrinhas. Abaixo, o sistema ainda testa sozinho TODAS as combinações possíveis de respostas e avisa se alguma fase nunca é alcançada, se alguma combinação dá empate, ou se alguma combinação não chega a fase nenhuma. Quando estiver tudo certo, aparece a mensagem verde \"Mapeamento saudável\"."
      },
      {
        "titulo": "Mudar a ordem das perguntas e das opções",
        "descricao": "Use as setinhas para cima e para baixo à esquerda de cada card (na lista de perguntas) ou de cada opção (na tela de opções). A mudança é salva na hora, sem botão de confirmar, e os números são renumerados sozinhos. Essa é a ordem em que a usuária vê as perguntas — a primeira pergunta é a primeira tela que ela encontra."
      },
      {
        "titulo": "Editar textos",
        "descricao": "Clique em \"Editar\" no card da pergunta para mudar o texto, a ordem ou a situação. Na tela de opções, use o ícone de lápis para mudar o texto de uma opção. Editar o texto NÃO mexe no mapeamento de pontos — os pesos continuam os mesmos."
      },
      {
        "titulo": "Desativar uma pergunta",
        "descricao": "Clique em \"Desativar\" no card e confirme. A pergunta sai do questionário das próximas usuárias, mas continua cadastrada aqui (com opções e mapeamentos intactos) e pode ser religada depois. Quem já respondeu o onboarding não é afetada: a fase dela continua a mesma."
      },
      {
        "titulo": "Excluir uma pergunta ou uma opção",
        "descricao": "Use o ícone de lixeira e confirme na janela vermelha. Excluir uma pergunta apaga também todas as opções dela. Excluir uma opção apaga junto o mapeamento de fases dela. Nos dois casos é definitivo, sem desfazer. Se a pergunta ou a opção já tiver sido respondida por alguma usuária, o sistema bloqueia a exclusão — nesse caso, desative em vez de excluir."
      },
      {
        "titulo": "Encontrar uma pergunta na lista",
        "descricao": "Use o campo \"Buscar pergunta\" (procura pelo texto da pergunta) e o filtro ao lado, que mostra Todas, só Ativas ou só Inativas. Acima da lista fica o resumo \"X perguntas · Y ativas\"."
      }
    ],
    "campos": [
      {
        "nome": "Texto da pergunta",
        "obrigatorio": true,
        "regra": "Campo de texto longo, no máximo 500 caracteres. Não pode ficar em branco (espaços não contam). É exatamente o que a usuária lê na tela, então escreva em tom de conversa — ex.: \"Em que momento do tratamento você está?\"."
      },
      {
        "nome": "Ordem da pergunta",
        "obrigatorio": true,
        "regra": "Número inteiro maior que zero. Já vem preenchido com o próximo número livre quando você cria uma pergunta. Define a sequência em que a usuária responde. Prefira mudar a ordem pelas setinhas da lista — digitar um número já usado por outra pergunta faz o salvamento falhar."
      },
      {
        "nome": "Situação da pergunta (Ativa / Inativa)",
        "obrigatorio": true,
        "regra": "Só aparece ao EDITAR uma pergunta; na criação não existe, porque toda pergunta nova nasce Inativa. Só \"Ativa\" faz a pergunta aparecer para as usuárias. Marcar Ativa aqui sem cumprir os requisitos (2 opções + todas mapeadas) não funciona: o sistema avisa e salva como Inativa."
      },
      {
        "nome": "Texto da opção",
        "obrigatorio": true,
        "regra": "Campo de texto curto, no máximo 200 caracteres. Não pode ficar em branco. É o texto do botão que a usuária escolhe — ex.: \"Fazendo estimulação ovariana\"."
      },
      {
        "nome": "Ordem da opção",
        "obrigatorio": true,
        "regra": "Número inteiro maior que zero. Já vem preenchido com o próximo número livre. Define em que sequência as respostas aparecem na tela da usuária. Também aqui, prefira as setinhas a digitar o número."
      },
      {
        "nome": "Peso por fase (janela de Mapeamento)",
        "obrigatorio": false,
        "regra": "Um controle deslizante de 0 a 10 para CADA fase cadastrada, começando em 0. Tecnicamente você pode salvar tudo em 0, mas a pergunta não poderá ser ativada enquanto houver alguma opção assim. Só os pesos acima de 0 ficam guardados — as fases em 0 simplesmente não contam. O botão \"Zerar\" limpa todos os controles de uma vez (e só vale depois que você clicar em Salvar)."
      }
    ],
    "relacoes": "O Onboarding depende inteiramente das FASES (Conteúdo › Fases): os pontos que você distribui no mapeamento são dados a fases já cadastradas. Se não houver nenhuma fase, a janela de mapeamento avisa e não deixa mapear — cadastre as fases antes. A conta de pontos considera apenas fases ATIVAS: uma fase desativada é ignorada, mesmo que as opções deem pontos a ela (o Simulador mostra quantas fases estão fora da conta). Cada fase, por sua vez, carrega as TAGS que orientam o feed e as trilhas da usuária — ou seja, a fase que sai do Onboarding é o que decide quais conteúdos ela vê no primeiro acesso. Depois do questionário, a usuária ainda pode ajustar manualmente em \"Minha fase\" dentro do app. Quem já tem fase definida nunca mais passa pelo Onboarding; e se não houver nenhuma pergunta cadastrada, a usuária vai direto para o feed sem questionário.",
    "atencao": [
      "Nenhuma pergunta ativa = onboarding DESLIGADO. Se todas as perguntas estiverem inativas, a lista mostra um aviso em destaque: as novas usuárias não respondem nada e não recebem fase inicial. Não é um estado neutro — é o questionário fora do ar.",
      "Não dá para ativar uma pergunta pela metade. O sistema bloqueia a ativação em dois casos: menos de 2 opções de resposta, ou alguma opção sem mapeamento. Isso vale tanto pelo botão \"Ativar\" quanto pela janela de edição — tentar marcar \"Ativa\" ali salva como Inativa e mostra o motivo.",
      "Opção sem pontos quebra o onboarding de verdade. Se uma usuária escolher um caminho de respostas em que nenhuma fase pontua, o envio dela FALHA (o sistema não consegue determinar a fase — ela não \"cai na primeira fase\"). O Simulador sinaliza isso em vermelho, com um exemplo da combinação problemática. Trate esse aviso como urgente.",
      "Empate sempre cai na fase de menor ordem. Quando duas fases somam a mesma pontuação, vence a que estiver mais acima na lista de Fases. O Simulador avisa quando existe combinação que empata — se o desempate não for o que você quer, ajuste os pesos.",
      "Exclusão é definitiva e sem desfazer. Excluir uma pergunta leva junto todas as opções; excluir uma opção leva junto o mapeamento dela. Não existe lixeira nem restauração.",
      "Item já respondido não pode ser excluído. Se alguma usuária já respondeu aquela pergunta ou escolheu aquela opção, o sistema recusa a exclusão e explica o motivo — é a proteção do histórico. A saída é desativar a pergunta.",
      "Desativar é seguro; excluir não. Desativar tira a pergunta do ar preservando tudo (texto, opções, pesos) e não muda a fase de ninguém que já respondeu. Na dúvida, desative.",
      "Mudanças valem só para as próximas. Ao salvar um mapeamento, o sistema avisa: \"Vale para as próximas usuárias.\" Quem já concluiu o onboarding mantém a fase que recebeu — nada é recalculado para trás.",
      "Reordene com o filtro em \"Todas\". As setinhas movem a pergunta em relação à lista completa, não à lista filtrada. Com um filtro de Ativas/Inativas ligado, ou com uma busca digitada, o item pode acabar numa posição que você não está vendo.",
      "Fase inativa some da conta. Se você desativar uma fase em Conteúdo › Fases, todos os pontos que as opções dão a ela deixam de valer. Se TODAS as fases estiverem inativas, nenhuma usuária recebe fase — o Simulador alerta sobre isso em vermelho.",
      "Fase inalcançável é um sinal de mapeamento torto. Se o Simulador apontar que uma fase nunca é atingida por nenhuma combinação de respostas, é sinal de que os pesos precisam ser revistos: aquela fase nunca será atribuída a ninguém pelo questionário.",
      "Análise completa tem limite. Se o número de combinações de respostas passar de 20 mil, o Simulador informa que são combinações demais e omite a análise automática. A simulação manual (escolher respostas e ver o resultado) continua funcionando normalmente.",
      "As setinhas salvam na hora. Reordenar não tem botão de confirmar nem de cancelar — cada clique já grava."
    ]
  },
  {
    "slug": "profissionais",
    "titulo": "Profissionais",
    "resumo": "É onde você cadastra e gerencia as psicólogas que atendem na plataforma. Cada cadastro dispara um convite por e-mail para que a profissional crie a própria senha e passe a ter acesso.",
    "paraQueServe": "Esta área é a porta de entrada das psicólogas na Entre Ser. Quando uma nova profissional passa a fazer parte da equipe clínica, é aqui que você registra os dados dela (nome, e-mail, telefone, CRP e abordagem) e envia o convite de primeiro acesso. Use também para manter os dados atualizados, acompanhar quem já aceitou o convite e quem ainda está pendente, reenviar convites que expiraram e desativar o acesso de quem deixou de atender. Importante: você cadastra e libera o acesso, mas nunca define a senha da profissional — quem faz isso é ela mesma, pelo link do convite.",
    "passos": [
      {
        "titulo": "Encontrar uma profissional na lista",
        "descricao": "Abra Profissionais no menu lateral (grupo Pessoas). A lista mostra foto, nome, abordagem, e-mail, telefone, CRP e as etiquetas de situação. Use o campo de busca para procurar por nome, e-mail ou CRP (a busca NÃO encontra por telefone nem por abordagem). Há ainda dois filtros: 'Todos os status' (Ativa / Inativa) e 'Todos os convites' (Acesso ativo / Convite pendente / Convite expirado). A lista mostra 8 profissionais por página; quando houver mais, a paginação aparece no canto inferior direito. O contador acima da tabela mostra quantas foram encontradas e indica '(filtrado)' quando algum filtro está aplicado. Se nada corresponder, aparece um aviso com o botão 'Limpar filtros'. Clicar em qualquer linha abre a ficha completa."
      },
      {
        "titulo": "Cadastrar uma nova profissional e enviar o convite",
        "descricao": "Clique em 'Adicionar profissional' (canto superior direito). Preencha os cinco campos — todos obrigatórios: Nome completo, E-mail, Telefone, CRP e Abordagem. O telefone é formatado automaticamente enquanto você digita, no formato (11) 98765-4321. Clique em 'Salvar e enviar convite'. O sistema cria o cadastro, envia o e-mail de convite (válido por 7 dias) e leva você direto para a ficha da profissional, com a mensagem 'Profissional cadastrada — convite enviado por e-mail.'. Ela nasce como Ativa e com Convite pendente. Se algum campo estiver errado ou repetido, a janela permanece aberta com o aviso no campo correspondente."
      },
      {
        "titulo": "Ver a ficha completa de uma profissional",
        "descricao": "Clique na linha da profissional (ou escolha 'Ver detalhe' no menu de três pontinhos ao final da linha). A ficha mostra as etiquetas de situação, os dados de contato e identidade profissional, o texto da bio pública (somente leitura) e um bloco 'Convite & auditoria' com a data em que o convite expira (ou expirou), a data de cadastro e quem cadastrou. Os botões de ação ficam no topo: Reenviar convite (só quando há convite pendente ou expirado), Editar e Desativar (ou Reativar, se ela estiver inativa)."
      },
      {
        "titulo": "Editar os dados de uma profissional",
        "descricao": "Na ficha, clique em 'Editar' — ou use 'Editar' no menu de três pontinhos da lista. O formulário abre já preenchido e permite alterar Nome, E-mail, Telefone, CRP e Abordagem. Clique em 'Salvar alterações': aparece a mensagem 'Dados atualizados com sucesso.' e você volta para a ficha. Se acontecer alguma falha ao salvar, você permanece na tela de edição com tudo o que digitou preservado. O botão 'Cancelar' descarta as alterações e volta para a ficha. Atenção: bio e foto não aparecem neste formulário — elas são de responsabilidade da própria profissional."
      },
      {
        "titulo": "Reenviar o convite de primeiro acesso",
        "descricao": "Se a profissional não acessou dentro dos 7 dias, ou perdeu o e-mail, use 'Reenviar convite' — disponível no topo da ficha e no menu de três pontinhos da lista. Essa opção só aparece quando a situação é 'Convite pendente' ou 'Convite expirado'. Ao clicar, um novo convite é enviado, a situação volta para 'Convite pendente' e a contagem recomeça do zero (mais 7 dias). Aparece a mensagem 'Convite reenviado para [nome].'. Não há confirmação — a ação acontece na hora."
      },
      {
        "titulo": "Desativar o acesso de uma profissional",
        "descricao": "Use 'Desativar' no topo da ficha ou no menu de três pontinhos da lista. Abre uma janela de confirmação mostrando nome, e-mail e CRP, explicando o efeito: ela deixa de aparecer na listagem e no perfil público e não consegue mais fazer login. Clique em 'Confirmar desativação'. O cadastro NÃO é apagado — continua consultável no backoffice com a etiqueta 'Inativa' e pode ser reativado a qualquer momento."
      },
      {
        "titulo": "Reativar uma profissional",
        "descricao": "Filtre a lista por status 'Inativa' (ou busque pelo nome) e escolha 'Reativar' no menu de três pontinhos — ou abra a ficha e clique em 'Reativar' no topo. A ação é imediata, sem janela de confirmação, e aparece a mensagem '[nome] foi reativada.'. Ela volta a aparecer no perfil público e a conseguir entrar. A situação do convite dela permanece como estava antes da desativação."
      }
    ],
    "campos": [
      {
        "nome": "Nome completo",
        "obrigatorio": true,
        "regra": "De 2 a 100 caracteres. Aceita apenas letras (com acentos), espaços, hífen e apóstrofo. Não aceita números, pontos nem outros símbolos — por isso 'Dra. Maria Silva' é recusado (o ponto trava); escreva 'Maria Silva'. Espaços em branco no começo e no fim são descartados automaticamente."
      },
      {
        "nome": "E-mail",
        "obrigatorio": true,
        "regra": "Precisa ter formato de e-mail válido e ser único: se já existir outra profissional com o mesmo e-mail (maiúsculas e minúsculas não fazem diferença), o cadastro é barrado com 'Este e-mail já está cadastrado.'. É para este endereço que o convite de primeiro acesso é enviado e é ele que a profissional usa para entrar — alterar o e-mail muda o login dela."
      },
      {
        "nome": "Telefone",
        "obrigatorio": true,
        "regra": "DDD + 8 dígitos (fixo) ou DDD + 9 dígitos (celular), ou seja, 10 ou 11 números no total. O campo formata sozinho enquanto você digita — (11) 98765-4321 ou (11) 3456-7890 — e não deixa passar de 11 números. Números a menos geram o aviso 'Telefone inválido — use DDD + 8 ou 9 dígitos.'."
      },
      {
        "nome": "CRP",
        "obrigatorio": true,
        "regra": "Formato obrigatório NN/NNNNNN: exatamente 2 números, uma barra, e de 4 a 6 números. Exemplo: 06/12345. Escrever '6/45231' (sem o zero à esquerda) é recusado. Também precisa ser único — se outra profissional já tiver aquele CRP, aparece 'Este CRP já está cadastrado.'."
      },
      {
        "nome": "Abordagem",
        "obrigatorio": true,
        "regra": "Texto livre, de 1 a 100 caracteres. É a linha de atuação da psicóloga (ex.: TCC, ACT, MBSR, Psicanálise). Aparece logo abaixo do nome na lista e na ficha. Não é uma lista fechada: você digita o que quiser, então vale combinar uma escrita padrão com a equipe para não misturar 'TCC' com 'Terapia Cognitivo-Comportamental'."
      },
      {
        "nome": "Bio pública e foto",
        "obrigatorio": false,
        "regra": "Somente leitura no backoffice — não existe campo para você editar. A própria profissional preenche esses dados na área 'Meu perfil' dela. Enquanto ela não escreve nada, a ficha mostra 'A profissional ainda não preencheu a bio pública.'."
      },
      {
        "nome": "Situação (Ativa / Inativa)",
        "obrigatorio": false,
        "regra": "Não é digitado: começa sempre como 'Ativa' no cadastro e muda apenas pelos botões Desativar / Reativar."
      },
      {
        "nome": "Situação do convite",
        "obrigatorio": false,
        "regra": "Não é digitado, o sistema calcula sozinho. 'Convite pendente' enquanto ela ainda não fez o primeiro acesso e o prazo não venceu; 'Convite expirado' quando os 7 dias passam sem o primeiro acesso; 'Acesso ativo' assim que ela cria a própria senha (a partir daí a data de expiração some da ficha)."
      },
      {
        "nome": "Cadastrada em / Cadastrada por",
        "obrigatorio": false,
        "regra": "Preenchidos automaticamente e mostrados no bloco 'Convite & auditoria' da ficha. O campo 'Cadastrada por' pode aparecer como um travessão (—), porque nem sempre fica registrado quem fez o cadastro."
      }
    ],
    "relacoes": "Profissionais fica no grupo 'Pessoas' do menu, ao lado de Equipe (quem trabalha no backoffice) e Usuárias — são cadastros diferentes e independentes: uma psicóloga cadastrada aqui não vira administradora de conteúdo, e vice-versa. O reflexo do que você faz aqui aparece em dois lugares. Primeiro, no acesso: ao ser cadastrada, a profissional recebe o convite, define a própria senha e passa a entrar na plataforma, onde enxerga apenas a área 'Meu perfil' — nada de conteúdos, trilhas ou dados de outras pessoas. Segundo, no app das usuárias: os dados que ela mesma preenche no perfil (foto e bio) compõem o perfil público visível para elas; ao desativar a profissional, ela some desse perfil público. Não existe, nesta área, nenhum vínculo com Tags, Fases, Conteúdos ou Trilhas — profissionais não são associadas a materiais do app.",
    "atencao": [
      "Não existe excluir. Em nenhuma tela há a opção de apagar uma profissional — o mais próximo disso é 'Desativar'. O cadastro fica guardado para sempre, marcado como 'Inativa', e pode ser reativado quando quiser.",
      "Desativar tira o acesso na hora. A profissional deixa de conseguir fazer login e some do perfil público visto pelas usuárias. É uma ação de confirmação em vermelho justamente por isso — mas dá para desfazer com 'Reativar'.",
      "O e-mail é o login dela. Se você mudar o e-mail na edição, você está mudando o endereço com que ela entra na plataforma. Só faça isso com a profissional avisada, senão ela fica sem conseguir acessar.",
      "E-mail e CRP não podem se repetir. Se você tentar cadastrar alguém com um e-mail ou CRP que já existe, o sistema barra e mostra o aviso no campo. Vale conferir antes, inclusive entre as profissionais inativas — elas continuam ocupando o e-mail e o CRP.",
      "O convite vale 7 dias. Passado esse prazo sem o primeiro acesso, a etiqueta vira 'Convite expirado' e o link antigo não funciona mais. A solução é 'Reenviar convite', que gera um novo e reinicia a contagem de 7 dias.",
      "Você nunca define a senha. O sistema não tem campo de senha no cadastro — quem cria a senha é a profissional, pelo link do e-mail. Se ela disser que não recebeu, reenvie o convite e peça para conferir a caixa de spam.",
      "Reenviar convite não é reversível nem silencioso: um novo e-mail é disparado imediatamente, sem janela de confirmação, e a situação volta para 'Convite pendente' mesmo que estivesse expirada.",
      "'Reenviar convite' só aparece para quem ainda não fez o primeiro acesso. Quem já está com 'Acesso ativo' não tem essa opção — se ela esqueceu a senha, o caminho é a recuperação de senha na tela de login, não esta área.",
      "Bio e foto não são editáveis por você. Se a bio pública estiver desatualizada ou vazia, o único caminho é pedir para a própria profissional ajustar no perfil dela.",
      "A busca cobre só nome, e-mail e CRP. Procurar por telefone ou por abordagem não traz resultado — para achar por abordagem, use a busca por nome ou percorra as páginas.",
      "O nome não aceita ponto nem número. Títulos como 'Dra.' fazem o campo recusar o cadastro; escreva apenas o nome.",
      "Se algo falhar ao salvar uma edição, você continua na tela com tudo que digitou preservado — nada é perdido. Basta corrigir e tentar de novo.",
      "Ligar/desligar o acesso e a situação do convite são coisas separadas. Desativar alguém com convite pendente não cancela o convite: a etiqueta continua lá e reaparece do jeito que estava caso você reative a profissional."
    ]
  },
  {
    "slug": "equipe",
    "titulo": "Equipe",
    "resumo": "A Equipe é a lista das pessoas da Entre Ser que têm acesso ao painel administrativo, e é aqui que você cadastra alguém novo no time. Quem é cadastrado nesta área entra como Admin Geral e passa a enxergar e alterar tudo dentro do painel.",
    "paraQueServe": "Esta área existe para você saber, de um relance, quem hoje consegue entrar no painel — e para dar acesso a uma pessoa nova do time interno. Use quando alguém entrar na equipe e precisar cadastrar conteúdos, trilhas, tags ou acompanhar as métricas. Também serve como conferência: se a pessoa não aparece nesta lista, ela não tem acesso ao painel. Não confunda com a área Profissionais: lá ficam as psicólogas que aparecem para as usuárias dentro do aplicativo; aqui ficam apenas as pessoas que trabalham por dentro da plataforma.",
    "passos": [
      {
        "titulo": "Ver quem tem acesso hoje",
        "descricao": "Abra Equipe no menu lateral, dentro do grupo Pessoas. A tela mostra a contagem no topo (\"3 membros\") e uma tabela com quatro informações de cada pessoa: Membro (foto com as iniciais e o nome), E-mail, Situação e Entrada (a data em que a pessoa foi cadastrada, no formato dia/mês/ano). Ao lado do seu próprio nome aparece a marcação discreta \"· você\", para você se localizar na lista. Não há busca, filtro nem páginas: a lista traz todo mundo de uma vez, na ordem em que o sistema devolve."
      },
      {
        "titulo": "Adicionar um membro novo",
        "descricao": "Clique em \"Adicionar membro\", no canto superior direito (se a lista ainda estiver vazia, o mesmo botão aparece no meio da tela). Abre uma janela com dois campos: Nome completo e E-mail. Preencha os dois e clique em \"Adicionar membro\". Enquanto o cadastro está sendo salvo, o botão fica carregando e a janela não pode ser fechada."
      },
      {
        "titulo": "Entender o que acontece ao salvar",
        "descricao": "O sistema cria a conta, gera automaticamente uma senha temporária e envia essa senha por e-mail para a pessoa. A senha nunca aparece na tela para você — nem na hora, nem depois. Aparece um aviso verde confirmando: \"Membro adicionado. Enviamos a senha temporária para (e-mail)\". A janela fecha e a lista é recarregada já com a pessoa nova, marcada como Ativa."
      },
      {
        "titulo": "Orientar o primeiro acesso da pessoa",
        "descricao": "Quem foi cadastrado entra em entreser pelo endereço do painel usando o e-mail cadastrado e a senha temporária que recebeu. No primeiro login o sistema não deixa passar direto: leva para a tela \"Definir senha\", onde a pessoa cria a própria senha (no mínimo 8 caracteres, com pelo menos uma letra maiúscula, uma minúscula e um número) e repete para confirmar. Só depois disso ela entra no painel. Se a pessoa esquecer a senha depois, existe o link \"Esqueci minha senha\" na tela de acesso — não é preciso fazer nada por esta área."
      },
      {
        "titulo": "Resolver o aviso de e-mail já cadastrado",
        "descricao": "Se o e-mail digitado já pertence a alguém na plataforma — outro membro da equipe, uma profissional ou uma usuária do aplicativo —, o cadastro é recusado e aparece um aviso vermelho. A janela continua aberta com o que você digitou, então basta corrigir o e-mail e tentar de novo. Quando o e-mail repetido já está na própria lista de equipe, o aviso aparece na hora, embaixo do campo, antes mesmo de salvar."
      },
      {
        "titulo": "Se a lista não carregar",
        "descricao": "Caso apareça \"Não foi possível carregar a equipe. Tente novamente.\", é uma falha de conexão com o sistema — nada foi perdido nem apagado. Clique em \"Tentar novamente\" para recarregar. Se persistir, avise a equipe técnica."
      }
    ],
    "campos": [
      {
        "nome": "Nome completo",
        "obrigatorio": true,
        "regra": "Precisa ter no mínimo 2 letras e no máximo 100 caracteres. Só aceita letras (com acentos), espaços, hífen e apóstrofo — números e outros símbolos são recusados com o aviso \"Use apenas letras, espaços, hífen e apóstrofo\". Espaços sobrando no começo e no fim são removidos automaticamente. Comece vazio; não há sugestão preenchida."
      },
      {
        "nome": "E-mail",
        "obrigatorio": true,
        "regra": "Precisa ser um endereço de e-mail válido. É gravado sempre em letras minúsculas, mesmo que você digite com maiúsculas. Não pode repetir um e-mail já usado por qualquer pessoa da plataforma (equipe, profissional ou usuária) — nesse caso o cadastro é barrado. É por esse e-mail que a senha temporária é enviada e é ele que a pessoa usará para entrar no painel."
      },
      {
        "nome": "Situação (Ativa / Inativa)",
        "obrigatorio": false,
        "regra": "Não é um campo de preenchimento: é uma informação que o sistema mostra na tabela. Todo membro novo entra como Ativa. A etiqueta é apenas informativa — não existe botão no painel para ativar ou desativar o acesso de alguém."
      },
      {
        "nome": "Entrada",
        "obrigatorio": false,
        "regra": "Não é preenchido por você: é a data em que a pessoa foi cadastrada, registrada automaticamente pelo sistema e exibida no formato dia/mês/ano."
      }
    ],
    "relacoes": "A Equipe fica no grupo Pessoas do menu, ao lado de Profissionais e Usuárias — e é importante não misturar os três. Profissionais são as psicólogas com perfil público, que as usuárias veem dentro do aplicativo; Usuárias são as mulheres e casais que usam o app; a Equipe é só o time interno, e ninguém desta lista aparece em qualquer tela do aplicativo da usuária. O ponto de conexão entre as três áreas é o e-mail: ele é único em toda a plataforma, então um endereço já usado por uma profissional ou por uma usuária não pode ser reaproveitado aqui. Quem entra na Equipe passa a ter acesso a todas as demais áreas do painel — Tags, Fases, Conteúdos, Trilhas, Onboarding, Métricas, Profissionais e Usuárias —, ou seja, cadastrar alguém aqui é o que habilita essa pessoa a publicar conteúdo que chega às usuárias.",
    "atencao": [
      "Não há como editar, desativar nem excluir um membro pelo painel. Depois de salvar, o cadastro não tem volta por aqui: confira o nome e principalmente o e-mail antes de clicar em \"Adicionar membro\". Qualquer correção precisa passar pela equipe técnica.",
      "A senha temporária nunca é exibida na tela — ela vai apenas por e-mail. Se o endereço estiver errado, a pessoa não recebe nada e você não consegue reenviar nem corrigir pelo painel.",
      "Todo membro cadastrado entra como Admin Geral, com acesso total: pode criar, editar e excluir conteúdos, trilhas, tags, fases, o onboarding, profissionais, e pode cadastrar outras pessoas na equipe. Não existe um papel mais restrito para escolher. Cadastre só quem realmente precisa desse nível de acesso.",
      "O aviso de e-mail repetido considera a plataforma inteira, não só a equipe. Se o endereço já pertence a uma profissional ou a uma usuária do aplicativo, o cadastro é recusado — nesse caso, use outro endereço para a conta de trabalho da pessoa.",
      "A coluna Situação é apenas informativa. Ver \"Ativa\" não significa que você pode desligar o acesso por ali: não existe esse botão no painel.",
      "Enquanto a pessoa não trocar a senha temporária, ela não consegue entrar no painel — o sistema a leva direto para a tela de definir senha e só libera depois de a nova senha ser criada.",
      "Fechar a janela de cadastro (botão Cancelar, tecla Esc ou clique fora dela) descarta tudo o que foi digitado, sem aviso. Durante o salvamento a janela fica travada e não fecha.",
      "A lista não tem busca, filtro nem ordenação. Em times grandes, use a busca do próprio navegador para encontrar alguém pelo nome ou e-mail."
    ]
  },
  {
    "slug": "usuarias",
    "titulo": "Usuárias",
    "resumo": "Lista de consulta das mulheres cadastradas no aplicativo, com busca, filtros por situação e por plano. É uma área somente-leitura: dá para olhar, não para alterar.",
    "paraQueServe": "Serve para você conferir quem está cadastrado na plataforma e em que situação cada pessoa se encontra: se confirmou o e-mail, se está ativa, qual plano tem e em que fase do ciclo está. É útil no dia a dia para responder dúvidas do tipo \"fulana conseguiu se cadastrar?\", \"ela já confirmou o e-mail?\" ou \"ela está no plano Premium?\". Também ajuda a entender, na prática, o efeito do que você publica: a fase que aparece aqui é a mesma que decide o conteúdo que aquela pessoa vê no aplicativo. O que esta área não faz é gestão: nada do que está na tela pode ser criado, corrigido ou apagado por aqui — quem administra os próprios dados é a usuária, pelo perfil dela no app.",
    "passos": [
      {
        "titulo": "Abrir a lista de usuárias",
        "descricao": "No menu lateral, seção Pessoas, clique em Usuárias. A lista abre já mostrando todas as pessoas cadastradas, da primeira página. Enquanto os dados chegam aparece a mensagem \"Carregando usuárias…\". Este item do menu só existe para quem entra como administradora geral; quem entra como profissional vê apenas o próprio perfil."
      },
      {
        "titulo": "Procurar uma pessoa pelo nome ou e-mail",
        "descricao": "Digite no campo \"Buscar por nome ou e-mail\", no alto da página. A lista se atualiza sozinha uma fração de segundo depois que você para de digitar — não existe botão de buscar e não é preciso apertar Enter. A busca olha só o nome e o e-mail: não encontra por telefone, por plano nem por fase."
      },
      {
        "titulo": "Filtrar por situação (status)",
        "descricao": "Use a caixa \"Todos os status\" e escolha entre Ativa, Aguardando confirmação, Inativa, Aguardando deleção e Anonimizada. A lista passa a mostrar apenas quem está naquela situação. Para voltar a ver todo mundo, escolha novamente \"Todos os status\"."
      },
      {
        "titulo": "Filtrar por plano",
        "descricao": "Use a caixa \"Todos os planos\" e escolha Gratuito ou Premium. Os filtros se somam: se você deixar uma busca digitada e escolher Premium, verá só quem atende às duas condições ao mesmo tempo."
      },
      {
        "titulo": "Ler o resultado e limpar os filtros",
        "descricao": "Logo acima da tabela aparece a contagem: \"12 usuárias\", ou \"12 usuárias encontradas\" quando há algum filtro ativo. Nesse caso surge também o atalho \"Limpar filtros\", à direita, que apaga a busca e volta os dois filtros para \"Todos\" de uma vez."
      },
      {
        "titulo": "Navegar entre as páginas",
        "descricao": "A lista mostra 20 pessoas por página. Se houver mais que isso, os números de página aparecem embaixo da tabela; se couber tudo em uma página, nenhum número aparece. Atenção: sempre que você digita na busca ou troca um filtro, a lista volta automaticamente para a primeira página."
      },
      {
        "titulo": "Quando a lista não carrega",
        "descricao": "Se algo falhar na conexão, no lugar da tabela aparece \"Não foi possível carregar as usuárias. Tente novamente.\" com o botão \"Tentar novamente\". Clique nele para recarregar. Se o erro insistir, avise a equipe técnica — não há nada a corrigir do lado do conteúdo."
      },
      {
        "titulo": "Entender uma linha da tabela",
        "descricao": "Cada linha traz a pessoa (com as iniciais no círculo), o contato (e-mail em cima, telefone embaixo), a situação, o plano, a fase atual e a data de cadastro. Não é possível clicar na linha para abrir uma ficha detalhada, nem reordenar a tabela clicando nos títulos das colunas: a lista é apenas essa visão."
      }
    ],
    "campos": [
      {
        "nome": "Buscar por nome ou e-mail (filtro)",
        "obrigatorio": false,
        "regra": "Campo livre, sem limite de caracteres e sem obrigatoriedade. Procura o texto digitado dentro do nome e do e-mail, sem diferenciar maiúsculas de minúsculas, e aceita pedaços da palavra. A lista só é atualizada cerca de meio segundo depois da última tecla, para não recarregar a cada letra. Começa vazio."
      },
      {
        "nome": "Status (filtro)",
        "obrigatorio": false,
        "regra": "Lista fechada com cinco situações, além da opção \"Todos os status\" (o padrão): Ativa, Aguardando confirmação, Inativa, Aguardando deleção e Anonimizada. Só é possível escolher uma por vez."
      },
      {
        "nome": "Plano (filtro)",
        "obrigatorio": false,
        "regra": "Lista fechada com duas opções, além de \"Todos os planos\" (o padrão): Gratuito e Premium. Só é possível escolher um por vez."
      },
      {
        "nome": "Coluna Usuária",
        "obrigatorio": false,
        "regra": "Mostra o nome cadastrado, com um círculo de iniciais ao lado. Quando a pessoa foi anonimizada, o círculo mostra apenas um ponto de interrogação e a linha inteira fica esmaecida."
      },
      {
        "nome": "Coluna Contato",
        "obrigatorio": false,
        "regra": "E-mail na primeira linha e telefone na segunda. O telefone é exibido já formatado, no padrão (11) 98765-4321 (ou (11) 9876-5432 quando tem oito dígitos). Se não houver telefone cadastrado, aparece um travessão."
      },
      {
        "nome": "Coluna Status",
        "obrigatorio": false,
        "regra": "Etiqueta com a situação da conta. Ativa aparece em destaque; Aguardando confirmação, Inativa, Aguardando deleção e Anonimizada aparecem em tom neutro. Vem do sistema e não é editável por aqui."
      },
      {
        "nome": "Coluna Plano",
        "obrigatorio": false,
        "regra": "Mostra Gratuito ou Premium. Todo cadastro novo nasce no plano gratuito; a mudança para Premium acontece fora do painel."
      },
      {
        "nome": "Coluna Fase",
        "obrigatorio": false,
        "regra": "Mostra o nome da fase atual do ciclo daquela pessoa, exatamente como a fase está cadastrada na área de Fases. Quando ainda não há fase definida (o onboarding não foi concluído), aparece o texto \"sem fase\" em cinza claro."
      },
      {
        "nome": "Coluna Cadastro",
        "obrigatorio": false,
        "regra": "Data em que a conta foi criada, no formato dia/mês/ano. Quando a data não vem preenchida, aparece um travessão."
      }
    ],
    "relacoes": "A fase que aparece na coluna Fase é a mesma que você configura em Fases e que o sistema calcula a partir das respostas do Onboarding: as opções respondidas somam pontos para cada fase e a mais pontuada vence (em caso de empate, ganha a fase de ordem menor). Ou seja, se você renomear uma fase, o novo nome passa a aparecer aqui; e se o mapeamento do onboarding estiver incompleto, é aqui que você vai ver muita gente com \"sem fase\". A fase, por sua vez, é o que decide quais conteúdos e trilhas cada pessoa encontra no aplicativo — esta lista é a maneira mais direta de conferir se as pessoas estão caindo nas fases que você esperava. Para ter o panorama em números (quantas usuárias ativas, quantas em cada fase, trilhas mais percorridas) use a área de Métricas, que mostra apenas totais agregados, sem nome de ninguém. Não confunda esta área com Profissionais e Equipe: aquelas são as pessoas que atendem e as que trabalham no painel; Usuárias são as mulheres que usam o aplicativo.",
    "atencao": [
      "Área somente-leitura, sem exceção: não existe botão de criar, editar ou excluir usuária, nem para trocar o plano, mudar a fase, reativar uma conta ou reenviar o e-mail de confirmação. Se algo precisa ser corrigido no cadastro de alguém, a própria usuária faz isso no perfil dela no aplicativo.",
      "Não há filtro por fase, mesmo a fase aparecendo na tabela. Você consegue filtrar apenas por nome/e-mail, status e plano. Para enxergar a distribuição por fase, vá em Métricas.",
      "A busca ignora o telefone. Procurar por um número não traz resultado; use nome ou e-mail.",
      "\"Aguardando confirmação\" quer dizer que a pessoa se cadastrou mas ainda não clicou no link do e-mail — ela ainda não tem acesso pleno, e normalmente aparece sem fase.",
      "\"Aguardando deleção\" e \"Anonimizada\" vêm de um pedido de exclusão feito pela própria usuária. Anonimização não tem volta: os dados originais não podem ser recuperados por ninguém pelo painel. Essas linhas ficam esmaecidas, com o círculo mostrando \"?\" e o contato substituído por um dado genérico ou por um travessão — não tente entrar em contato por esses dados.",
      "A tela mostra dados pessoais reais (nome, e-mail e telefone). Evite prints, cópias em planilhas ou envio dessas informações por mensagem; consulte apenas o necessário.",
      "Não dá para clicar em uma linha e abrir a ficha completa da pessoa, nem exportar a lista, nem ordenar clicando nos títulos das colunas. O que está na tabela é tudo o que a área oferece.",
      "Trocar qualquer filtro joga você de volta para a primeira página. Se estava na página 3 conferindo algo e mexeu no filtro, será preciso navegar de novo até lá.",
      "Muita gente com \"sem fase\" é um sinal de alerta sobre o onboarding, não sobre esta área: vale revisar as perguntas, as opções e o mapeamento de fases antes de concluir que é um problema de cadastro."
    ]
  },
  {
    "slug": "metricas",
    "titulo": "Métricas",
    "resumo": "Painel só de leitura com os números agregados da plataforma: quantas usuárias estão ativas, como elas se distribuem pelas fases, o que anda sendo mais consumido e qual é a taxa de conclusão. Nenhum dado individual de usuária aparece aqui.",
    "paraQueServe": "Métricas existe para você enxergar o efeito do que publica: quais conteúdos e trilhas as usuárias realmente percorrem, em que fase do ciclo elas estão concentradas e quanto do que está disponível vem sendo concluído. É a área para consultar antes de planejar a próxima leva de conteúdo ou de trilhas, e depois de publicar, para acompanhar como aquilo foi recebido. Não há nada para preencher, salvar ou excluir: o painel apenas mostra: para mudar os números é preciso mudar o conteúdo, as trilhas e as fases nas áreas correspondentes. Fica no menu lateral, na seção \"Análise\", e só aparece para quem entra com perfil de administração geral.",
    "passos": [
      {
        "titulo": "Abrir o painel",
        "descricao": "No menu lateral, seção \"Análise\", clique em \"Métricas\". Os números carregam sozinhos assim que a tela abre (aparece \"Carregando métricas…\" por um instante). Não há formulário, filtro nem campo para preencher."
      },
      {
        "titulo": "Ler os quatro números do topo",
        "descricao": "São os cartões-resumo: \"Usuárias ativas\", \"Conteúdos publicados\", \"Trilhas criadas\" e \"Taxa de conclusão\" (esse último em destaque, no cartão roxo). Repare que o cartão de conteúdos conta apenas o que está publicado — rascunhos ficam de fora — enquanto o de trilhas fala em trilhas criadas."
      },
      {
        "titulo": "Conferir \"Usuárias por fase\"",
        "descricao": "O bloco mostra a distribuição da fase atual das usuárias: uma linha por fase, com o número, o percentual sobre o total visível e uma barrinha. No rodapé do bloco aparece \"Total (recorte visível)\" com a soma das linhas que têm número. Fases com pouquíssimas usuárias aparecem com a palavra \"suprimido\" no lugar do número e sem barra."
      },
      {
        "titulo": "Entender a taxa de conclusão",
        "descricao": "O bloco \"Taxa de conclusão\" repete, em forma de medidor, o mesmo percentual do cartão roxo do topo — não são dois indicadores diferentes. A conta está escrita embaixo do medidor: conclusões ÷ conteúdos publicados, arredondada para um número inteiro."
      },
      {
        "titulo": "Ver os conteúdos mais consumidos",
        "descricao": "O bloco lista os conteúdos em ranking, numerados a partir de 1, ordenados por número de conclusões. À direita de cada linha vem o número de conclusões; a barrinha é proporcional ao primeiro colocado. Itens suprimidos aparecem com um traço (\"—\") no lugar do número."
      },
      {
        "titulo": "Ver as trilhas mais percorridas",
        "descricao": "Mesmo formato do ranking anterior, mas contando quantas usuárias percorreram cada trilha. Também numerado, com barra proporcional ao primeiro colocado e traço (\"—\") quando o valor foi suprimido."
      },
      {
        "titulo": "Atualizar os números quando precisar",
        "descricao": "O botão \"Atualizar\", no canto superior direito ao lado do título, recarrega tudo (cartões do topo e blocos). Use-o depois de publicar ou despublicar algo em outra aba: enquanto a tela fica aberta, os números não se atualizam sozinhos."
      },
      {
        "titulo": "O que fazer se der erro",
        "descricao": "Se a carga falhar, o painel inteiro é substituído pela mensagem \"Não foi possível carregar as métricas. Tente novamente.\" com o botão \"Tentar novamente\". Clique nele; se o erro continuar, avise a equipe técnica — não há como ver números parciais nesse estado."
      }
    ],
    "campos": [],
    "relacoes": "Métricas não guarda informação própria: tudo o que aparece vem das outras áreas. As linhas de \"Usuárias por fase\" são as fases cadastradas em Fases, combinadas com a fase atual de cada usuária — fase que começa a ser definida pelas respostas do Onboarding. O cartão \"Conteúdos publicados\" e o ranking de conteúdos vêm da biblioteca em Conteúdos, contando o que está publicado (rascunho não entra). \"Trilhas criadas\" e \"Trilhas mais percorridas\" vêm de Trilhas. Por isso o painel muda sozinho conforme você trabalha nas outras áreas: publicar um conteúdo, criar uma trilha ou ativar uma fase se reflete aqui na próxima atualização. Para consultar uma usuária específica pelo nome ou e-mail, o lugar é a área Usuárias — aqui só existem totais.",
    "atencao": [
      "Painel só de leitura: não dá para editar, exportar nem baixar nada, e não existe filtro por período ou intervalo de datas. O que você vê é o acumulado no momento em que a tela carregou.",
      "\"suprimido\" (nas fases) e \"—\" (nos rankings) não são erro: quando o recorte tem pouquíssimas pessoas, o sistema esconde o número de propósito, para que ninguém consiga identificar uma usuária a partir dele. A linha continua na lista, só sem número e sem barra. É o que o aviso no rodapé da tela chama de k-anonimato.",
      "Valores suprimidos contam como zero no rodapé \"Total (recorte visível)\" e nos percentuais das fases. Por isso esse total pode ser menor que o cartão \"Usuárias ativas\" — não espere que os dois batam.",
      "Os percentuais das fases são arredondados e calculados sobre o total visível, não sobre \"Usuárias ativas\"; somados, podem não dar exatamente 100%.",
      "A taxa de conclusão divide pelo número de conteúdos publicados: publicar muitos conteúdos de uma vez aumenta o divisor e pode derrubar a porcentagem mesmo sem ninguém ter deixado de usar a plataforma. Uma queda logo depois de uma leva de publicações costuma ser exatamente isso.",
      "As barras são proporcionais ao maior item de cada bloco — o primeiro colocado sempre aparece com a barra cheia. Compare os números, nunca o tamanho das barras entre blocos diferentes.",
      "Os rankings mostram apenas os itens que o sistema devolve; um conteúdo ou trilha sem consumo pode simplesmente não aparecer. Não estar no ranking não significa que o item foi excluído ou despublicado.",
      "Os números não se atualizam sozinhos com a tela aberta. Depois de publicar algo, volte aqui e clique em \"Atualizar\".",
      "Quando um bloco não tem informação, aparece \"Sem dados para exibir.\" — é normal em plataforma com pouco uso ainda, ou quando nenhuma fase foi cadastrada.",
      "Aqui nunca aparece nome, e-mail ou histórico de nenhuma usuária individual, e isso é intencional. Não use esta área tentando descobrir o que uma pessoa específica consumiu."
    ]
  },
  {
    "slug": "conta-acesso",
    "titulo": "Sua conta e acesso",
    "resumo": "É a porta de entrada do backoffice: entrar com e-mail e senha, definir a senha no primeiro acesso, recuperar o acesso quando esquecer a senha e cuidar dos seus dados de conta. Sem passar por aqui, nenhuma outra área do painel abre.",
    "paraQueServe": "O backoffice é uma área restrita à equipe Entre Ser — não existe autocadastro nem \"criar conta\" na tela de login. Sua conta é criada por outra pessoa da equipe (na área Equipe), e você recebe uma senha temporária por e-mail para o primeiro acesso. Esta área reúne tudo o que envolve a sua entrada no painel: login, definição da primeira senha, recuperação por e-mail, seus dados de perfil e a saída do sistema. Use quando for entrar pela primeira vez, quando esquecer a senha, quando quiser trocá-la por segurança ou quando precisar sair da sua conta em um computador compartilhado.",
    "passos": [
      {
        "titulo": "Entrar no backoffice",
        "descricao": "Na tela \"Acessar o backoffice\", preencha E-mail e Senha e clique em Entrar. O olhinho no campo de senha mostra ou oculta o que você digitou. Se o e-mail ou a senha estiverem errados, o aviso é sempre o mesmo — \"E-mail ou senha incorretos\" — sem dizer qual dos dois falhou; isso é proposital, para não entregar a estranhos quais e-mails existem no sistema. Deu tudo certo, você cai direto na tela Início do painel."
      },
      {
        "titulo": "Primeiro acesso: definir sua senha",
        "descricao": "Se a sua conta ainda usa a senha temporária, entrar com ela não abre o painel: o sistema leva você para a tela \"Definir senha\", já mostrando o seu e-mail. Preencha Nova senha e Confirmar nova senha e clique em \"Definir senha e entrar\". Não há como pular esta etapa — enquanto a senha temporária não for trocada, o painel não abre. Ao confirmar, você entra no painel na hora, sem precisar fazer login de novo, e a senha temporária deixa de funcionar."
      },
      {
        "titulo": "Esqueci minha senha: pedir o link",
        "descricao": "Na tela de login, clique em \"Esqueci minha senha\". Informe o e-mail da sua conta e clique em \"Enviar link\". A resposta é sempre a mesma frase de sucesso, exista ou não uma conta com aquele e-mail — de novo, por segurança. Nesta versão de demonstração não sai e-mail de verdade: quando o e-mail realmente existe, aparece logo abaixo um quadro \"Modo demonstração\" com o botão \"Redefinir senha agora\". Se esse quadro não aparecer, é sinal de que aquele e-mail não está cadastrado — confira se digitou certo."
      },
      {
        "titulo": "Criar a nova senha pelo link",
        "descricao": "Abrindo o link, você chega em \"Criar nova senha\". Preencha Nova senha e Confirmar nova senha e clique em \"Redefinir senha\". O link vale por 1 hora e só pode ser usado uma vez: depois disso o sistema avisa que ele expirou ou já foi utilizado, e você precisa pedir um novo em \"Esqueci minha senha\". Se você abrir a tela sem um link válido, ela mostra \"Link inválido ou ausente\" e oferece o atalho para recuperar a senha. Ao concluir, a mensagem confirma o sucesso e você entra novamente com a senha nova."
      },
      {
        "titulo": "Trocar a senha estando logada",
        "descricao": "Clique no seu nome, no canto superior direito, e escolha \"Trocar senha\". O caminho depende do tipo da sua conta: se você é Admin Geral, esse item leva para a tela de recuperação por e-mail (\"Esqueci minha senha\") — é por ali que a troca acontece de fato. Contas de Profissional vão para a tela \"Trocar senha\", que pede Senha atual, Nova senha e Confirmar nova senha, com uma listinha de requisitos que fica verde conforme você digita. Ao confirmar, a tela avisa que todas as suas sessões foram encerradas e oferece o botão \"Entrar novamente\"."
      },
      {
        "titulo": "Ver e editar Meu perfil",
        "descricao": "A tela \"Meu perfil\" (endereço /admin/perfil) reúne foto, nome, telefone, CRP, abordagem e bio — os dados que compõem o perfil público mostrado às usuárias. Ela faz parte do menu das contas de Profissional; a conta de Admin Geral, usada para cadastrar conteúdo, não tem esse item no menu lateral. Para alterar, edite os campos e clique em \"Salvar alterações\"; \"Descartar\" só fica ativo depois que algo muda e devolve tudo como estava. E-mail e Status aparecem em cinza porque não são editáveis aqui."
      },
      {
        "titulo": "Sair do backoffice",
        "descricao": "Clique no seu nome no canto superior direito e escolha \"Sair\". Aparece uma confirmação — \"Sair do backoffice?\" — para evitar saída acidental no meio de um cadastro. Confirmando, a sessão é encerrada e você volta para a tela de login. Sempre faça isso em computadores compartilhados: enquanto a sessão estiver aberta, qualquer pessoa no mesmo navegador entra no painel sem senha."
      }
    ],
    "campos": [
      {
        "nome": "Login · E-mail",
        "obrigatorio": true,
        "regra": "Precisa ser um e-mail válido, com até 255 caracteres. Espaços sobrando nas pontas são ignorados e maiúsculas/minúsculas não fazem diferença."
      },
      {
        "nome": "Login · Senha",
        "obrigatorio": true,
        "regra": "Só não pode ficar em branco — o sistema não exige tamanho aqui, apenas confere se bate com a senha da conta. O ícone de olho mostra/oculta o texto digitado."
      },
      {
        "nome": "Definir senha (primeiro acesso) · Nova senha",
        "obrigatorio": true,
        "regra": "Mínimo de 8 caracteres, contendo pelo menos uma letra maiúscula, uma minúscula e um número."
      },
      {
        "nome": "Definir senha (primeiro acesso) · Confirmar nova senha",
        "obrigatorio": true,
        "regra": "Precisa ser exatamente igual à nova senha; se não for, aparece \"As senhas não coincidem\"."
      },
      {
        "nome": "Recuperar senha · E-mail",
        "obrigatorio": true,
        "regra": "E-mail válido, até 255 caracteres. Se você chegar por um link que já traz o e-mail, o campo vem preenchido e pode ser alterado."
      },
      {
        "nome": "Criar nova senha · Nova senha",
        "obrigatorio": true,
        "regra": "Mesmas regras do primeiro acesso: mínimo 8 caracteres, com maiúscula, minúscula e número."
      },
      {
        "nome": "Criar nova senha · Confirmar nova senha",
        "obrigatorio": true,
        "regra": "Precisa ser idêntica à nova senha."
      },
      {
        "nome": "Meu perfil · Foto",
        "obrigatorio": false,
        "regra": "Aceita apenas arquivos de imagem (JPG ou PNG) de até 5 MB. Arquivo maior ou de outro tipo é recusado com aviso na hora. Sem foto, aparecem as iniciais do nome."
      },
      {
        "nome": "Meu perfil · Nome completo",
        "obrigatorio": true,
        "regra": "Pelo menos 2 caracteres e sem números. É o nome que aparece no perfil público."
      },
      {
        "nome": "Meu perfil · E-mail",
        "obrigatorio": false,
        "regra": "Somente leitura. É a sua identidade de login e não pode ser alterado nesta tela."
      },
      {
        "nome": "Meu perfil · Telefone",
        "obrigatorio": true,
        "regra": "DDD + número, com 10 ou 11 dígitos. A formatação é aplicada automaticamente enquanto você digita."
      },
      {
        "nome": "Meu perfil · CRP",
        "obrigatorio": true,
        "regra": "Formato número/número, com 2 dígitos antes da barra e de 4 a 6 depois — por exemplo 06/45231."
      },
      {
        "nome": "Meu perfil · Abordagem",
        "obrigatorio": true,
        "regra": "Texto livre e curto, não pode ficar vazio. Ex.: TCC, ACT, MBSR."
      },
      {
        "nome": "Meu perfil · Bio pública",
        "obrigatorio": false,
        "regra": "Texto livre, sem limite de caracteres. Aparece para as usuárias na listagem de profissionais."
      },
      {
        "nome": "Meu perfil · Status",
        "obrigatorio": false,
        "regra": "Somente leitura. Mostra se a conta está ativa e atendendo; quem controla isso é a equipe Entre Ser, pela área Equipe."
      },
      {
        "nome": "Trocar senha · Senha atual",
        "obrigatorio": true,
        "regra": "Não pode ficar em branco. Se estiver errada, a tela avisa \"Senha atual incorreta\" e nada é alterado."
      },
      {
        "nome": "Trocar senha · Nova senha",
        "obrigatorio": true,
        "regra": "Precisa cumprir os 4 requisitos exibidos na tela: mínimo 8 caracteres, uma maiúscula, uma minúscula e um número. Cada item fica verde conforme você digita."
      },
      {
        "nome": "Trocar senha · Confirmar nova senha",
        "obrigatorio": true,
        "regra": "Precisa ser igual à nova senha."
      }
    ],
    "relacoes": "Sua conta nasce na área Equipe: quando alguém cadastra uma nova Admin Geral ali, o sistema gera uma senha temporária e a envia por e-mail — essa senha nunca é exibida na tela de quem cadastrou. É ela que dispara o fluxo de primeiro acesso descrito aqui. Depois de entrar, o menu lateral que você vê depende do tipo da conta: a Admin Geral enxerga Início, Profissionais, Equipe, Usuárias, Tags, Fases, Conteúdos, Trilhas, Onboarding, Métricas e Manual; uma conta de Profissional enxerga apenas Meu perfil. Nenhuma dessas áreas abre sem sessão ativa — se a sessão cair, o painel devolve você para o login. Os dados de Meu perfil (nome, foto, CRP, abordagem e bio) alimentam o perfil público que as usuárias veem na listagem de profissionais dentro do aplicativo.",
    "atencao": [
      "A sessão dura 1 hora. Passado esse tempo, o painel devolve você para o login — salve o que estiver cadastrando antes de sair para um café longo.",
      "No login, o erro é sempre genérico (\"E-mail ou senha incorretos\"), mesmo quando o e-mail nem existe. Não tente deduzir pelo aviso qual campo está errado.",
      "Conta desativada não entra: o aviso é \"Esta conta não está ativa no momento\". Quem reativa é a equipe, pela área Equipe — não há nada a fazer na tela de login.",
      "Senha temporária não abre o painel. Enquanto ela não for trocada, todo login leva de volta para a tela \"Definir senha\". Se você fechar a janela no meio, é só entrar de novo com a temporária que o sistema retoma dali.",
      "Em \"Esqueci minha senha\" a mensagem de sucesso aparece sempre, mesmo com e-mail inexistente. Nesta demonstração, o quadro \"Modo demonstração\" com o link só aparece quando o e-mail está realmente cadastrado — use isso como pista se nada acontecer.",
      "O link de redefinição vale por 1 hora e só funciona uma vez. Depois de usado ou vencido, ele mostra \"Este link já foi utilizado\" ou \"Este link expirou\" e é preciso pedir outro.",
      "Ao redefinir a senha pelo link, a sessão daquela conta é encerrada. Se você estava logada no painel, será desconectada e precisará entrar com a senha nova.",
      "No menu do seu nome, \"Trocar senha\" leva a Admin Geral para a tela de recuperação por e-mail, e não para um formulário de senha atual/nova. É o comportamento esperado, não um erro.",
      "\"Meu perfil\" não aparece no menu lateral da Admin Geral — aquela tela foi desenhada para o perfil público das profissionais (CRP, abordagem, bio).",
      "Nesta versão de demonstração, \"Salvar alterações\" em Meu perfil e a tela \"Trocar senha\" apenas simulam o resultado: mostram a confirmação, mas as mudanças não ficam gravadas de verdade. Para trocar a senha valendo, use \"Esqueci minha senha\" e o link de redefinição.",
      "Não existe cadastro nem entrada com Google no backoffice. A porta de entrada é só e-mail e senha de uma conta criada pela equipe.",
      "Nesta demonstração tudo fica guardado no próprio navegador. Em outro computador, outro navegador ou numa janela anônima, o painel aparece \"zerado\", com as contas de exemplo.",
      "Contas de exemplo para testar: admin@entreser.com.br com a senha Admin123 (entra direto) e equipe@entreser.com.br com a senha Temp1234 (cai no primeiro acesso, para você ver como é definir a senha)."
    ]
  }
]
