import { useState } from 'react'
import { useAtom } from 'jotai'
import { modelsAtom, selectedModelAtom } from '../store'

export function ModelSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [models] = useAtom(modelsAtom)
  const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom)

  const providerColors: Record<string, string> = {
    openai: 'from-green-500 to-emerald-600',
    anthropic: 'from-orange-500 to-amber-600',
    google: 'from-blue-500 to-cyan-600'
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-purple-500/30 hover:border-purple-500/50 transition-all"
      >
        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${providerColors[selectedModel.provider]}`}></div>
        <span className="text-sm text-white/80">{selectedModel.name}</span>
        <svg className={`w-4 h-4 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-gray-900/95 border border-purple-500/30 shadow-xl shadow-black/50 z-20 overflow-hidden">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setSelectedModel(model)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all ${
                  selectedModel.id === model.id ? 'bg-purple-600/20' : ''
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${providerColors[model.provider]}`}></div>
                <div className="text-left">
                  <div className="text-sm text-white/90">{model.name}</div>
                  <div className="text-xs text-white/50 capitalize">{model.provider}</div>
                </div>
                {selectedModel.id === model.id && (
                  <svg className="w-4 h-4 text-purple-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
