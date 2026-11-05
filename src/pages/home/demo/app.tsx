import CanvaPage from '@/pages/home/demo/pages/canva'
import { TooltipProvider } from '@/pages/home/demo/components/ui/tooltip'
import { Toaster } from '@/pages/home/demo/components/ui/sonner'

export default function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <div className="flex h-full min-h-0 flex-col">
        <CanvaPage />
      </div>
    </TooltipProvider>
  )
}
