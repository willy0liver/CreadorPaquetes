var esquema = "";
var nombreTabla = "";
var autor = "Willy0liver";
var e1 = " "; var e2 = e1+e1; var e3 = e2+e1; var e4 = e3+e1; var e5 = e4+e1; var e6 = e5+e1;
var e7 = e6+e1; var e8 = e7+e1; var e9 = e8+e1; var e10 = e9+e1; var e11 = e9+e2;
var e12 = e9+e3; var e13 = e9+e4; var e14 = e9+e5; var e15 = e9+e6; var e16 = e9+e7; var e17 = e9+e8;
var e18 = e9+e9; var e19 = e18+e1; var e20 = e18+e2; var e21 = e18+e3; var e22 = e18+e4;
var e23 = e18+e5; var e24 = e18+e6; var e25 = e18+e7; var e26 = e18+e8;

$(document).ready(function() {	

	var callbacks = $.Callbacks();
	callbacks.add(fr_InsertarCampo('N'));
	callbacks.add(fr_InsertarCampo('N'));
	callbacks.add(fr_llenarDatos);
	callbacks.fire( "Ejecutar" );	

});

function fr_llenarDatos(){
	$('#txtEsquema').val('OIM')
	$('#txtTabla').val('RPW00006')
	$('#campo_1').val('Codigo')
	$('#combo_1').val('n')
	$('#campo_2').val('Detalle')
}


function fr_InsertarCampo(audi){
	var newCampo = parseInt($('#hdContador').val())+1;
	var selPK = "<option value=S>PK</option><option value=N selected>No PK</option>";
	if($('.campoTexto').length == 0){
		selPK = "<option value=S selected>PK</option><option value=N>No PK</option>";
	}
	var cadena = "<div class='col350 audi_"+audi+"' >"+
					"<input type=text class=campoTexto auditoria="+audi+" id=campo_"+newCampo+" />"+
					"<select class=campo id=combo_"+newCampo+">"+
					  "<option value=c>Texto</option>"+
					  "<option value=n>Número</option>"+
					  "<option value=d>Fecha</option>"+										  
					"</select>"+
					"<select class=comboPK id=comboPK_"+newCampo+">"+
					  selPK+
					"</select>"+
				"</div>";

	$('#campos').append(cadena);
	$('#hdContador').val(newCampo);
	$('#campo_'+newCampo).focus();

	fr_redimensionarDivContenido();

	return false;
}

function fr_InsertarAuditoria(){
	// Eliminar los campos auditoria, si existieran
	$('input[auditoria=S]').parent().remove();

	fr_InsertarCampo('S');
	fr_InsertarCampo('S');
	fr_InsertarCampo('S');
	fr_InsertarCampo('S');

	$('input[auditoria=S]').each(function(index) {
		 var nro = $(this).attr('id').split('_')[1]
		 switch(index){
		 	case 0:
		 		$('#campo_'+nro).val('UsuCrea')
		 		$('#combo_'+nro).val('c')
		 		break;
		    case 1:
		 		$('#campo_'+nro).val('FecCrea')
		 		$('#combo_'+nro).val('d')
		 		break;
		    case 2:
		 		$('#campo_'+nro).val('UsuModi')
		 		$('#combo_'+nro).val('c')
		 		break;
		 	case 3:
		 		$('#campo_'+nro).val('FecModi')
		 		$('#combo_'+nro).val('d')
		 		break;
		 }
	});

	return false;
}



function fr_Generar(){	
	esquema = $('#txtEsquema').val().toUpperCase();
	nombreTabla = $('#txtTabla').val().toUpperCase();
	console.log("Mi tabla se llama: "+nombreTabla)

	var opcion = $("#cbOpcion option:selected").attr('value');
	switch(opcion){
		case '1': // Generar BODY DEL PAQUETE
			fr_GenerarBody();	
			break;
		case '2':
			fr_GenerarCabecera();
			break;
		case '3':
			fr_GenerarEntidad();
			break;	
		case '4':
			fr_GenerarComun();
			break;
		case '5':
			fr_GenerarAccesoDatos();
			break;	
		default:
			alert('Falta implementar')	
			break;
	}
	
	
}

