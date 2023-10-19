import ToDoItem from './ToDoItem'

export default function ToDoList() {
  return (
    <div
      id="todos"
      className="relative px-2 py-3 mt-1 border-2 rounded-tl-lg rounded-bl-xl rounded-br-md rounded-tr-xl border-primary h-fit"
    >
      <div className="absolute -top-5 -left-0.5 px-3 py-1 rounded-tl-lg rounded-br-lg rounded-bl-md rounded-tr-xl bg-primary text-lg text-tertiary w-fit font-display leading-[initial] tracking-wider">
        To-do list
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <ToDoItem key={`todo-${i}`} index={i} />
      ))}
    </div>
  )
}
