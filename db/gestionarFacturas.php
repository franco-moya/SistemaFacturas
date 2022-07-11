<?php
include_once("facturas.php");
//Aqui van los casos de tipoOperacion 
$operacion = $_POST["tipoOperacion"];
switch ($operacion) {

    case 'RescatarId':
        $res = $_POST["id_Obra"];
        echo $res;
        break;
    case 'ListarFacturas':
        $idObra = $_POST["id_Obra"];
        $res = facturas::ListarFacturas($idObra);
        echo $res;
        break;
    case 'ListarFacturasComercio':
        $idProveedor = $_POST["id_Proveedor"];
        $res = facturas::ListarFacturasComercio($idProveedor);
        echo $res;
        break;
    case 'AgregarFacturas':
        $numFactura = $_POST["numeroFactura"];
        $fechaFactura = $_POST["fechaFactura"];
        $montoFactura = $_POST["montoFactura"];
        $imgFactura = $_FILES["imagenFactura"];
        $idObra = $_POST["id_Obra"];
        $idProveedor = $_POST["proveedor"];
        $idComprador = $_POST["comprador"];
        
        $res = facturas::AgregarFacturas($numFactura,$fechaFactura,$imgFactura,$montoFactura,$idObra,$idProveedor,$idComprador);
        echo $res;
        break;
    case 'listarProveedores':
        $res = facturas::ListarProveedores();
        echo $res;
        break;
    case 'listarCompradores':
        $res = facturas::ListarCompradores();
        echo $res;
        break;
    case 'AgregarCompradores':
        $comprador = $_POST["Nombre_Comprador"];
        $res = facturas::AgregarCompradores($comprador);
        echo $res;
        break;
    case'EliminarFactura':
        $numFactura = $_POST["N°_Factura"];
        $res = facturas::EliminarFactura($numFactura);
        echo $res;
        break;
    case 'OrdenarFacturas':
        $NFactura = $_POST["N°_Factura"];
        $res = facturas::OrdenarFacturas($NFactura);
        echo $res;
        break;
    case 'OrdenarFacturasFechas':
        $res = facturas::OrdenarFacturasFechas($Fecha1,$Fecha2);
        echo $res;
        break;
}