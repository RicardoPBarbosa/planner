import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import updateLocale from 'dayjs/plugin/updateLocale'
import localeData from 'dayjs/plugin/localeData'
import utc from 'dayjs/plugin/utc'
import dayOfYear from 'dayjs/plugin/dayOfYear'

dayjs.extend(weekOfYear)
dayjs.extend(updateLocale)
dayjs.extend(localeData)
dayjs.extend(utc)
dayjs.extend(dayOfYear)
dayjs.updateLocale('en', {
  weekStart: 1,
})

const localDayjs = dayjs
export default localDayjs
