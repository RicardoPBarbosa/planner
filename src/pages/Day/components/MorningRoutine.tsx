import useDayPlanner from 'hooks/useDayPlanner'

export default function MorningRoutine() {
  const { data, update } = useDayPlanner()

  return (
    <div
      id="routine"
      className="relative pt-6 pb-2 mt-3 border-2 rounded-tl-lg rounded-bl-sm rounded-tr-md rounded-br-2xl border-secondary h-fit"
    >
      <div className="absolute flex items-center h-8 px-3 py-1 tracking-wider -translate-x-1/2 rounded-tr-lg rounded-bl-lg rounded-br-md w-max -top-4 left-1/2 bg-secondary font-display rounded-tl-md text-tertiary">
        Morning routine
      </div>
      <div className="flex flex-col gap-1">
        {data?.routine.map((item, i) => (
          <label
            htmlFor={`check-${i}`}
            key={item.order}
            className="flex items-center justify-between px-2 py-1"
          >
            <span className="text-lg font-display text-tertiary">{item.text}</span>
            <input
              id={`check-${i}`}
              type="checkbox"
              className="border-2 rounded-bl-lg w-7 h-7 text-secondary focus:ring-primary border-tertiary rounded-tl-md rounded-tr-md rounded-br-md disabled:opacity-70"
              checked={data.routine[i].status}
              onChange={() =>
                update({
                  routine: data.routine.map((ri) => {
                    if (ri.order === item.order) {
                      return {
                        ...ri,
                        status: !ri.status,
                      }
                    }
                    return ri
                  }),
                })
              }
            />
          </label>
        ))}
      </div>
    </div>
  )
}
