import { useState, useRef } from 'react'

function App() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [translation, setTranslation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef(null)

  const API_URL = 'https://dfee2447dbfa.ngrok-free.app/translate'

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile)
      setError('')
      setTranslation('')
      const videoURL = URL.createObjectURL(selectedFile)
      setPreview(videoURL)
    } else {
      setError('Please select a valid video file')
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a video file first')
      return
    }

    setLoading(true)
    setError('')
    setTranslation('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      setTranslation(data.translation || data.text || JSON.stringify(data))
    } catch (err) {
      setError(`Failed to translate: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setTranslation('')
    setError('')
    setCopied(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(translation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const styles = {
    app: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      margin: 0,
    },
    container: {
      maxWidth: '900px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
      color: 'white',
    },
    logo: {
      width: '100px',
      height: '100px',
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1.5rem',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      animation: 'float 3s ease-in-out infinite',
    },
    title: {
      fontSize: '3.5rem',
      fontWeight: '800',
      marginBottom: '0.75rem',
      letterSpacing: '-0.02em',
      textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      margin: '0 0 0.75rem 0',
    },
    subtitle: {
      fontSize: '1.25rem',
      opacity: 0.95,
      fontWeight: '500',
      margin: 0,
    },
    card: {
      background: 'rgba(255, 255, 255, 0.98)',
      borderRadius: '24px',
      padding: '3rem 2rem',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(10px)',
      marginBottom: '2rem',
    },
    dropzone: {
      border: `3px dashed ${dragActive ? '#667eea' : '#e2e8f0'}`,
      borderRadius: '20px',
      padding: file ? '2rem' : '4rem 2rem',
      background: dragActive ? 'rgba(102, 126, 234, 0.05)' : 'transparent',
      cursor: file ? 'default' : 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center',
    },
    uploadIcon: {
      width: '80px',
      height: '80px',
      margin: '0 auto 2rem',
      color: '#667eea',
    },
    uploadTitle: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '0.75rem',
      margin: '0 0 0.75rem 0',
    },
    uploadDesc: {
      fontSize: '1.125rem',
      color: '#64748b',
      marginBottom: '2rem',
      margin: '0 0 2rem 0',
    },
    formats: {
      display: 'flex',
      gap: '0.75rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    formatBadge: {
      padding: '0.5rem 1.25rem',
      background: '#f1f5f9',
      borderRadius: '100px',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#64748b',
    },
    videoPreview: {
      width: '100%',
      maxHeight: '400px',
      borderRadius: '16px',
      marginBottom: '1.5rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    },
    fileDetails: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1.25rem',
      background: '#f8fafc',
      borderRadius: '12px',
    },
    fileIcon: {
      width: '48px',
      height: '48px',
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15))',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#667eea',
      flexShrink: 0,
    },
    fileMeta: {
      flex: 1,
      textAlign: 'left',
    },
    fileName: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '0.25rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      margin: '0 0 0.25rem 0',
    },
    fileSize: {
      fontSize: '0.875rem',
      color: '#64748b',
      margin: 0,
    },
    removeBtn: {
      width: '40px',
      height: '40px',
      background: 'transparent',
      border: '2px solid #e2e8f0',
      borderRadius: '10px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#64748b',
      transition: 'all 0.2s ease',
    },
    submitBtn: {
      width: '100%',
      padding: '1.25rem 2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '16px',
      fontSize: '1.125rem',
      fontWeight: '700',
      cursor: 'pointer',
      marginTop: '1.5rem',
      boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
    },
    loadingCard: {
      textAlign: 'center',
      padding: '3rem 2rem',
    },
    spinner: {
      width: '80px',
      height: '80px',
      margin: '0 auto 2rem',
      position: 'relative',
    },
    spinnerRing: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      border: '4px solid transparent',
      borderTopColor: '#667eea',
      borderRadius: '50%',
      animation: 'spin 1.2s linear infinite',
    },
    loadingTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '0.5rem',
      margin: '0 0 0.5rem 0',
    },
    loadingDesc: {
      color: '#64748b',
      fontSize: '1rem',
      margin: 0,
    },
    errorCard: {
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
      padding: '2rem',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginTop: '1.5rem',
    },
    errorIcon: {
      width: '48px',
      height: '48px',
      background: 'rgba(239, 68, 68, 0.15)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ef4444',
      flexShrink: 0,
    },
    errorText: {
      color: '#ef4444',
      fontSize: '1rem',
      fontWeight: '600',
      textAlign: 'left',
      margin: 0,
    },
    resultHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      paddingBottom: '1.5rem',
      borderBottom: '2px solid #f1f5f9',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    resultTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    successIcon: {
      width: '48px',
      height: '48px',
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#10b981',
    },
    resultTitleText: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0,
    },
    copyBtn: {
      padding: '0.75rem 1.5rem',
      background: copied ? '#d1fae5' : '#f8fafc',
      border: `2px solid ${copied ? '#10b981' : '#e2e8f0'}`,
      borderRadius: '10px',
      color: copied ? '#10b981' : '#64748b',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s ease',
    },
    resultContent: {
      background: '#f8fafc',
      borderRadius: '12px',
      padding: '2rem',
      marginBottom: '2rem',
    },
    translationText: {
      fontSize: '1.25rem',
      lineHeight: '1.8',
      color: '#1e293b',
      fontWeight: '500',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      margin: 0,
    },
    newBtn: {
      width: '100%',
      padding: '1rem 2rem',
      background: 'transparent',
      border: '2px solid #667eea',
      borderRadius: '12px',
      color: '#667eea',
      fontSize: '1rem',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      transition: 'all 0.3s ease',
    },
  }

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body, html {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        #root {
          margin: 0;
          padding: 0;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        button:hover {
          transform: translateY(-2px);
        }
        input[type="file"] {
          display: none;
        }
      `}</style>
      
      <div style={styles.app}>
        <div style={styles.container}>
          <header style={styles.header}>
            <div style={styles.logo}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22v-10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 7l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 style={styles.title}>ASL Translator</h1>
            <p style={styles.subtitle}>Transform sign language into text with AI precision</p>
          </header>

          <div style={styles.card}>
            <div
              style={styles.dropzone}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(e.target.files[0])}
              />

              {!file ? (
                <div>
                  <div style={styles.uploadIcon}>
                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 style={styles.uploadTitle}>Upload your video</h3>
                  <p style={styles.uploadDesc}>Drag and drop or click to browse</p>
                  <div style={styles.formats}>
                    <span style={styles.formatBadge}>MP4</span>
                    <span style={styles.formatBadge}>MOV</span>
                    <span style={styles.formatBadge}>AVI</span>
                    <span style={styles.formatBadge}>WebM</span>
                  </div>
                </div>
              ) : (
                <div>
                  {preview && <video src={preview} controls style={styles.videoPreview} />}
                  <div style={styles.fileDetails}>
                    <div style={styles.fileIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div style={styles.fileMeta}>
                      <p style={styles.fileName}>{file.name}</p>
                      <p style={styles.fileSize}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button style={styles.removeBtn} onClick={(e) => { e.stopPropagation(); handleReset(); }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {file && !loading && !translation && (
              <button style={styles.submitBtn} onClick={handleSubmit} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polygon points="10 8 16 12 10 16 10 8"/>
                </svg>
                Translate Video
              </button>
            )}
          </div>

          {loading && (
            <div style={{...styles.card, ...styles.loadingCard}}>
              <div style={styles.spinner}>
                <div style={styles.spinnerRing}/>
              </div>
              <h3 style={styles.loadingTitle}>Processing your video</h3>
              <p style={styles.loadingDesc}>Our AI is analyzing the sign language...</p>
            </div>
          )}

          {error && (
            <div style={styles.errorCard}>
              <div style={styles.errorIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <p style={styles.errorText}>{error}</p>
            </div>
          )}

          {translation && (
            <div style={styles.card}>
              <div style={styles.resultHeader}>
                <div style={styles.resultTitle}>
                  <div style={styles.successIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <h2 style={styles.resultTitleText}>Translation Complete</h2>
                </div>
                <button style={styles.copyBtn} onClick={handleCopy}>
                  {copied ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div style={styles.resultContent}>
                <p style={styles.translationText}>{translation}</p>
              </div>
              <button style={styles.newBtn} onClick={handleReset} onMouseEnter={(e) => { e.target.style.background = '#667eea'; e.target.style.color = 'white'; }} onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#667eea'; }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                </svg>
                Translate Another Video
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App