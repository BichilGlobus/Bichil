import { Suspense } from "react"
import NewsContent from "./NewsContent"

export default function NewsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Ачаалж байна...</div>}>
      <NewsContent />
    </Suspense>
  )
}
