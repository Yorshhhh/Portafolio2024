import React from 'react'
import PedidosEntregados from '../components/PedidosEntregados'
import PedidosPendientes from '../components/PedidosPendientes'

function verpedidos() {
  return (
    <div>
        <PedidosEntregados/>
        <PedidosPendientes/>
       
    </div>
  )
}

export default verpedidos