/* paqueteBody.js */
function fr_GenerarBody(){
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
		listar = fr_ConstruirListar(myArray);
	});
	callbacks.add(function(){
		consultar = fr_ConstruirConsultar(myArray);
	});
	callbacks.add(function(){
		addUpdate = fr_ConstruirAddUpdate(myArray);
	});
	callbacks.add(function(){
		$('#taResultado').val(listar + '\n\n'+ consultar+ '\n\n'+ addUpdate)
	});
	callbacks.fire( "Ejecutar" );
}


function fr_ConstruirListar(myArray){

	var procedure = "";
	var cabecera = "";
	var descripcion = "";
	var campos = "";
	var where = "   where ";
	var colocarAnd = false;
	var and = "";

	descripcion +=
	"/*=====================================================================\n"+
	"PROPOSITO: Listar "+nombreTabla+" \n"+
	"AUTOR: "+autor+"                                      FECHA:"+hoy()+"\n"+
	"---------------------------------------------------------------------\n"+
	"DATOS RELEVANTES:\n";

	// Recorriendo el Array
	$.each(myArray, function(index, val) {
		
		 var parametro = "p_"+val[1]+PrimeraMayus(val[0]);
		 var nombre = PrimeraMayus(val[0]);


		 if(val[3]=='N'){ // Consideramos los campos que no son de Auditoria
		 	// Para la cabecera	 
			 var linea1 = "   "+parametro+"    IN    "+nombreTabla.toUpperCase()+"."+nombre+"%TYPE,";
			 console.log("Linea: "+linea1);
			 cabecera += linea1+"\n";

			 // Para la descripcion
			 var linea2 = "  - "+parametro+" = DESCRIPCION";
			 descripcion += linea2+"\n";		 

			 // Para el Where		  
			 switch(val[1]){ // Tipo de dato c,n,d
			 	case 'c':
			 		console.log(nombre +" es cadena.")
			 		if(colocarAnd) and = '     and';
			 		where += " "+and+" (a."+nombre+" like '%'|| "+parametro+" ||'%')\n";
			 		colocarAnd = true;
			 		break;
			 	case 'n':
			 		console.log(nombre +" es Numero.")
			 		if(colocarAnd) and = '     and';
			 		where += " "+and+" ("+parametro+" is null OR a."+nombre+" = "+parametro+")\n";
			 		colocarAnd = true;
			 		break;
			 }
		 }	 


		 // Recuperando los campos
		 campos = (campos=="")? nombre : campos += ", "+nombre;

	});
	cabecera +=
	"   p_nNumPagina        IN       NUMBER,\n"+
	"   p_nTamanoPagina     IN       NUMBER,\n"+
	"   p_nCantidadReg      OUT      NUMBER,\n"+
	"   C_Cursor           OUT      SYS_REFCURSOR\n"+
	")\nAS\nBEGIN\n";

	descripcion +=
	"  - p_nNumPagina = Numero de Pagina\n"+
	"  - p_nTamanoPagina = Tamanio de Pagina\n"+
    "  - p_nCantidadReg = Cantidad de Registros\n"+
  	"  - C_Cursor = Cursor de resultado de la Consulta.\n"+
	"---------------------------------------------------------------------\n"+
	"DESCRIPCION FUNCIONAL:\n"+
  	"  -  Listar "+nombreTabla+"\n"+
  	"========================================================================*/\n";

	

	procedure = descripcion;
	procedure += "PROCEDURE Listar_"+nombreTabla+"(\n";
	procedure += cabecera;

	procedure += "   SELECT count(*) INTO p_nCantidadReg\n   From "+esquema+"."+nombreTabla+" a\n";
	procedure += where+"   ;\n";

	procedure += 
	"   OPEN C_Cursor FOR\n"+
    "   SELECT z.*\n"+
    "   FROM (\n"+
    "      SELECT x.*, ROWNUM AS Nrow\n"+
    "      FROM (\n"+
    "         Select  "+campos+"\n"+
    "         From "+esquema+"."+nombreTabla+" a\n"+
    "         "+where+
    "         ORDER BY 1\n"+
    "      )x\n"+
    "   ) z\n"+
    "   WHERE Nrow BETWEEN (p_nNumPagina - 1) * p_nTamanoPagina + 1\n"+
    "   AND p_nNumPagina * p_nTamanoPagina;\n";

	procedure += "END  Listar_"+nombreTabla+";";

	return procedure;
}



