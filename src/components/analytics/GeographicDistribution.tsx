import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { Globe, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

const DEMO_COUNTRIES = [
  { name: 'United States', code: 'US', volume: 8947293, percentage: 34.2, growth: 12.4, flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', volume: 4523847, percentage: 17.3, growth: 8.7, flag: '🇬🇧' },
  { name: 'Germany', code: 'DE', volume: 3829472, percentage: 14.6, growth: 15.2, flag: '🇩🇪' },
  { name: 'Japan', code: 'JP', volume: 2947382, percentage: 11.3, growth: 6.8, flag: '🇯🇵' },
  { name: 'Canada', code: 'CA', volume: 2183947, percentage: 8.4, growth: 9.3, flag: '🇨🇦' },
  { name: 'Australia', code: 'AU', volume: 1837294, percentage: 7.0, growth: 11.7, flag: '🇦🇺' },
  { name: 'Singapore', code: 'SG', volume: 1294738, percentage: 4.9, growth: 18.4, flag: '🇸🇬' },
  { name: 'Netherlands', code: 'NL', volume: 637285, percentage: 2.4, growth: 7.2, flag: '🇳🇱' },
]

export function GeographicDistribution() {
  const [countries, setCountries] = useState<any[]>(DEMO_COUNTRIES)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    const fetchGeo = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('nexus-user') || '{}')
        let res: any[] = []

        if (user.role === 'merchant') {
          const stats = await api.getMerchantGeoStats()
          res = stats.map(s => ({
            code: s.country_code,
            name: s.country_code, // We only have code from backend currently
            volume: s.volume_usd,
            percentage: 0, // Backend doesn't provide % per country
            growth: 0 // Backend doesn't provide growth per country
          }))
        } else {
          res = await api.getGeographicAnalytics()
        }

        if (res && res.length > 0) {
          const totalVolume = res.reduce((sum, c) => sum + (c.volume || 0), 0)
          const withFlags = res.map(c => ({
            ...c,
            percentage: totalVolume > 0 ? parseFloat(((c.volume / totalVolume) * 100).toFixed(1)) : 0,
            flag: getFlagEmoji(c.code)
          }))
          setCountries(withFlags)
          setIsLive(true)
        }
      } catch (e) {
        console.warn("Using demo data for GeographicDistribution")
      }
    }

    fetchGeo()
  }, [])

  const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  return (
    <Card className="hover-glow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-white/80" />
            <span>Geographic Distribution</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Transaction volume by country (last 30 days)
          </p>
        </div>
        {isLive && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] text-purple-500 font-medium uppercase tracking-wider">Live</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {countries.map((country, index) => (
            <div
              key={country.code}
              className="flex items-center justify-between p-4 glass-card rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{country.flag}</span>
                  <div className="w-8 h-8 rounded-full gateway-dark-gradient flex items-center justify-center text-sm font-bold text-white">
                    #{index + 1}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-white">{country.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {country.percentage}% of total volume
                  </div>
                </div>
              </div>
              
              <div className="text-right space-y-1">
                <div className="font-semibold text-white">
                  {formatCurrency(country.volume)}
                </div>
                <div className="flex items-center space-x-1 text-sm text-green-500">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{country.growth}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 glass-card rounded-lg">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Total Global Volume</div>
            <div className="text-3xl font-bold gradient-text">
              {formatCurrency(countries.reduce((sum, country) => sum + country.volume, 0))}
            </div>
            {!isLive && (
              <div className="mt-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                Demo Data Mode
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}