import { AnalyticsOverview } from './AnalyticsOverview'
import { VolumeChart } from './VolumeChart'
// import { GeographicDistribution } from './GeographicDistribution'
import { PaymentMethods } from './PaymentMethods'

export function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into your Nexus PAY platform performance.
        </p>
      </div>

      <AnalyticsOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VolumeChart />
        <PaymentMethods />
      </div>
      
      {/* <GeographicDistribution /> */}
    </div>
  )
}