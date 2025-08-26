import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    label: string
    type: 'increase' | 'decrease' | 'neutral'
  }
  variant?: 'default' | 'primary' | 'secondary'
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon,
  trend,
  variant = 'default'
}: StatsCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          card: 'luxury-gradient text-cream-light',
          title: 'text-cream-light/90',
          value: 'text-cream-light',
          description: 'text-cream-light/80',
          icon: 'text-cream-light',
          iconBg: 'bg-cream-light/20'
        }
      case 'secondary':
        return {
          card: 'bg-gradient-to-br from-cream to-cream-light border-cream-dark/20',
          title: 'text-burgundy',
          value: 'text-text-primary',
          description: 'text-text-secondary',
          icon: 'text-burgundy',
          iconBg: 'bg-burgundy/10'
        }
      default:
        return {
          card: 'bg-white border-cream-dark/20',
          title: 'text-text-secondary',
          value: 'text-text-primary',
          description: 'text-text-muted',
          icon: 'text-burgundy',
          iconBg: 'bg-burgundy/10'
        }
    }
  }

  const styles = getVariantStyles()

  const getTrendIcon = () => {
    if (!trend) return null
    switch (trend.type) {
      case 'increase':
        return <TrendingUp className="h-3 w-3" />
      case 'decrease':
        return <TrendingDown className="h-3 w-3" />
      default:
        return <Minus className="h-3 w-3" />
    }
  }

  const getTrendColor = () => {
    if (!trend) return ''
    switch (trend.type) {
      case 'increase':
        return variant === 'primary' ? 'text-green-200' : 'text-green-600'
      case 'decrease':
        return variant === 'primary' ? 'text-red-200' : 'text-red-600'
      default:
        return variant === 'primary' ? 'text-cream-light/70' : 'text-text-muted'
    }
  }

  return (
    <div className={cn(
      "group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer border luxury-shadow hover:luxury-shadow-lg",
      styles.card
    )}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 overflow-hidden rounded-2xl">
        <Icon className="w-full h-full transform rotate-12 translate-x-4 -translate-y-4" />
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={cn(
          "text-sm font-inter font-medium tracking-wide uppercase",
          styles.title
        )}>
          {title}
        </h3>
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
          styles.iconBg
        )}>
          <Icon className={cn("h-5 w-5", styles.icon)} />
        </div>
      </div>

      {/* Main Value */}
      <div className={cn(
        "text-3xl font-playfair font-semibold mb-2 tracking-tight",
        styles.value
      )}>
        {value}
      </div>

      {/* Description */}
      {description && (
        <p className={cn(
          "text-sm font-inter mb-3",
          styles.description
        )}>
          {description}
        </p>
      )}

      {/* Trend */}
      {trend && (
        <div className="flex items-center gap-2 pt-3 border-t border-current border-opacity-10">
          <div className={cn(
            "flex items-center gap-1 text-xs font-inter font-medium",
            getTrendColor()
          )}>
            {getTrendIcon()}
            <span>
              {trend.type === 'increase' && '+'}
              {trend.value}%
            </span>
          </div>
          <span className={cn(
            "text-xs font-inter",
            variant === 'primary' ? 'text-cream-light/70' : 'text-text-muted'
          )}>
            {trend.label}
          </span>
        </div>
      )}
    </div>
  )
}