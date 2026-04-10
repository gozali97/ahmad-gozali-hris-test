import * as React from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/**
 * Velzon-style form field — label + control + error + help text.
 *
 * Props (common):
 *  label        — string label text
 *  required     — adds red asterisk
 *  error        — error string or array
 *  helpText     — small text below control
 *  className    — wrapper className
 *  horizontal   — if true, label & control are side-by-side (lg+)
 *
 * Render modes:
 *  1. children  — render whatever you pass as the control
 *  2. type="select" + options + value + onValueChange
 *  3. type="textarea" + value + onChange + rows
 *  4. default   — <Input /> with all remaining props forwarded
 */
export function FormField({
  label,
  required = false,
  error,
  helpText,
  className,
  horizontal = false,
  children,
  // Select-specific
  type,
  options,
  value,
  onValueChange,
  placeholder,
  // Textarea-specific
  rows,
  // Everything else goes to <Input>
  ...inputProps
}) {
  const errorMsg = Array.isArray(error) ? error[0] : error
  const id = inputProps.id || inputProps.name || label?.toLowerCase().replace(/\s+/g, '-')

  // ---- control ----
  let control
  if (children) {
    control = children
  } else if (type === 'select') {
    control = (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} className={cn('w-full', error && 'border-destructive')}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options?.map((opt) => {
            const optValue = typeof opt === 'object' ? String(opt.value) : String(opt)
            const optLabel = typeof opt === 'object' ? opt.label : opt
            return (
              <SelectItem key={optValue} value={optValue}>
                {optLabel}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    )
  } else if (type === 'textarea') {
    control = (
      <Textarea
        id={id}
        rows={rows ?? 3}
        value={value}
        placeholder={placeholder}
        className={cn(error && 'border-destructive')}
        {...inputProps}
      />
    )
  } else {
    control = (
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        className={cn(error && 'border-destructive')}
        {...inputProps}
      />
    )
  }

  return (
    <div
      className={cn(
        horizontal
          ? 'grid grid-cols-1 lg:grid-cols-[180px_1fr] lg:items-start gap-1.5 lg:gap-4'
          : 'space-y-1.5',
        className,
      )}
    >
      {label && (
        <Label htmlFor={id} className="text-[13px] font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
      )}
      <div className="space-y-1">
        {control}
        {helpText && !errorMsg && (
          <p className="text-xs text-muted-foreground">{helpText}</p>
        )}
        {errorMsg && <p className="text-xs text-destructive">{errorMsg}</p>}
      </div>
    </div>
  )
}
