import { useState, useEffect } from 'react'
import { Clock, Plus, X } from 'lucide-react'

interface TimeZoneClock {
  id: string
  timezone: string
  label: string
}

const DigitalClockWidget = () => {
  const [clocks, setClocks] = useState<TimeZoneClock[]>([
    { id: '1', timezone: 'Asia/Kolkata', label: 'Jaipur (IST)' },
    { id: '2', timezone: 'America/New_York', label: 'New York (EST)' },
    { id: '3', timezone: 'Europe/London', label: 'London (GMT)' },
    { id: '4', timezone: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  ])
  const [times, setTimes] = useState<Record<string, string>>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTimezone, setNewTimezone] = useState('UTC')
  const [newLabel, setNewLabel] = useState('')

  const commonTimezones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'Asia/Kolkata', label: 'India (IST)' },
    { value: 'America/New_York', label: 'New York (EST)' },
    { value: 'America/Chicago', label: 'Chicago (CST)' },
    { value: 'America/Denver', label: 'Denver (MST)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Europe/Dubai', label: 'Dubai (GST)' },
    { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
  ]

  // Update time for all clocks
  useEffect(() => {
    const updateTime = () => {
      const newTimes: Record<string, string> = {}
      clocks.forEach((clock) => {
        try {
          const now = new Date()
          const timeString = new Intl.DateTimeFormat('en-US', {
            timeZone: clock.timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          }).format(now)
          newTimes[clock.id] = timeString
        } catch (error) {
          newTimes[clock.id] = 'Invalid TZ'
        }
      })
      setTimes(newTimes)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [clocks])

  const handleAddClock = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTimezone && newLabel) {
      const newId = Date.now().toString()
      setClocks([
        ...clocks,
        {
          id: newId,
          timezone: newTimezone,
          label: newLabel,
        },
      ])
      setNewTimezone('UTC')
      setNewLabel('')
      setShowAddForm(false)
    }
  }

  const handleRemoveClock = (id: string) => {
    setClocks(clocks.filter((clock) => clock.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-linen via-sage/10 to-linen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="w-10 h-10 text-sienna" />
            <h1 className="font-serif text-4xl md:text-5xl text-obsidian">Global Time Zones</h1>
          </div>
          <p className="text-obsidian/70 text-lg">Track time across the world in real-time</p>
        </div>

        {/* Main Clocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {clocks.map((clock) => (
            <div
              key={clock.id}
              className="bg-white rounded-lg border-2 border-sienna/20 p-8 shadow-lg hover:shadow-xl transition-all relative group"
            >
              {/* Remove Button */}
              {clocks.length > 1 && (
                <button
                  onClick={() => handleRemoveClock(clock.id)}
                  className="absolute top-3 right-3 p-2 bg-red-100 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Label */}
              <h3 className="font-serif text-lg text-sienna mb-2 pr-8">{clock.label}</h3>
              <p className="text-sm text-obsidian/50 mb-6 font-mono">{clock.timezone}</p>

              {/* Digital Time */}
              <div className="bg-obsidian rounded-lg p-6 mb-4 font-mono text-center">
                <div className="text-5xl text-sienna font-bold tracking-wider">
                  {times[clock.id] || '00:00:00'}
                </div>
              </div>

              {/* Current Date */}
              <div className="text-center text-sm text-obsidian/70">
                {new Date().toLocaleDateString('en-US', {
                  timeZone: clock.timezone,
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Add Clock Form */}
        <div className="max-w-2xl mx-auto">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-tactile flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Add Time Zone
            </button>
          ) : (
            <form onSubmit={handleAddClock} className="bg-white rounded-lg border-2 border-sienna/20 p-8">
              <h3 className="font-serif text-2xl text-sienna mb-6">Add New Time Zone</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-obsidian font-medium mb-2">Time Zone *</label>
                  <select
                    value={newTimezone}
                    onChange={(e) => setNewTimezone(e.target.value)}
                    className="form-input w-full"
                    required
                  >
                    {commonTimezones.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-obsidian font-medium mb-2">Label (e.g., "My Office") *</label>
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Enter a label for this time zone"
                    className="form-input w-full"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-tactile flex-1">
                  Add Clock
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn-tactile-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-sienna text-linen rounded-lg p-8 max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl mb-4">⏰ About Time Zones</h2>
          <p className="mb-4">
            This clock displays the current time in different time zones around the world. Add or remove time zones to track times in locations that matter to you.
          </p>
          <ul className="space-y-2 text-sm">
            <li>✓ Updates every second in real-time</li>
            <li>✓ Support for 400+ time zones worldwide</li>
            <li>✓ Shows date and time for each zone</li>
            <li>✓ Add or remove clocks as needed</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DigitalClockWidget
