import { logger } from '@/lib/logger'

describe('Logger', () => {
  let consoleSpy: jest.SpyInstance

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()
    jest.spyOn(console, 'warn').mockImplementation()
    jest.spyOn(console, 'debug').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should log info messages', () => {
    logger.info('Test message')
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[INFO] Test message')
    )
  })

  it('should log error messages with error object', () => {
    const error = new Error('Test error')
    logger.error('Error occurred', error)
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('[ERROR] Error occurred')
    )
  })

  it('should include metadata in logs', () => {
    logger.info('Test message', { userId: '123', action: 'test' })
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('userId')
    )
  })
})

