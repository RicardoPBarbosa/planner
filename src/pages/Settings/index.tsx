import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { Book, Github, Globe, LogOut, Twitter } from 'lucide-react'
import { lazy, Suspense, type ReactElement, type ReactNode } from 'react'

import { auth } from 'lib/firebase'
import LogoWithTitle from 'components/LogoWithTitle'
const ExportData = lazy(() => import('./components/ExportData'))

function Header() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between gap-1 pr-1 -mb-3 sm:justify-start sm:gap-3 sm:flex-col">
      <div className="flex items-center gap-3 sm:gap-5 sm:flex-col">
        <LogoWithTitle type="settings" />
      </div>
      <div className="flex gap-2 max-w-[190px] sm:w-full sm:gap-3 sm:flex-col">
        <button
          onClick={() => {
            signOut(auth)
            navigate('/login', { replace: true })
          }}
          className="grid flex-none w-12 h-12 grid-flow-col gap-3 transition-colors rounded-lg sm:w-full place-content-center bg-slate-100 text-slate-700 hover:bg-slate-200"
        >
          <LogOut />
          <span className="hidden font-semibold leading-[initial] sm:block font-body">Log Out</span>
        </button>
      </div>
    </div>
  )
}

type LinkProps = {
  icon?: ReactNode
  text: string | ReactElement
  href: string
}

function Link({ icon, text, href }: LinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center self-center justify-center w-full py-2 space-x-3 transition-all rounded bg-white/40 hover:bg-white/80"
    >
      {icon || null}
      <span className="font-semibold text-slate-800 font-body">{text}</span>
    </a>
  )
}

export default function Settings() {
  return (
    <div className="px-1 pt-1 pb-24 text-center sm:pt-5 sm:px-4">
      <Header />

      <Suspense>
        <ExportData />
      </Suspense>

      <div className="flex flex-col items-center w-full max-w-xs p-4 mx-auto space-y-3 rounded-lg gradient-to-b">
        <p className="flex items-center space-x-1 font-body text-slate-800">
          <span>Made by</span> <b>Ricardo Barbosa</b>
        </p>
        <Link
          icon={<Book size={22} />}
          text="Buy me a book"
          href="https://www.buymeacoffee.com/ricardopbarbosa"
        />
        <p className="text-lg underline font-display text-tertiary">Follow me</p>
        <Link
          icon={<Github size={20} />}
          text="On Github"
          href="https://github.com/RicardoPBarbosa"
        />
        <Link
          icon={<Twitter size={20} />}
          text="On Twitter"
          href="https://twitter.com/Ricard0Barbosa"
        />
        <Link
          icon={<Globe size={19} className="text-gray-700" />}
          text="My website"
          href="https://ricardopbarbosa.com"
        />
      </div>
    </div>
  )
}
