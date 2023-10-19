import { Link } from 'react-router-dom'

type Props = {
  resetErrorBoundary?: () => void
  error?: Error
}

export default function Error({ resetErrorBoundary, error }: Props) {
  return (
    <div className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full gap-4">
      <h1 className="text-5xl tracking-wide font-display text-zinc-600">There was an error!</h1>
      {error?.message && (
        <code className="w-full max-w-lg p-4 break-words rounded-md bg-zinc-100">
          {error.message}
        </code>
      )}
      {resetErrorBoundary ? (
        <button
          className="px-4 py-2 font-semibold leading-none border-2 rounded-md border-zinc-700 text-zinc-700 font-body"
          onClick={() => resetErrorBoundary()}
        >
          Try again
        </button>
      ) : (
        <Link
          className="px-4 py-2 font-semibold leading-none border-2 rounded-md border-zinc-700 text-zinc-700 font-body"
          to="/"
        >
          Go Home
        </Link>
      )}
    </div>
  )
}
