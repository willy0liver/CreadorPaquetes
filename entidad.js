/* entidad.js */
function fr_GenerarEntidad(){
	var myArray = [];
	var listar = "";

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
		listar = fr_Entidad(myArray);
	});
	callbacks.add(function(){
		$('#taResultado').val(listar)
	});
	callbacks.fire( "Ejecutar" );
}


function fr_Entidad(myArray){
	var entidad = "";
	var atributtes = "";
	var tipoDato = "";
	// Recorriendo el Array
	$.each(myArray, function(index, val) {		
		 var parametro = "p_"+val[1]+PrimeraMayus(val[0]);
		 var nombre = PrimeraMayus(val[0]);
		 switch(val[1]){ // Verificamos el tipo de dato
		 	case 'c':
		 		tipoDato = "string";
		 		break;
		 	case 'n':
		 		tipoDato = "int";
		 		break;
		 	case 'd':
		 		tipoDato = "DateTime";
		 		break;
		 }	 

		 if(val[3]=='N'){
		 	atributtes += "       [DataMember]\n";
		 	atributtes += "       public "+tipoDato+" "+nombre.toUpperCase() + " { get; set; }\n";	
		 }
		 
	});

	entidad += "using System;\n"+
			"using System.Collections.Generic;\n"+
			"using System.Linq;\n"+
			"using System.Text;\n"+
			"using System.Runtime.Serialization;\n\n"+
			"namespace MAPFRE.RPW.Entity\n"+
			"{\n"+
			"    [DataContract]\n"+
			"    [Serializable]\n"+
			"    public class EN_"+nombreTabla+" : EN_Comun\n"+
			"    {\n";

	entidad += atributtes;
	entidad += "    }\n"+
			"}";

	return entidad;
}
