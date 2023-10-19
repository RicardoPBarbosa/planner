import { Download } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'

import { scripts } from 'database'
import localDayjs from 'lib/dayjs'
import { useAuthUser } from 'hooks/useAuthUser'

export default function ExportData() {
  const user = useAuthUser()
  const { mutateAsync, isLoading } = useMutation({
    mutationKey: ['export-data', user?.uid],
    mutationFn: (uid: string) => scripts.exportData(uid),
  })

  const exportData = async () => {
    if (!user?.uid) return
    const data = await mutateAsync(user.uid)
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(data))}`
    const link = document.createElement('a')
    link.href = jsonString
    link.download = `planner-export-${localDayjs().format('DD-MM-YYYY_HH-mm-ss')}.json`

    link.click()
  }

  return (
    <button
      className="grid w-full h-12 font-body max-w-[190px] mx-auto mt-8 mb-5 text-white place-content-center font-semibold rounded-lg bg-tertiary grid-flow-col gap-3 leading-[initial] hover:bg-tertiary/90 transition-all disabled:bg-slate-200"
      onClick={exportData}
      disabled={isLoading}
    >
      <Download />
      {isLoading ? 'Exporting...' : 'Export your data'}
    </button>
  )
}
