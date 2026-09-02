import { redirect } from 'next/navigation'

/** Ruta de campaña 2027: redirige a /admision (el año lo define la intranet) */
export default function Admision2027RedirectPage() {
  redirect('/admision')
}
