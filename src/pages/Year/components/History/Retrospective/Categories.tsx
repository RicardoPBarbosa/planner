import { lazy, Suspense, useState } from 'react'

import { categoriesColors } from 'constants'
import type { EntryCategory, Retrospective } from '@types'
const TextEditor = lazy(() => import('components/TextEditor'))

type Props = {
  categories?: Partial<Record<EntryCategory, string>>
  update: (payload: Partial<Retrospective>) => void
}

export default function Categories({ categories, update }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>()

  async function handleSaveCategory(text: string, category: EntryCategory) {
    if (text !== categories?.[category]) {
      update({
        categories: {
          ...categories,
          [category]: text,
        },
      })
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2 xs:grid-cols-3 sm:grid-cols-4">
      {(Object.entries(categoriesColors) as [EntryCategory, string][]).map(([category, color]) => (
        <div
          key={category}
          className={
            activeCategory === category
              ? 'row-end-1 col-span-2 xs:col-span-3 sm:col-span-4'
              : 'col-span-1'
          }
        >
          <button
            onClick={() => setActiveCategory((prev) => (prev === category ? undefined : category))}
            className="flex items-center w-full h-12 gap-1 px-2 capitalize rounded-md"
            style={{ backgroundColor: `rgba(${color}, 0.1)` }}
          >
            <span className="text-xl tracking-wide font-display" style={{ color: `rgb(${color})` }}>
              {category}
            </span>
          </button>
          {activeCategory === category && (
            <div
              className="px-2 pt-2 pb-2 -mt-1 rounded-b-md"
              style={{ backgroundColor: `rgba(${color}, 0.1)` }}
            >
              <Suspense>
                <TextEditor
                  content={categories?.[category] || ''}
                  handleSave={(text) => handleSaveCategory(text, category)}
                  color={color}
                />
              </Suspense>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
