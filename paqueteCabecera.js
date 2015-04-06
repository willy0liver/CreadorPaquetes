/* paqueteCabecera.js */
function fr_GenerarCabecera(){
	var myArray = [];
	var listar = "";
	var consultar = "";
	var addUpdate = "";

	var callbacks = $.Callbacks();
	callbacks.add(function(){
		// Construyendo el Array con los valores
		$('.campoTexto').each(function (index){
	        var idd = $(this).attr('id'); 
	        console.log('Id del Campo Texto: '+idd)    
	        var nro = idd.split('_')[1];        
	        var texto =$.trim($('#'+idd).val());
	        
	        if(texto.length > 0){
	        	var miCampo = [];        	
	        	miCampo.push(texto); // Texto
	        	miCampo.push($('#combo_'+nro).val()); // Tipo de Dato
	        	miCampo.push($('#comboPK_'+nro).val()); // Si es PK
	        	miCampo.push($('#'+idd).attr('auditoria')); // Si es Auditoria
	        	myArray.push(miCampo);
	        }else{
	        	$('#'+idd).parent().remove();
	        }       
	    })
	});
	callbacks.add(function(){
		listar = fr_CabeceraListar(myArray);
	});
	callbacks.add(function(){
		consultar = fr_CabeceraConsultar(myArray);
	});
	callbacks.add(function(){
		addUpdate = fr_CabeceraAddUpdate(myArray);
	});
	callbacks.add(function(){
		$('#taResultado').val(listar + '\n\n'+ consultar+ '\n\n'+ addUpdate)
	});
	callbacks.fire( "Ejecutar" );
}


function fr_CabeceraListar(myArray){
	var procedure = "";
	var cabecera = "";
	// Recorriendo el Array
	$.each(myArray, function(index, val) {		
		 var parametro = "p_"+val[1]+PrimeraMayus(val[0]);
		 var nombre = PrimeraMayus(val[0]);
		 if(val[3]=='N'){ // Consideramos los campos que no son de Auditoria
		 	// Para la cabecera	 
			 var linea1 = "   "+parametro+"    IN    "+nombreTabla.toUpperCase()+"."+nombre+"%TYPE,";
			 console.log("Linea: "+linea1);
			 cabecera += linea1+"\n";
		 }	 

	});
	cabecera +=
	"   p_nNumPagina        IN       NUMBER,\n"+
	"   p_nTamanoPagina     IN       NUMBER,\n"+
	"   p_nCantidadReg      OUT      NUMBER,\n"+
	"   C_Cursor           OUT      SYS_REFCURSOR\n"+
	");";

	procedure += "PROCEDURE Listar_"+nombreTabla+"(\n";
	procedure += cabecera;
	return procedure;
}

function fr_CabeceraConsultar(myArray){
	var procedure = "";
	var cabecera = "";
	// Recorriendo el Array
	$.each(myArray, function(index, val) {
		
		 var parametro = "p_"+val[1]+PrimeraMayus(val[0]);
		 var nombre = PrimeraMayus(val[0]);


		 if(val[3]=='N'){ // Consideramos los campos que no son de Auditoria
		 	// Para la cabecera	 
			 var linea1 = "   "+parametro+"    IN    "+nombreTabla.toUpperCase()+"."+nombre+"%TYPE,";
			 console.log("Linea: "+linea1);
			 cabecera += linea1+"\n";
		 }	 

	});
	cabecera +=
	"   C_Cursor           OUT      SYS_REFCURSOR\n"+
	");";

	procedure += "PROCEDURE Consultar_"+nombreTabla+"(\n";
	procedure += cabecera;

	return procedure;
}


function fr_CabeceraAddUpdate(myArray){
	var procedure = "";
	var cabecera = "";
	var faltaUser = true;
	var parametros = "";

	
	cabecera += '   p_nAccion  IN      NUMBER,\n';
	var setear = "";

	// Recorriendo el Array
	$.each(myArray, function(index, val) {
		
		 var parametro = "p_"+val[1]+PrimeraMayus(val[0]);
		 var nombre = PrimeraMayus(val[0]);	 

		 console.log("Campo: "+nombre+" = "+val[2]+" - Auditoria: - "+val[3])


		 if(val[3]=='N'){ // Consideramos los campos que no son de Auditoria
		 	// Para la cabecera	 
			 cabecera += "   "+parametro+"    IN    "+nombreTabla.toUpperCase()+"."+nombre+"%TYPE,\n";
		 }else{
		 	if(faltaUser && val[1] == 'c'){
		 		cabecera +=
				"   p_cUser    IN    "+nombreTabla.toUpperCase()+"."+nombre+"%TYPE,\n";
		 		faltaUser = false;
		 	}
		 }

	});
	cabecera +=
	"   p_nRetorno         OUT      NUMBER,\n"+
	"   p_cMensaje         OUT      VARCHAR\n"+	
	");";

	procedure += "PROCEDURE AddUpdate_"+nombreTabla+"(\n";
	procedure += cabecera;
	return procedure;
}