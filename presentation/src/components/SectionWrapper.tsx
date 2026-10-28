import React, { useEffect, useRef, useState } from 'react'

interface SectionWrapperProps {
  id?: string
  className?: string
  children: React.ReactNode
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({ id, className = '', children }) => {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (ref.current) observer.unobserve(ref.current)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    const el = ref.current
    if (el) observer.observe(el)

    return () => {
      if (el) observer.unobserve(el)
    }
  }, [])

  return (
    <section
      id={id}
      ref={ref}
      className={`section fade-in-section ${isVisible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </section>
  )
}
