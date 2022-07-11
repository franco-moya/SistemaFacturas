<?php
include_once("conexion.php");
class facturas{

    static public function ListarFacturas($idObra){
        $connect = conexion::conectar();
        $sql = "SELECT factura.N°_Factura, factura.Fecha_Factura, factura.IMG, factura.Monto, proveedor.Nombre_Proveedor, obras.Nombre_Obra, comprador.Nombre_Comprador FROM factura INNER JOIN proveedor ON factura.FK_Proveedor = Proveedor.ID_Proveedor INNER JOIN obras ON factura.FK_Obras=obras.ID_Obra INNER JOIN comprador ON factura.FK_Comprador = comprador.ID_Comprador WHERE factura.FK_Obras = $idObra;";
        $resultado = $connect->query($sql);
        $arreglo = [];
        $i = 0;
        while($fila = $resultado->fetch_assoc()) {
            $arreglo[$i] = $fila;
            $i++;
        }
        return json_encode($arreglo);

    }

    static public function ListarFacturasComercio($idProveedor){
        $connect = conexion::conectar();
        $sql = "SELECT factura.N°_Factura, factura.Fecha_Factura, factura.IMG, factura.Monto, proveedor.Nombre_Proveedor, obras.Nombre_Obra, comprador.Nombre_Comprador FROM factura INNER JOIN proveedor ON factura.FK_Proveedor = proveedor.ID_Proveedor INNER JOIN obras ON factura.FK_Obras=obras.ID_Obra INNER JOIN comprador ON factura.FK_Comprador = comprador.ID_Comprador WHERE factura.Fk_Proveedor = $idProveedor;";

        $resultado = $connect->query($sql);
        $arreglo = [];
        $i = 0;
        while($fila = $resultado->fetch_assoc()) {
            $arreglo[$i] = $fila;
            $i++;
        }
        return json_encode($arreglo);

    }

    static public function ListarProveedores(){
        $connect = Conexion::conectar();
        $sql = "SELECT * FROM proveedor;";
        $resultado = $connect->query($sql);

        $arreglo = [];
        $i = 0;

        while($fila = $resultado->fetch_assoc()) {
            $arreglo[$i] = $fila;
            $i++;
        }

        return json_encode($arreglo);
    }

    static public function ListarCompradores(){
        $connect = Conexion::conectar();
        $sql = "SELECT * FROM comprador;";
        $resultado = $connect->query($sql);

        $arreglo = [];
        $i = 0;

        while($fila = $resultado->fetch_assoc()) {
            $arreglo[$i] = $fila;
            $i++;
        }

        return json_encode($arreglo);
    }
    static public function AgregarCompradores($comprador){
        $connect = Conexion::conectar();
        $sql = "INSERT INTO comprador() VALUES (null, '$comprador')";

        $exe = $connect->query($sql);
        if($exe){
            $respuesta = "ok";
        }else{
            $respuesta = "Error";
        }
        return $respuesta;
    }

    static public function AgregarFacturas($numFactura,$fechaFactura,$imgFactura,$montoFactura,$idObra,$idProveedor,$idComprador){

        $tipoImagen = $imgFactura["type"];
        if($tipoImagen == "image/jpg" ||
            $tipoImagen == "image/jpeg" ||
            $tipoImagen == "image/png") {         
            $rutaTemporal = $imgFactura["tmp_name"];

            //$numRandom = rand(); md5() recibe un parametro para encriptar en una cadena de 32 caracteres
            $rutaDestino = "../img/".md5($imgFactura["tmp_name"]).".PNG";
            $res = move_uploaded_file($rutaTemporal, $rutaDestino);

            if ($res) {
                $connect = Conexion::conectar();
                $sql = "INSERT INTO `factura` VALUES ('$numFactura','$fechaFactura','$rutaDestino','$montoFactura','$idObra','$idProveedor','$idComprador')";
               //ejecutando la consulta
                $exe = $connect->query($sql);
                if($exe) {
                    $respuesta = "ok";
                } else {
                    $respuesta ="Error";
                }
            } else {
                $respuesta = "Error";
            }
            
        } else {
            $respuesta = "ErrorFormato";
        }

        return $respuesta;

    }
    static public function EliminarFactura($numFactura){
        $connect = conexion::conectar();
        $sql = "SELECT IMG FROM factura WHERE N°_Factura = $numFactura";
        $resultado = $connect->query($sql);
        $fila = $resultado->fetch_assoc();
        $rutaImagen = $fila["IMG"];
        if(unlink($rutaImagen)){
            $sqlDelete = "DELETE FROM factura WHERE factura.N°_Factura = $numFactura";

            $resultadoDelete = $connect->query($sqlDelete);
            if($resultadoDelete){
                $respuesta = "Ok";

            }else{
                $respuesta = "Error";
            }

        }else{
            $respuesta = "ErrorArchivo";
        }
        return $respuesta;
    }
    static public function OrdenarFacturas($NFactura){
        $connect = conexion::conectar();
        $sql = "SELECT factura.N°_Factura, factura.Fecha_Factura, factura.IMG, factura.Monto, proveedor.Nombre_Proveedor, obras.Nombre_Obra, comprador.Nombre_Comprador FROM factura INNER JOIN proveedor ON factura.FK_Proveedor = Proveedor.ID_Proveedor INNER JOIN obras ON factura.FK_Obras=obras.ID_Obra INNER JOIN comprador ON factura.FK_Comprador = comprador.ID_Comprador WHERE factura.N°_Factura = $NFactura;";

        $resultado = $connect->query($sql);

        $arreglo = [];
        $i = 0;

        while($fila = $resultado->fetch_assoc()){
            $arreglo[$i] = $fila;
            $i++;
        }
        return json_encode($arreglo);


    }
    static public function OrdenarFacturasFechas($Fecha1,$Fecha2){
        $connect = conexion::conectar();
        $sql = "SELECT factura.N°_Factura, factura.Fecha_Factura, factura.IMG, factura.Monto, proveedor.Nombre_Proveedor, obras.Nombre_Obra, comprador.Nombre_Comprador FROM factura INNER JOIN proveedor ON factura.FK_Proveedor = Proveedor.ID_Proveedor INNER JOIN obras ON factura.FK_Obras=obras.ID_Obra INNER JOIN comprador ON factura.FK_Comprador = comprador.ID_Comprador WHERE factura.Fecha_Factura BETWEEN '$Fecha1'AND'$Fecha2'; ";

        $resultado = $connect->query($sql);

        $arreglo = [];
        $i = 0;

        while($fila = $resultado->fetch_assoc()){
            $arreglo[$i] = $fila;
            $i++;
        }
        return json_encode($arreglo);
       
    }
}