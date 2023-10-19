import React from 'react'
import type { Ref } from 'react'
import { twMerge } from 'tailwind-merge'
import { ArrowDown } from 'lucide-react'
import * as RAccordion from '@radix-ui/react-accordion'

function Item(
  { children, className, ...props }: RAccordion.AccordionItemProps,
  forwardedRef: Ref<HTMLDivElement>
) {
  return (
    <RAccordion.Item
      className={twMerge(
        'overflow-hidden first:mt-0 focus-within:relative focus-within:z-10',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </RAccordion.Item>
  )
}
const AccordionItem = React.forwardRef(Item)

function Header(
  { children, className, ...props }: RAccordion.AccordionTriggerProps,
  forwardedRef: Ref<HTMLButtonElement>
) {
  return (
    <RAccordion.Header
      className={twMerge(
        'flex py-2 text-2xl border-b font-display text-tertiary border-b-slate-300',
        className
      )}
    >
      <RAccordion.Trigger
        className="flex items-center justify-between flex-1 h-12 px-0 text-left rounded-sm group"
        ref={forwardedRef}
        {...props}
      >
        {children}
        <ArrowDown
          className="text-primary ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
          aria-hidden
          size={20}
        />
      </RAccordion.Trigger>
    </RAccordion.Header>
  )
}
const AccordionHeader = React.forwardRef(Header)

function Content(
  { children, className, ...props }: RAccordion.AccordionContentProps,
  forwardedRef: Ref<HTMLDivElement>
) {
  return (
    <RAccordion.Content
      className={twMerge(
        'data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <div className="px-1 py-3 sm:px-3">{children}</div>
    </RAccordion.Content>
  )
}
const AccordionContent = React.forwardRef(Content)

export const Accordion = {
  Root: RAccordion.Root,
  Item: AccordionItem,
  Header: AccordionHeader,
  Content: AccordionContent,
}
