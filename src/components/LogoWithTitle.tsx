import Logo from 'assets/logo.png'

type Props = {
  type: 'daily' | 'weekly' | 'yearly' | 'settings'
}

export default function LogoWithTitle({ type }: Props) {
  return (
    <div className="flex items-center sm:flex-col w-fit">
      <span className="hidden -mb-3 sm:block lg:text-xl text-primary md:text-lg font-display">
        The
      </span>
      <img src={Logo} className="w-24 h-24 sm:w-28 sm:h-28 xl:w-32 xl:h-32" />
      <div className="flex flex-col text-xl text-left sm:text-base sm:gap-1 sm:flex-row md:text-lg lg:text-xl">
        {type === 'settings' ? (
          <span className="pl-2 leading-none sm:pl-0 font-display text-tertiary">Settings</span>
        ) : (
          <>
            <span className="leading-none capitalize font-display text-primary">{type}</span>
            <span className="leading-none font-display text-tertiary">Planner</span>
          </>
        )}
      </div>
    </div>
  )
}
