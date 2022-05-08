import { useCallback } from 'react'
import { useRouter } from 'next/router'

export const useCreateIssue = () => {
  const router = useRouter()
  const handleCreateIssue = useCallback(() => {
    router.push(
      `https://www.github.com/${process.env.VERCEL_GIT_REPO_OWNER}/cheatsheets/issues/new`,
    )
  }, [router])
  return {
    handleCreateIssue,
  }
}
