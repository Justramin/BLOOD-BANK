import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Donor } from '@/types'
import { format } from 'date-fns'

export const exportToExcel = (donors: Donor[], fileName: string) => {
  const data = donors.map(d => ({
    Name: d.name,
    'Blood Group': d.blood_group,
    Phone: d.phone,
    Megala: (d as any).committees?.name || '',
    Unit: (d as any).units?.name || '',
    'Last Donation': d.last_blood_donating_date ? format(new Date(d.last_blood_donating_date), 'dd/MM/yyyy') : 'N/A',
    Status: d.available ? 'Available' : 'Busy'
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Donors')
  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}

export const exportToPDF = (donors: Donor[], fileName: string) => {
  const doc = new jsPDF()
  
  doc.setFontSize(18)
  doc.text('DYFI Pinarayi Blood Donor List', 14, 22)
  doc.setFontSize(11)
  doc.setTextColor(100)
  doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 30)

  const tableData = donors.map(d => [
    d.name,
    d.blood_group,
    d.phone,
    (d as any).committees?.name || '',
    (d as any).units?.name || '',
    d.available ? 'Available' : 'Busy'
  ])

  autoTable(doc, {
    startY: 35,
    head: [['Name', 'Blood', 'Phone', 'Megala', 'Unit', 'Status']],
    body: tableData,
    headStyles: { fillColor: [225, 29, 72] }, // Primary red
    theme: 'striped'
  })

  doc.save(`${fileName}.pdf`)
}
