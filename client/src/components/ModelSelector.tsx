import { useState } from 'react'
import { useAtom } from 'jotai'
import { modelsAtom, selectedModelAtom } from '../store'

export function ModelSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [models] = useAtom(modelsAtom)
  const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom)

  const providerColors: Record<string, string> = {
    openai: 'bg-green-500',
    anthropic: 'bg-orange-500',
    google: 'bg-blue-500'
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-300 hover:border-gray-400 transition-all"
      >
        <div className={`w-2 h-2 rounded-full ${providerColors[selectedModel.provider]}`}></div>
        <span className="text-sm text-gray-700">{selectedModel.name}</span>
        <svg className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white border border-gray-200 shadow-xl z-20 overflow-hidden">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setSelectedModel(model)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all ${
                  selectedModel.id === model.id ? 'bg-gray-100' : ''
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${providerColors[model.provider]}`}></div>
                <div className="text-left">
                  <div className="text-sm text-gray-800">{model.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{model.provider}</div>
                </div>
                {selectedModel.id === model.id && (
                  <svg className="w-4 h-4 text-black ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
