import { Suspense, lazy } from 'react'

import { questions } from 'constants'
import type { Question, Retrospective } from '@types'
import { Accordion } from './Accordion'
const TextEditor = lazy(() => import('components/TextEditor'))

type Props = {
  questionsAnswered: Question[]
  update: (payload: Partial<Retrospective>) => void
}

export default function Questions({ questionsAnswered, update }: Props) {
  async function handleSaveAnswer(questionId: string, answer: string) {
    const questionAnswered = questionsAnswered?.find((qa) => qa.questionId === questionId)
    if (questionAnswered?.answer !== answer) {
      update({
        questionsAnswered: questionAnswered
          ? questionsAnswered.map((qa) => {
              if (qa.questionId === questionId) {
                qa.answer = answer
              }
              return qa
            })
          : [...questionsAnswered, { questionId, answer }],
      })
    }
  }

  return (
    <Accordion.Root type="single" collapsible>
      {Object.entries(questions).map(([id, question]) => (
        <Accordion.Item key={id} value={id}>
          <Accordion.Header className="py-0 text-base font-body text-slate-900">
            {question}
          </Accordion.Header>
          <Accordion.Content>
            <Suspense>
              <TextEditor
                content={questionsAnswered?.find((qa) => qa.questionId === id)?.answer || ''}
                handleSave={(answer) => handleSaveAnswer(id, answer)}
              />
            </Suspense>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
