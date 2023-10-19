export default function GoalNumber({ number }: { number: number }) {
  return (
    <div className="flex items-center justify-center w-6 h-6 pt-1 text-xl bg-gradient-to-r from-secondary to-primary rounded-tl-md rounded-tr-xl rounded-bl-xl rounded-br-md font-display text-tertiary">
      {number}
    </div>
  )
}
