import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight, ArrowRight, Menu, X, Plus, Users, Clock3, CalendarDays, Check, LayoutDashboard, Building2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import './LandingPage.css'

const modules = [
  {
    id: 'karyawan', label: 'Data karyawan', number: '01',
    description: 'Nama, jabatan, departemen, dan status kerja. Detail yang biasanya tersebar, sekarang punya tempatnya sendiri.',
    columns: ['Karyawan', 'Departemen', 'Jabatan'],
    rows: [['Anggota tim A', 'Human Resources', 'Manager'], ['Anggota tim B', 'Information Technology', 'Staff'], ['Anggota tim C', 'Finance', 'Supervisor']],
    note: 'Cari, filter, dan kelola profil karyawan. Termasuk foto, kontak, serta informasi kepegawaian.',
  },
  {
    id: 'absensi', label: 'Kehadiran harian', number: '02',
    description: 'Mulai dari check-in pertama sampai rekap bulanan. HR dan karyawan melihat catatan kehadiran dengan lebih jelas.',
    columns: ['Karyawan', 'Masuk', 'Pulang'],
    rows: [['Anggota tim A', '08.00', '17.00'], ['Anggota tim B', '08.05', '17.10'], ['Anggota tim C', '07.55', '17.00']],
    note: 'Karyawan mencatat kehadiran. Admin meninjau riwayat, menambahkan catatan manual, dan mengunduh rekap.',
  },
  {
    id: 'cuti', label: 'Pengajuan cuti', number: '03',
    description: 'Pengajuan, kuota, dan keputusan dalam satu alur. Setiap orang tahu apa yang sudah disetujui dan apa yang masih menunggu.',
    columns: ['Pengajuan', 'Jenis', 'Status'],
    rows: [['Anggota tim A', 'Tahunan', 'Disetujui'], ['Anggota tim B', 'Tahunan', 'Menunggu'], ['Anggota tim C', 'Lainnya', 'Ditolak']],
    note: 'Ajukan cuti dari akun karyawan. HR meninjau, memberi keputusan, dan menambahkan catatan.',
  },
]
const access = [
  ['Data karyawan', 'Kelola seluruh tim', 'Lihat profil sendiri'],
  ['Kehadiran', 'Pantau & rekap', 'Check-in & check-out'],
  ['Pengajuan cuti', 'Tinjau & putuskan', 'Ajukan & lihat status'],
  ['Jabatan & departemen', 'Kelola struktur', 'Lihat informasi'],
  ['Laporan CSV', 'Ekspor data', '—'],
]
const questions = [
  ['Bagaimana mendapatkan akun?', 'Akun karyawan dibuat dan dikelola oleh admin HR. Hubungi admin HR perusahaan Anda untuk mendapatkan akses.'],
  ['Apakah data bisa diunduh?', 'Admin dapat mengekspor data karyawan, absensi, dan rekap dalam format CSV.'],
  ['Bagaimana melihat status cuti?', 'Masuk ke akun karyawan dan buka halaman cuti. Anda dapat melihat status pengajuan dan catatan dari admin. Notifikasi perubahan status tersedia saat terhubung ke aplikasi.'],
]
function Wordmark() {
  return <Link to="/" className="hr-wordmark" aria-label="HRIS — beranda">hris<span className="hr-brand-mark" aria-hidden="true"><span /><span /><span /></span></Link>
}

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selected, setSelected] = useState(0)
  const { isAuthenticated, user } = useAuth()
  const destination = isAuthenticated ? (user?.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard') : '/login'
  const action = isAuthenticated ? 'Buka dashboard' : 'Masuk ke aplikasi'
  const current = modules[selected]

  return (
    <div className="hr-landing">
      <a className="hr-skip" href="#konten">Lewati ke konten</a>
      <header className="hr-header hr-container">
        <Wordmark />
        <span className="hr-header-caption">Sistem manajemen<br />sumber daya manusia</span>
        <nav id="hr-navigation" className={menuOpen ? 'hr-navigation is-open' : 'hr-navigation'} aria-label="Navigasi utama">
          <a href="#fitur" onClick={() => setMenuOpen(false)}>Fitur</a>
          <a href="#akses" onClick={() => setMenuOpen(false)}>Hak akses</a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>Bantuan</a>
        </nav>
        <Link to={destination} className="hr-header-login">{action}<ArrowUpRight size={18} /></Link>
        <button className="hr-menu" aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'} aria-controls="hr-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <main id="konten">
        <section className="hr-hero hr-container">
          <div className="hr-hero-copy">
            <div className="hr-hero-label"><span /> Ruang kerja untuk HR & karyawan</div>
            <h1>Tim terkelola.<br />Kerja jadi<br /><em>lebih berarti.</em></h1>
            <p className="hr-hero-description">Satukan data karyawan, kehadiran, dan pengajuan cuti. Beri tim Anda ruang untuk fokus pada pekerjaan yang penting.</p>
            <div className="hr-hero-actions"><Link to={destination} className="hr-primary">{action}<ArrowUpRight size={19} /></Link><a href="#fitur" className="hr-explore-link">Lihat fitur <ArrowRight size={17} /></a></div>
            <div className="hr-hero-details"><span><Check size={14} /> Akses sesuai peran</span><span><Check size={14} /> Data dalam satu tempat</span></div>
          </div>
          <div className="hr-workspace-scene">
            <div className="hr-workspace">
              <div className="hr-workspace-bar"><span className="hr-window-dots" aria-hidden="true"><i /><i /><i /></span><span>Ruang kerja HRIS</span><span className="hr-workspace-avatar">HR</span></div>
              <div className="hr-workspace-inner"><aside aria-hidden="true"><LayoutDashboard /><Users /><Clock3 /><CalendarDays /><Building2 /></aside>
                <div className="hr-workspace-content"><div className="hr-workspace-title"><div><p>KELOLA HARI KERJA ANDA</p><h3>Semua tentang tim.</h3></div><span className="hr-workspace-symbol"><Users size={25} /></span></div>
                  <div className="hr-workspace-modules"><div><span><Users size={19} /></span><strong>Karyawan</strong><small>Kenali tim Anda</small></div><div><span><Clock3 size={19} /></span><strong>Kehadiran</strong><small>Catat setiap hari</small></div><div><span><CalendarDays size={19} /></span><strong>Cuti</strong><small>Kelola pengajuan</small></div></div>
                  <div className="hr-week"><div><h4>Agenda kehadiran</h4><span>Ilustrasi mingguan</span></div><div className="hr-week-days">{['Sen', 'Sel', 'Rab', 'Kam', 'Jum'].map((day, i) => <div key={day} className={i === 2 ? 'is-current' : ''}><span>{day}</span><span>{i < 3 ? <Check size={18} /> : '—'}</span></div>)}</div></div>
                  <div className="hr-workspace-task"><span><CalendarDays size={18} /></span><div><strong>Pengajuan cuti</strong><small>Tinjau permintaan dari anggota tim</small></div><ArrowUpRight size={17} /></div>
                </div>
              </div>
            </div>
            <div className="hr-workspace-caption"><span /> Ilustrasi fitur HRIS · bukan data karyawan nyata</div>
          </div>
        </section>
        <div className="hr-capability-strip hr-container"><span>Didesain untuk aktivitas tim sehari-hari</span><div><Users size={17} /> Data karyawan</div><div><Clock3 size={17} /> Absensi</div><div><CalendarDays size={17} /> Pengajuan cuti</div></div>

        <section id="fitur" className="hr-product">
          <div className="hr-container">
            <div className="hr-section-top"><span className="hr-index">FITUR YANG TERHUBUNG</span><span>Administrasi sehari-hari, dalam satu tempat.</span></div>
            <div className="hr-product-heading"><h2>Lebih tertata.<br />Dari hari pertama.</h2><p>Mulai dengan data tim yang rapi. Lanjutkan dengan kehadiran yang tercatat dan pengajuan yang mudah ditindaklanjuti.</p></div>
            <div className="hr-explorer">
              <div className="hr-module-list" role="tablist" aria-label="Jelajahi fitur HRIS" aria-orientation="vertical">
                {modules.map((module, index) => <button key={module.id} type="button" role="tab" id={`tab-${module.id}`} aria-selected={selected === index} aria-controls="hr-module-panel" tabIndex={selected === index ? 0 : -1} className={selected === index ? 'hr-module is-active' : 'hr-module'} onClick={() => setSelected(index)} onKeyDown={event => {
                  const offsets = { ArrowDown: 1, ArrowUp: -1 }
                  let next
                  if (event.key in offsets) next = (index + offsets[event.key] + modules.length) % modules.length
                  if (event.key === 'Home') next = 0
                  if (event.key === 'End') next = modules.length - 1
                  if (next !== undefined) { event.preventDefault(); setSelected(next); document.getElementById(`tab-${modules[next].id}`)?.focus() }
                }}><span>{module.number}</span><span>{module.label}</span><ArrowUpRight size={19} /></button>)}
                <p className="hr-module-hint">Pilih modul untuk melihat<br />gambaran penggunaannya.</p>
              </div>
              <div className="hr-module-panel" id="hr-module-panel" role="tabpanel" aria-labelledby={`tab-${current.id}`} tabIndex={0}>
                <div className="hr-panel-heading"><h3>{current.label}</h3><span>ILUSTRASI · DATA CONTOH</span></div>
                <p className="hr-panel-description">{current.description}</p>
                <div className="hr-table-scroll"><table className="hr-example-table"><caption className="hr-visually-hidden">Contoh informasi modul {current.label}</caption><thead><tr>{current.columns.map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead><tbody>{current.rows.map((row, i) => <tr key={row[0]}>{row.map((cell, j) => <td key={j}>{j === 0 && <span className={`hr-record-marker hr-record-${i}`} aria-hidden="true" />}{cell}</td>)}</tr>)}</tbody></table></div>
                <p className="hr-panel-note">{current.note}</p>
              </div>
            </div>
            <div className="hr-secondary-features"><span>Juga tersedia</span><p>Jabatan & departemen</p><p>Notifikasi perubahan status</p><p>Ekspor laporan CSV</p></div>
          </div>
        </section>

        <section id="akses" className="hr-access hr-container">
          <div className="hr-section-top"><span className="hr-index">DIBUAT UNTUK TIM ANDA</span><span>Akses mengikuti tanggung jawab.</span></div>
          <div className="hr-access-heading"><h2>Satu tim.<br />Peran yang berbeda.</h2><p>Admin HR mengelola kebutuhan perusahaan. Karyawan mengurus aktivitas dan informasi pribadinya.</p></div>
          <div className="hr-table-scroll"><table className="hr-access-table"><caption className="hr-visually-hidden">Perbandingan hak akses admin HR dan karyawan</caption><thead><tr><th scope="col">Kebutuhan</th><th scope="col"><span>01</span> Admin HR</th><th scope="col"><span>02</span> Karyawan</th></tr></thead><tbody>{access.map(([label, admin, employee]) => <tr key={label}><th scope="row">{label}</th><td>{admin}</td><td>{employee}</td></tr>)}</tbody></table></div>
          <p className="hr-access-footnote">Akun dan hak akses karyawan dikelola oleh admin HR perusahaan.</p>
        </section>

        <section id="faq" className="hr-faq hr-container"><div><span className="hr-index">PUSAT BANTUAN</span><h2>Pertanyaan kecil.<br />Jawaban yang jelas.</h2></div><div className="hr-questions">{questions.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={20} /></summary><p>{answer}</p></details>)}</div></section>

        <section className="hr-closing"><div className="hr-container"><div><span className="hr-index">MULAI DARI SINI</span><h2>Ruang kerja Anda,<br />sudah menunggu.</h2></div><Link to={destination} className="hr-closing-link">{action}<ArrowUpRight size={30} /></Link></div></section>
      </main>
      <footer className="hr-footer hr-container"><Wordmark /><p>HRIS oleh Ahmad Gozali.<br />Untuk administrasi tim sehari-hari.</p><a href="#konten">Kembali ke atas <ArrowRight size={15} /></a></footer>
    </div>
  )
}
