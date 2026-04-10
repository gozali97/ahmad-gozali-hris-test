/**
 * Utility untuk export data ke file CSV
 * @param {string} filename - Nama file (tanpa .csv)
 * @param {string[]} headers - Array nama kolom header
 * @param {Array<Array<string|number>>} rows - Array of row arrays
 */
export function exportToCsv(filename, headers, rows) {
  const escape = (val) => {
    if (val === null || val === undefined) return ''
    const str = String(val)
    // Escape double-quotes and wrap fields containing comma/newline/quote
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const csvContent = [
    headers.map(escape).join(','),
    ...rows.map((row) => row.map(escape).join(',')),
  ].join('\r\n')

  const BOM = '\uFEFF' // UTF-8 BOM agar Excel baca karakter Indonesia dengan benar
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Format tanggal untuk CSV (YYYY-MM-DD)
 */
export function fmtDate(dateStr) {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    })
  } catch {
    return dateStr
  }
}
