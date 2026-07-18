import { ArrowLeft, ArrowRight, Building2, Check, Landmark, MapPinned, Shield, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const STEPS = [
  { icon: Landmark, title: 'Set the imperial policy', copy: 'Council decisions establish the political and material limits of the next seasons. Read the argument and disclosed effects before choosing.' },
  { icon: Building2, title: 'Inspect a public work', copy: 'Select a project in the lower dock. Its full cost, labor, duration, completion season, and city effects appear before you commit.' },
  { icon: MapPinned, title: 'Choose the site', copy: 'Select a district on the map, then commission the project. Gold markers show a district strength; locked sites explain the prerequisite they lack.' },
  { icon: Shield, title: 'Guard the empire', copy: 'Move field forces through the capital reserve. Every reinforcement leaves another theater or the city with less protection.' },
  { icon: ArrowRight, title: 'Read the coming pressure', copy: 'The next seasonal pressure is disclosed in advance. Build and allocate with that approaching test in mind.' },
  { icon: Check, title: 'End the season', copy: 'Advance only when the council is resolved. The report records completed works, earned relationships, events, and the consequences of your orders.' },
]

export default function WalkthroughOverlay({ open, onClose }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!open) return undefined
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') setStep((current) => Math.min(current + 1, STEPS.length - 1))
      if (event.key === 'ArrowLeft') setStep((current) => Math.max(current - 1, 0))
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null
  const current = STEPS[step]
  const Icon = current.icon
  return <div className="modal-backdrop walkthrough-backdrop">
    <section className="walkthrough-panel" role="dialog" aria-modal="true" aria-labelledby="walkthrough-title">
      <button className="panel-close" onClick={onClose} aria-label="Close walkthrough"><X aria-hidden="true" /></button>
      <small>Campaign walkthrough · {step + 1} of {STEPS.length}</small>
      <div className="walkthrough-icon"><Icon aria-hidden="true" /></div>
      <h1 id="walkthrough-title">{current.title}</h1>
      <p>{current.copy}</p>
      <div className="step-dots" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
        {STEPS.map((item, index) => <i key={item.title} className={index === step ? 'active' : ''} />)}
      </div>
      <footer>
        <button className="secondary-button" onClick={() => setStep((value) => Math.max(value - 1, 0))} disabled={step === 0}><ArrowLeft aria-hidden="true" /> Back</button>
        {step === STEPS.length - 1
          ? <button onClick={onClose}><Check aria-hidden="true" /> Begin campaign</button>
          : <button onClick={() => setStep((value) => value + 1)}>Next <ArrowRight aria-hidden="true" /></button>}
      </footer>
    </section>
  </div>
}
