import useDayPlanner from 'hooks/useDayPlanner'

export default function LitersOfWater() {
  const { data, update } = useDayPlanner()
  const litersOfWater = data?.litersOfWater || 0
  const litersOfWaterProgress = (litersOfWater / 5) * 100

  return (
    <div
      id="literswater"
      className="relative px-4 py-5 mt-3 border-2 rounded-tl-lg rounded-bl-xl rounded-br-md rounded-tr-xl border-primary h-fit"
    >
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-tl-lg rounded-br-lg rounded-bl-md rounded-tr-xl bg-primary text-tertiary w-max font-display leading-[initial] tracking-wider">
        Liters of water
      </div>
      <div className="flex justify-around mb-1 text-lg font-display">
        <span className={litersOfWater === 0 ? '' : 'opacity-30'}>0</span>
        <span className={litersOfWater === 0.5 ? 'opacity-100' : 'opacity-0'}>0.5</span>
        <span className={litersOfWater === 1 ? 'opacity-100' : 'opacity-0'}>1</span>
        <span className={litersOfWater === 1.5 ? 'opacity-100' : 'opacity-0'}>1.5</span>
        <span className={litersOfWater === 2 ? 'opacity-100' : 'opacity-0'}>2</span>
        <span className={litersOfWater === 2.5 ? 'opacity-100' : 'opacity-0'}>2.5</span>
        <span className={litersOfWater === 3 ? 'opacity-100' : 'opacity-0'}>3</span>
        <span className={litersOfWater === 3.5 ? 'opacity-100' : 'opacity-0'}>3.5</span>
        <span className={litersOfWater === 4 ? 'opacity-100' : 'opacity-0'}>4</span>
        <span className={litersOfWater === 4.5 ? 'opacity-100' : 'opacity-0'}>4.5</span>
        <span className={litersOfWater === 5 ? '' : 'opacity-30'}>5</span>
      </div>
      <input
        type="range"
        min="0"
        max="5"
        step="0.5"
        value={litersOfWater}
        id="range"
        onChange={({ target: { value } }) =>
          update({
            litersOfWater: Number(value),
          })
        }
        style={{
          background: `linear-gradient(90deg, #A7D937 0%, #5AC596 ${litersOfWaterProgress}%, transparent ${litersOfWaterProgress}%)`,
        }}
      />
    </div>
  )
}
