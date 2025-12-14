/**
 * Centralized logging utility
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  metadata?: Record<string, any>
  error?: Error
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, metadata, error } = entry
    const parts = [`[${timestamp}] [${level.toUpperCase()}] ${message}`]
    
    if (metadata && Object.keys(metadata).length > 0) {
      parts.push(`Metadata: ${JSON.stringify(metadata)}`)
    }
    
    if (error) {
      parts.push(`Error: ${error.message}`)
      if (error.stack && this.isDevelopment) {
        parts.push(`Stack: ${error.stack}`)
      }
    }
    
    return parts.join(' | ')
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata,
      error,
    }

    const formatted = this.formatMessage(entry)

    switch (level) {
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formatted)
        }
        break
      case 'info':
        console.log(formatted)
        break
      case 'warn':
        console.warn(formatted)
        break
      case 'error':
        console.error(formatted)
        // In production, send to error tracking service
        if (!this.isDevelopment && process.env.NEXT_PUBLIC_SENTRY_DSN) {
          // Could integrate Sentry here
        }
        break
    }

    // In production, could send to logging service (e.g., LogRocket, Datadog)
  }

  debug(message: string, metadata?: Record<string, any>) {
    this.log('debug', message, metadata)
  }

  info(message: string, metadata?: Record<string, any>) {
    this.log('info', message, metadata)
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.log('warn', message, metadata)
  }

  error(message: string, error?: Error, metadata?: Record<string, any>) {
    this.log('error', message, metadata, error)
  }
}

export const logger = new Logger()

