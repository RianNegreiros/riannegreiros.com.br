export type PostLang = 'pt' | 'en'

export const LOCALES: Record<
  PostLang,
  { htmlLang: string; ogLocale: string; dateLocale: string }
> = {
  pt: { htmlLang: 'pt-BR', ogLocale: 'pt_BR', dateLocale: 'pt-BR' },
  en: { htmlLang: 'en', ogLocale: 'en_US', dateLocale: 'en-US' },
}

export function postPath(lang: PostLang, slug: string) {
  return lang === 'en' ? `/en/blog/${slug}` : `/blog/${slug}`
}

export const postStrings = {
  pt: {
    published: 'Publicado',
    coverImage: 'Imagem de capa:',
    toc: 'Tabela de Conteúdos',
    enjoyed: 'Gostou deste artigo? Compartilhe!',
    switchLanguage: 'Read this post in English',
    tip: {
      message: 'Este artigo também está disponível em português.',
      action: 'Ler em português',
      dismiss: 'Fechar',
    },
    share: 'Compartilhar',
    openShareMenu: 'Abrir menu de compartilhamento',
    sharePost: 'Compartilhar post',
    copyLink: 'Copiar link',
    linkCopied: 'Link copiado!',
    email: 'E-mail',
    emailError: 'Erro no email',
    emailFailed:
      'Falha ao abrir o cliente de email. Tente novamente ou copie o link manualmente.',
    shareText: {
      twitter: (title: string, url: string) =>
        `Confira este artigo: ${title} - ${url}`,
      linkedin: (title: string, url: string) =>
        `Achei este artigo interessante: ${title} - ${url}`,
      whatsapp: (title: string, url: string) =>
        `Ei, achei que você poderia gostar deste artigo: ${title} - ${url}`,
      telegram: (title: string, url: string) =>
        `Dê uma olhada nisso: ${title} - ${url}`,
      emailSubject: (title: string) => `Confira este artigo: ${title}`,
      emailBody: (title: string, description: string, url: string) =>
        `Olá,\n\nAchei que você poderia achar este artigo interessante:\n\nTítulo: ${title}\nDescrição: ${description}\nLink: ${url}\n\nAtenciosamente,`,
    },
  },
  en: {
    published: 'Published',
    coverImage: 'Cover image:',
    toc: 'Table of Contents',
    enjoyed: 'Enjoyed this article? Share it!',
    switchLanguage: 'Ler este post em português',
    tip: {
      message: 'This article is also available in English.',
      action: 'Read in English',
      dismiss: 'Close',
    },
    share: 'Share',
    openShareMenu: 'Open share menu',
    sharePost: 'Share post',
    copyLink: 'Copy link',
    linkCopied: 'Link copied!',
    email: 'Email',
    emailError: 'Email error',
    emailFailed:
      'Could not open your email client. Try again or copy the link manually.',
    shareText: {
      twitter: (title: string, url: string) =>
        `Check out this article: ${title} - ${url}`,
      linkedin: (title: string, url: string) =>
        `I found this article interesting: ${title} - ${url}`,
      whatsapp: (title: string, url: string) =>
        `Hey, thought you might like this article: ${title} - ${url}`,
      telegram: (title: string, url: string) =>
        `Take a look at this: ${title} - ${url}`,
      emailSubject: (title: string) => `Check out this article: ${title}`,
      emailBody: (title: string, description: string, url: string) =>
        `Hi,\n\nI thought you might find this article interesting:\n\nTitle: ${title}\nDescription: ${description}\nLink: ${url}\n\nBest regards,`,
    },
  },
} as const
