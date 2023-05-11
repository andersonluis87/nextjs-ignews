import type { NextApiRequest, NextApiResponse } from 'next'

type Users = {
  id: number
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Users | { message: string }>
) {
  const users: Users[] = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' },
    { id: 3, name: 'John Smith' },
    { id: 4, name: 'Jane Smith' },
    { id: 5, name: 'Johnny Doe' },
  ]

  const { id } = req.query
  const user: Users | undefined = users.find((user) => user.id === Number(id))

  if (user) {
    res.status(200).json(user)
  }

  res.status(404).json({ message: 'User not found' })
}
