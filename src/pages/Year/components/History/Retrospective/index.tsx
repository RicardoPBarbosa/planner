import { Suspense, lazy, useMemo } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

import { yearlyPlanner } from 'database'
import { useAuthUser } from 'hooks/useAuthUser'
import type { Retrospective as RetrospectiveType, YearPlanner } from '@types'
import { Accordion } from './Accordion'
const Questions = lazy(() => import('./Questions'))
const Categories = lazy(() => import('./Categories'))
const TextEditor = lazy(() => import('components/TextEditor'))

type Props = {
  back: () => void
  reviewYear: number
}

export default function Retrospective({ back, reviewYear }: Props) {
  const user = useAuthUser()
  const {
    data: allData,
    isLoading,
    refetch,
  } = useQuery(['all-years'], () => yearlyPlanner.getAll(user?.uid), {
    enabled: !!user?.uid,
  })
  const data = useMemo(() => {
    return allData?.find((item) => item.year === reviewYear)
  }, [allData, reviewYear])
  const { mutateAsync: updateYear } = useMutation({
    mutationKey: ['update-year', reviewYear],
    mutationFn: ({ id, payload }: { id: string; payload: Partial<YearPlanner> }) =>
      yearlyPlanner.update(id, payload, user?.uid),
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  async function updateSelectedYear(payload: Partial<RetrospectiveType>) {
    if (data?.id) {
      await updateYear({
        id: data.id,
        payload: {
          retrospective: {
            ...data?.retrospective,
            ...payload,
          },
        },
      })
      refetch()
    }
  }

  async function handleSaveFreeText(text: string) {
    if (text !== data?.retrospective?.text) {
      updateSelectedYear({
        text,
      })
    }
  }

  return (
    <>
      <button
        className="px-2 my-1 text-lg tracking-wide transition-all rounded-md border-tertiary font-display text-tertiary hover:bg-primary hover:bg-opacity-20"
        onClick={back}
      >
        &lt;- Go back
      </button>
      <div className="w-full max-w-4xl mx-auto mt-3">
        <Accordion.Root type="single" defaultValue="item-1" collapsible>
          <Accordion.Item value="item-1">
            <Accordion.Header>By category</Accordion.Header>
            <Accordion.Content>
              <Suspense>
                <Categories
                  update={updateSelectedYear}
                  categories={data?.retrospective?.categories}
                />
              </Suspense>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Header>Questions</Accordion.Header>
            <Accordion.Content>
              <Suspense>
                <Questions
                  update={updateSelectedYear}
                  questionsAnswered={data?.retrospective?.questionsAnswered || []}
                />
              </Suspense>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-3">
            <Accordion.Header>Free text</Accordion.Header>
            <Accordion.Content>
              <Suspense>
                <TextEditor
                  content={data?.retrospective?.text || ''}
                  handleSave={handleSaveFreeText}
                />
              </Suspense>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </>
  )
}
