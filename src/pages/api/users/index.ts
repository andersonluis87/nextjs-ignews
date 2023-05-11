import type { NextApiRequest, NextApiResponse } from 'next'

type Users = {
  id: number
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Users[]>
) {
  const users: Users[] = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' },
    { id: 3, name: 'John Smith' },
    { id: 4, name: 'Jane Smith' },
    { id: 5, name: 'Johnny Doe' },
  ]

  res.status(200).json(users)
}
