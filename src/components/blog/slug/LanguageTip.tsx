import { useEffect, useState } from 'react'
import { LanguagesIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PostLang } from '@/lib/i18n'

type LanguageTipProps = {
  /** Language of the page currently being read. */
  pageLang: PostLang
  /** URL of the same post in the other language. */
  href: string
  /** Texts, already written in the *other* language (the one being offered). */
  message: string
  action: string
  dismissLabel: string
}

const STORAGE_KEY = 'post-language-tip-dismissed'

// Portuguese pages: offer English to anyone whose browser isn't Portuguese.
// English pages: offer Portuguese only to Portuguese-language browsers.
function shouldOffer(pageLang: PostLang) {
  const primary = (navigator.languages?.[0] ?? navigator.language ?? '')
    .toLowerCase()
    .slice(0, 2)
  if (!primary) return false
  return pageLang === 'pt' ? primary !== 'pt' : primary === 'pt'
}

function wasDismissed() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export default function LanguageTip({
  pageLang,
  href,
  message,
  action,
  dismissLabel,
}: LanguageTipProps) {
  // Starts hidden so the server HTML (cached at the edge) is identical for
  // everyone; the decision is made in the browser after hydration.
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(shouldOffer(pageLang) && !wasDismissed())
  }, [pageLang])

  if (!visible) return null

  const dismiss = () => {
    setVisible(false)
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // storage unavailable (private mode etc.) - just hide for this view
    }
  }

  return (
    <div
      role="region"
      aria-label={message}
      lang={pageLang === 'pt' ? 'en' : 'pt-BR'}
      className="bg-card animate-in slide-in-from-bottom-4 fixed right-4 bottom-4 left-4 z-50 flex items-center gap-3 rounded-lg border p-4 shadow-lg sm:left-auto sm:max-w-sm print:hidden"
    >
      <LanguagesIcon className="text-primary h-5 w-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug">{message}</p>
        <Button asChild size="sm" className="mt-2">
          <a href={href} onClick={dismiss}>
            {action}
          </a>
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={dismiss}
        aria-label={dismissLabel}
      >
        <XIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