function fr_ConstruirConsultar(myArray){
	var procedure = "";
	var cabecera = "";
	var descripcion = "";
	var campos = "";
	var where = "   where ";
	var colocarAnd = false;
	var and = "";

	descripcion +=
	"/*=====================================================================\n"+
	"PROPOSITO: Consultar "+nombreTabla+" \n"+
	"AUTOR: "+autor+"                                      FECHA:"+hoy()+"\n"+
	"---------------------------------------------------------------------\n"+
	"DATOS RELEVANTES:\n";

	// Recorriendo el Array
	$.each(myArray, function(index, val) {
		
		 var parametro = "p_"+val[1]+PrimeraMayus(val[0]);
		 var nombre = PrimeraMayus(val[0]);


		 if(val[3]=='N'){ // Consideramos los campos que no son de Auditoria
		 	// Para la cabecera	 
			 var linea1 = "   "+parametro+"    IN    "+nombreTabla.toUpperCase()+"."+nombre+"%TYPE,";
			 console.log("Linea: "+linea1);
			 cabecera += linea1+"\n";

			 // Para la descripcion
			 var linea2 = "  - "+parametro+" = DESCRIPCION";
			 descripcion += linea2+"\n";		 

			 // Para el Where		  
			 switch(val[1]){ // Tipo de dato c,n,d
			 	case 'c':
			 		console.log(nombre +" es cadena.")
			 		if(colocarAnd) and = '     and';
			 		where += " "+and+" (a."+nombre+" like '%'|| "+parametro+" ||'%')\n";
			 		colocarAnd = true;
			 		break;
			 	case 'n':
			 		console.log(nombre +" es Numero.")
			 		if(colocarAnd) and = '     and';
			 		where += " "+and+" ("+parametro+" is null OR a."+nombre+" = "+parametro+")\n";
			 		colocarAnd = true;
			 		break;
			 }
		 }	 


		 // Recuperando los campos
		 campos = (campos=="")? nombre : campos += ", "+nombre;

	});
	cabecera +=
	"   C_Cursor           OUT      SYS_REFCURSOR\n"+
	")\nAS\nBEGIN\n";

	descripcion +=
  	"  - C_Cursor = Cursor de resultado de la Consulta.\n"+
	"---------------------------------------------------------------------\n"+
	"DESCRIPCION FUNCIONAL:\n"+
  	"  -  Consultar "+nombreTabla+"\n"+
  	"========================================================================*/\n";	

	procedure = descripcion;
	procedure += "PROCEDURE Consultar_"+nombreTabla+"(\n";
	procedure += cabecera;


	procedure += 
	"   OPEN C_Cursor FOR\n"+
    "   Select  "+campos+"\n"+
    "   From "+esquema+"."+nombreTabla+" a\n"+
    where + 
    "   ORDER BY 1;\n";
	procedure += "END  Consultar_"+nombreTabla+";";

	return procedure;
}


