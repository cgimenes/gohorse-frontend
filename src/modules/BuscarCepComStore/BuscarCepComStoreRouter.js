import Layout from '@core/components/Layout'
import BuscarCepComStor from './BuscarCepComStor'

export default [
  {
    path: '/buscar-cep',
    component: Layout,
    children: [
      {
        path: '/buscar-cep-store',
        component: BuscarCepComStor,
        meta: {
          unrequiredAuth: false,
          title: 'Buscar CEP utilizando store'
        }
      }
    ]
  }
]
