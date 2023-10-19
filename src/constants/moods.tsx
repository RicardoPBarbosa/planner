import { MoodType } from '@types'

import { ReactComponent as Great } from 'assets/emojis/great.svg'
import { ReactComponent as Cool } from 'assets/emojis/cool.svg'
import { ReactComponent as Ok } from 'assets/emojis/ok.svg'
import { ReactComponent as Sad } from 'assets/emojis/sad.svg'
import { ReactComponent as Wasted } from 'assets/emojis/wasted.svg'

type Props = {
  className?: string
}

export function moods(props?: Props) {
  return {
    [MoodType.WASTED]: <Wasted className={props?.className || 'w-6 h-6 inline'} />,
    [MoodType.SAD]: <Sad className={props?.className || 'w-6 h-6 inline'} />,
    [MoodType.OK]: <Ok className={props?.className || 'w-6 h-6 inline'} />,
    [MoodType.COOL]: <Cool className={props?.className || 'w-6 h-6 inline'} />,
    [MoodType.GREAT]: <Great className={props?.className || 'w-6 h-6 inline'} />,
  }
}