function fr_ConstruirAddUpdate(myArray){
	var procedure = "";
	var cabecera = "";
	var descripcion = "";
	var campos = "";
	var where = "   where ";
	var colocarAnd = false;
	var and = "";
	var faltaUser = true;
	//var parametros = "p_cAcccion, ";
	var parametros = "";

	descripcion +=
	"/*=====================================================================\n"+
	"PROPOSITO: Agregar o Actualizar "+nombreTabla+" \n"+
	"AUTOR: "+autor+"                                      FECHA:"+hoy()+"\n"+
	"---------------------------------------------------------------------\n"+
	"DATOS RELEVANTES:\n"+
	"  - p_cAcccion = Accion 1 agregar o 2 editar.\n";

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

			 parametros = (parametros=='')? parametro : parametros + ', '+parametro;

			 // Para la descripcion
			 descripcion += "  - "+parametro+" = DESCRIPCION\n";



			 // Para el Where		  
			 switch(val[2]){ // S =PK
			 	case 'S':
			 		if(colocarAnd) and = '     and';
			 		where += " "+and+" a."+nombre+" = "+parametro+"\n";
			 		colocarAnd = true;
			 		break;
			 	case 'N':
			 		console.log("SETEAR: "+nombre+" = "+parametro+"\n")
			 		setear = (setear=='')? "   SET "+nombre+" = "+parametro+"\n" : setear +"          "+nombre+" = "+parametro+"\n";
			 		break;	
			 }
		 }else{
		 	if(faltaUser && val[1] == 'c'){
		 		cabecera +=
				"   p_cUser    IN    "+nombreTabla.toUpperCase()+"."+nombre+"%TYPE,\n";
		 		faltaUser = false;
		 	}

		 	if(val[1] == 'c'){parametros += ', USER';}
		 	if(val[1] == 'd'){parametros += ', SYSDATE';}
		 }


		 // Recuperando los campos
		 campos = (campos=="")? nombre : campos += ", "+nombre;

	});
	cabecera +=
	"   p_nRetorno         OUT      NUMBER,\n"+
	"   p_cMensaje         OUT      VARCHAR\n"+	
	")\nAS\n   nCorrelativo Number;\nBEGIN\n";

	descripcion +=
  	"  - p_cUser = Usuario de creacion o actualizacion.\n"+
  	"  - p_nRetorno = Retorno.\n"+
  	"  - p_cMensaje = Mensaje en caso de Error.\n"+
	"---------------------------------------------------------------------\n"+
	"DESCRIPCION FUNCIONAL:\n"+
  	"  -  Consultar "+nombreTabla+"\n"+
  	"========================================================================*/\n";	

	procedure = descripcion;
	procedure += "PROCEDURE AddUpdate_"+nombreTabla+"(\n";
	procedure += cabecera;


	procedure += 
	"   IF p_nAccion = 1 THEN\n"+
	"      BEGIN\n"+
	"         SELECT nvl(max(COD_PROCESO),0) + 1\n"+
	"              into nCorrelativo\n"+
	"              from "+esquema.toUpperCase()+"."+nombreTabla.toUpperCase()+"\n      "+where+"         ;\n"+
	"      EXCEPTION\n"+
	"              WHEN NO_DATA_FOUND\n"+
	"              THEN\n"+
	"                nCod_Proceso := 1;\n"+
	"              WHEN OTHERS\n"+
	"              THEN\n"+
	"                nCod_Proceso := 1;\n"+
	"      END;\n"+
	"      INSERT INTO "+esquema.toUpperCase()+"."+nombreTabla.toUpperCase()+"\n"+
	"                ("+campos+" )\n"+
	"      VALUES ("+parametros+");\n"+
	"         p_nRetorno := nCod_Proceso;\n"+
	"   ELSE\n"+
	"      Update "+esquema.toUpperCase()+"."+nombreTabla.toUpperCase()+"\n"+
	"   "+setear+
    "   "+where + "      ;\n"+
    "      p_nRetorno := 0;\n";
	procedure += 
	"   END IF;\n"+
	"EXCEPTION\n"+
    "WHEN OTHERS THEN\n"+
    "  p_nRetorno := -1;\n"+
    "  p_cMensaje := SQLERRM;\n"+
	"END  AddUpdate_"+nombreTabla+";";

	return procedure;
}