import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { apiKeysAtom } from '../store'
import { Settings, Eye, EyeOff } from 'lucide-react'

export function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [apiKeys, setApiKeys] = useAtom(apiKeysAtom)
  const [localKeys, setLocalKeys] = useState(apiKeys)
  const [showKeys, setShowKeys] = useState({
    openai: false,
    anthropic: false,
    google: false
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    fetchApiKeys()
  }, [])

  useEffect(() => {
    setLocalKeys(apiKeys)
  }, [apiKeys])

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/keys', { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        setApiKeys({
          openai: data.openai || '',
          anthropic: data.anthropic || '',
          google: data.google || ''
        })
      }
    } catch (error) {
      console.error('Failed to fetch API keys:', error)
    }
  }

  const saveApiKeys = async () => {
    setIsSaving(true)
    setSaveStatus('idle')
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(localKeys)
      })
      
      if (response.ok) {
        setApiKeys(localKeys)
        setSaveStatus('success')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } else {
        setSaveStatus('error')
      }
    } catch (error) {
      console.error('Failed to save API keys:', error)
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleShowKey = (provider: 'openai' | 'anthropic' | 'google') => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }))
  }

  const handleKeyChange = (provider: 'openai' | 'anthropic' | 'google', value: string) => {
    setLocalKeys(prev => ({ ...prev, [provider]: value }))
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-300 hover:border-gray-400 transition-all"
      >
        <Settings className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-700">Settings</span>
        <svg className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-white border border-gray-200 shadow-xl z-20 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">API Keys</h3>
              <p className="text-xs text-gray-500 mt-1">Enter your API keys to use the AI models</p>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  OpenAI API Key
                </label>
                <div className="relative">
                  <input
                    type={showKeys.openai ? 'text' : 'password'}
                    value={localKeys.openai}
                    onChange={(e) => handleKeyChange('openai', e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-3 py-2 pr-10 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:border-gray-400 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowKey('openai')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  >
                    {showKeys.openai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Google (Gemini) API Key
                </label>
                <div className="relative">
                  <input
                    type={showKeys.google ? 'text' : 'password'}
                    value={localKeys.google}
                    onChange={(e) => handleKeyChange('google', e.target.value)}
                    placeholder="AIza..."
                    className="w-full px-3 py-2 pr-10 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:border-gray-400 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowKey('google')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  >
                    {showKeys.google ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  Anthropic API Key
                </label>
                <div className="relative">
                  <input
                    type={showKeys.anthropic ? 'text' : 'password'}
                    value={localKeys.anthropic}
                    onChange={(e) => handleKeyChange('anthropic', e.target.value)}
                    placeholder="sk-ant-..."
                    className="w-full px-3 py-2 pr-10 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:border-gray-400 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowKey('anthropic')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  >
                    {showKeys.anthropic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={saveApiKeys}
                disabled={isSaving}
                className="w-full py-2 px-4 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : saveStatus === 'success' ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved!
                  </>
                ) : (
                  'Save API Keys'
                )}
              </button>
              {saveStatus === 'error' && (
                <p className="text-xs text-red-500 mt-2 text-center">Failed to save. Please try again.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
