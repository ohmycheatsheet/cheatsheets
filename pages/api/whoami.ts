import { NextApiResponse } from 'next'
import { NextApiRequest } from '~/interface'

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const results = {
      name: process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER,
    }
    res.status(200).json(results)
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: (err as any).message })
  }
}
