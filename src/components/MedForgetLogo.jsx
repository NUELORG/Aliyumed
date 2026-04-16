import styles from './MedForgetLogo.module.css'

const LOGO_SRC = '/medforget-brand.png'

export default function MedForgetLogo({ variant = 'full', size = 'md', className = '' }) {
  const rootClass = [styles.root, styles[size], variant === 'mark' ? styles.markOnly : '', className]
    .filter(Boolean)
    .join(' ')

  const markImg = (alt) => (
    <span className={styles.markWrap}>
      <img
        src={LOGO_SRC}
        alt={alt}
        className={styles.markImg}
        width={256}
        height={256}
        decoding="async"
      />
    </span>
  )

  if (variant === 'mark') {
    return (
      <span className={rootClass} title="MedForget">
        {markImg('MedForget')}
      </span>
    )
  }

  if (variant === 'lockup') {
    return (
      <span className={rootClass}>
        {markImg('')}
        <span className={styles.lockupText}>
          <span className={styles.brand}>MedForget</span>
        </span>
      </span>
    )
  }

  return (
    <span className={rootClass}>
      {markImg('')}
      <span className={styles.textBlock}>
        <span className={styles.brand}>MedForget</span>
        <span className={styles.tagline}>Dose memory, on your device</span>
      </span>
    </span>
  )
}
