import type { EntryCategory } from '@types'

export const categoriesColors: Record<EntryCategory, string> = {
  vacation: '0, 150, 136', // #009688
  work: '66, 133, 244', // #4285F4
  family: '227, 23, 47', // #E3172F
  friends: '254, 136, 1', // #FE8801
  home: '20, 171, 235', // #14ABEB
  birthday: '244, 190, 64', // #F4BE40
  project: '121, 134, 203', // #7986CB
}

export const questions: Record<string, string> = {
  '7d2367be-91e5-4b52-88d9-6995acaf9cbf': 'What were my top 3 achievements?',
  '06cdb060-b5e7-42f8-9222-bbfa5512f15d': 'What are my 3 favorite memories?',
  '6ab486a4-3d2d-41fd-ae0d-154e64db0b41': 'What 3 habits helped me most?',
  'a711ac02-d2c2-441b-b82b-f89074a5ddca': 'What were the 3 things that drained my energy?',
  'b8d6ee22-22fe-4e85-83b4-1e2149652c20': 'What were the top 3 books I read?',
  '3fe4d3a9-e0ed-4f13-afee-5610d0b57788': 'What were the top 3 things I learned?',
  '18a9e674-daf0-4c35-9ff0-4a93b83a11e2': 'What travels have I made this year?',
  '9d6ecf1e-82f7-47db-b5d5-91e1fc0a2c6f': 'What skill/passion/activity did I develop this year?',
  '62890662-4fb1-4915-b9dc-d8019bd7237c':
    'Has my mind changed on any of the following areas? Explain',
}
