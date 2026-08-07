import {
  useEffect,
  useRef,
  useState,
} from 'react'

const steps = [
  [
    'Select ingredients',
    'Firm mangoes, lemons, garlic, and vegetables are chosen for texture and flavor.',
  ],
  [
    'Prepare with traditional spices',
    'Mustard, chilli, fenugreek, and aromatics are measured for balance.',
  ],
  [
    'Rest for flavour',
    'Pickles are given time to mature so the spice and oil settle well.',
  ],
  [
    'Pack with care',
    'Finished batches are packed into clean jars and prepared for delivery.',
  ],
]

const animationDelays = [
  'delay-100',
  'delay-200',
  'delay-300',
  'delay-[400ms]',
]

function ProcessSection() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const section = sectionRef.current

    if (!section) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.25,
        rootMargin: '0px 0px -80px 0px',
      },
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-brand-dark py-16 text-white"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div
          className={`mb-8 max-w-2xl transition-all duration-700 ease-out ${
            isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-12 opacity-0'
          }`}
        >
          <p className="mb-2 text-sm font-bold uppercase">
            How it is made
          </p>

          <h2 className="font-[Georgia,serif] text-3xl font-bold">
            A patient, traditional process
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, text], index) => (
            <article
              key={title}
              className={`border-l border-brand pl-5 transition-all duration-700 ease-out ${
                animationDelays[index]
              } ${
                isVisible
                  ? 'translate-x-0 translate-y-0 opacity-100'
                  : '-translate-x-8 translate-y-10 opacity-0'
              }`}
            >
              <span className="text-sm font-bold text-brand">
                0{index + 1}
              </span>

              <h3 className="mt-2 font-[Georgia,serif] text-xl font-bold">
                {title}
              </h3>

              <p className="mt-3 leading-7 text-brand-light">
                {text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProcessSection