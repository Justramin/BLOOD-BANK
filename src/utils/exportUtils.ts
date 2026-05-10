import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Donor, Donation } from '@/types'
import { format } from 'date-fns'

export const exportToExcel = (donors: Donor[], fileName: string) => {
  const data = donors.map((d, idx) => ({
    'SI NO': idx + 1,
    Name: d.name,
    'Blood Group': d.blood_group,
    Phone: d.phone,
    Committee: d.committees?.name || '',
    Unit: d.units?.name || '',
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

  const tableData = donors.map((d, idx) => [
    idx + 1,
    d.name,
    d.blood_group,
    d.phone,
    d.committees?.name || '',
    d.units?.name || '',
    d.available ? 'Available' : 'Busy'
  ])

  autoTable(doc, {
    startY: 35,
    head: [['SI NO', 'Name', 'Blood', 'Phone', 'Committee', 'Unit', 'Status']],
    body: tableData,
    headStyles: { fillColor: [225, 29, 72] }, // Primary red
    theme: 'striped'
  })

  doc.save(`${fileName}.pdf`)
}

export const exportDonationsToExcel = (donations: Donation[], fileName: string) => {
  const data = donations.map((d, idx) => ({
    'SI NO': idx + 1,
    'Donor Name': d.donor?.name || '',
    'Phone Number': d.donor?.phone || '',
    'Blood Group': d.donor?.blood_group || '',
    'Hospital Name': d.hospital_name || 'N/A',
    'Donation Date': d.donation_date ? format(new Date(d.donation_date), 'dd/MM/yyyy') : 'N/A',
    'Megala Committee': d.donor?.committees?.name || '',
    'Unit Committee': d.donor?.units?.name || ''
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Donation Records')
  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}

export const exportDonationsToPDF = (donations: Donation[], fileName: string) => {
  const doc = new jsPDF('landscape')
  
  doc.setFontSize(18)
  doc.text('DYFI Pinarayi Blood Donation Records', 14, 22)
  doc.setFontSize(11)
  doc.setTextColor(100)
  doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 30)

  const tableData = donations.map((d, idx) => [
    idx + 1,
    d.donor?.name || '',
    d.donor?.phone || '',
    d.donor?.blood_group || '',
    d.hospital_name || 'N/A',
    d.donation_date ? format(new Date(d.donation_date), 'dd/MM/yyyy') : 'N/A',
    d.donor?.committees?.name || '',
    d.donor?.units?.name || ''
  ])

  autoTable(doc, {
    startY: 35,
    head: [['SI NO', 'Donor Name', 'Phone', 'Blood', 'Hospital', 'Date', 'Megala Committee', 'Unit Committee']],
    body: tableData,
    headStyles: { fillColor: [225, 29, 72] },
    theme: 'striped'
  })

  doc.save(`${fileName}.pdf`)
}
