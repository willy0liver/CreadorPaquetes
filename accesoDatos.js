function fr_GenerarAccesoDatos(){
	console.log("Wilyyyyyyyyyyyyyyyy")
	var myArray = [];
	var listar = "";
	var consultar = "";
	var addUpdate = "";
	var inicio = "";
	var fin = "";

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
		inicio = fr_ConstruirInicioAD(myArray);
	});
	callbacks.add(function(){
		listar = fr_ConstruirListarAD(myArray);
	});
	callbacks.add(function(){
		consultar = fr_ConstruirConsultar(myArray);
	});
	callbacks.add(function(){
		addUpdate = fr_ConstruirAddUpdate(myArray);
	});
	callbacks.add(function(){
		fin = fr_ConstruirFinAD(myArray);
	});
	callbacks.add(function(){
		$('#taResultado').val(inicio+listar + '\n\n'+ consultar+ '\n\n'+ addUpdate+'\n\n'+fin)
	});
	callbacks.fire( "Ejecutar" );
}

function fr_ConstruirInicioAD(myArray){
	var salida = "";

	salida += "using System;\n"+
			"using System.Data;\n"+
			"using System.Configuration;\n"+
			"using System.Data.OracleClient;\n"+
			"using MAPFRE.RPW.Entity;\n"+
			"using System.Collections.Generic;\n"+
			"using MAPFRE.RPW.Utilitarios;\n\n"+
			"namespace MAPFRE.RPW.Data.Access\n"+
			"{\n"+
			"    public class AD_"+nombreTabla+" : AD_Base\n"+
			"    {\n"+
			"        MAPFRE.RPW.Utilitarios.General util = new MAPFRE.RPW.Utilitarios.General();\n\n";
	return salida;
}

function fr_ConstruirFinAD(myArray){
	var salida = "";
	salida += "    }\n"+
			  "}\n\n";
	return salida;
}


function fr_ConstruirListarAD(myArray){
	var inicio = "";
	inicio = e8+'public List<EN_'+nombreTabla+'> Listar_'+nombreTabla+'(EN_'+nombreTabla+' oENT)\n'+
			 e8+'{\n'+
			 e11+'OracleDataReader dr = null;\n'+
			 e11+'try\n'+
			 e11+'{\n\n'+
			 e14+'OracleCommand cmdOracle = new OracleCommand();\n'+
			 e14+'cmdOracle.CommandType = CommandType.StoredProcedure;\n'+
			 e14+'cmdOracle.CommandText = "'+esquema+'.'+esquema+'_K_'+nombreTabla+'.Listar_'+nombreTabla+'";\n\n'+
			 e14+'OracleParameter prmOracle;\n';

	var parametros = "";
	// Recorriendo el Array
	$.each(myArray, function(index, val) {
		
		 var parametro = "p_"+val[1]+PrimeraMayus(val[0]);
		 var nombre = val[0].toUpperCase();


		 if(val[3]=='N'){ // Consideramos los campos que no son de Auditoria  
			 switch(val[1]){ // Tipo de dato c,n,d
			 	case 'c':
			 		var par = e14+'prmOracle = new OracleParameter("'+parametro+'", OracleType.VarChar);\n'+
			 				  e14+'prmOracle.Value = Formateo_Texto(oENT.'+nombre+');\n'+
			 				  e14+'cmdOracle.Parameters.Add(prmOracle);';

			 		parametros = (parametros=='')? par :parametros+'\n\n'+par;
			 		break;
			 	case 'n':
			 		var par = e14+'prmOracle = new OracleParameter("'+parametro+'", OracleType.Number);\n'+
			 				  e14+'prmOracle.Value = Formateo_Numero(oENT.'+nombre+');\n'+
			 				  e14+'cmdOracle.Parameters.Add(prmOracle);';

			 		parametros = (parametros=='')? par :parametros+'\n\n'+par;
			 		break;
			 	case 'd':
			 		var par = e14+'prmOracle = new OracleParameter("'+parametro+'", OracleType.DateTime);\n'+
			 				  e14+'prmOracle.Value = Formateo_Fecha(oENT.'+nombre+');\n'+
			 				  e14+'cmdOracle.Parameters.Add(prmOracle);';

			 		parametros = (parametros=='')? par :parametros+'\n\n'+par;
			 		break;	
			 }
		 }	 
	});

	
	
	parametros += '\n\n'+
				e14+'prmOracle = new OracleParameter("p_nNumPagina", OracleType.Number);\n'+
                e14+'prmOracle.Value = Formateo_Numero(p_objRPW00006.NumPagina);\n'+
                e14+'cmdOracle.Parameters.Add(prmOracle);\n\n'+
                e14+'prmOracle = new OracleParameter("p_nTamanoPagina", OracleType.Number);\n'+
                e14+'prmOracle.Value = Formateo_Numero(p_objRPW00006.TamanoPagina);\n'+
                e14+'cmdOracle.Parameters.Add(prmOracle);\n\n'+
                e14+'prmOracle = new OracleParameter("p_nCantidadReg", OracleType.Number);\n'+
                e14+'prmOracle.Direction = ParameterDirection.Output;\n'+
                e14+'cmdOracle.Parameters.Add(prmOracle);\n\n'+
                e14+'prmOracle = new OracleParameter("C_Cursor", OracleType.Cursor);\n'+
                e14+'prmOracle.Direction = ParameterDirection.Output;\n'+
                e14+'cmdOracle.Parameters.Add(prmOracle);\n\n'+
                e14+'dr = base.GetDataReader(cmdOracle);\n\n'+
                e14+'List<EN_RPW00006> lstEN_RPW00006 = new List<EN_RPW00006>();\n'+
                e14+'int crrltvo = 1;\n';

	
	var campos = "";
	campos += e14+'if (dr.HasRows) \n'+e14+'{\n'+
              e18+'while (dr.Read())\n'+e18+'{\n'+
              e22+'EN_'+nombreTabla+' oEN_'+nombreTabla+' = new EN_'+nombreTabla+'();\n'+
              e22+'oEN_'+nombreTabla+'.RowNum = crrltvo;\n';

     // Recuperando los campos de la BD         
     $.each(myArray, function(index, val) {		
		 var parametro = "p_"+val[1]+PrimeraMayus(val[0]);
		 var nombre = val[0].toUpperCase();
		 switch(val[1]){ // Tipo de dato c,n,d
		 	case 'c':
		 		campos += e22+'if (!Convert.IsDBNull(dr["'+nombre+'"])) oEN_'+nombreTabla+'.'+nombre+' = Convert.ToString(dr["'+nombre+'"]);\n';
		 		break;
		 	case 'n':
		 		campos += e22+'if (!Convert.IsDBNull(dr["'+nombre+'"])) oEN_'+nombreTabla+'.'+nombre+' = Convert.ToInt32(dr["'+nombre+'"]);\n';
		 		break;
		 	case 'd':
		 		campos += e22+'if (!Convert.IsDBNull(dr["'+nombre+'"])) oEN_'+nombreTabla+'.'+nombre+' = Convert.ToDateTime(dr["'+nombre+'"]);\n';
		 		break;	
		 }
	});         

    campos += e22 +'crrltvo++;\n'+e22+'lstEN_'+nombreTabla+'.Add(oEN_'+nombreTabla+');\n'+
              e18+'}\n'+e18+'dr.Close();\n'+e18+'CloseOracleConnection();\n'+e14+'}\n'+
              e14+'return lstEN_'+nombreTabla+';\n';

    var fin = "";
	fin += e11+'}\n'+e11+'catch (OracleException ex)\n'+e11+'{\n'+e14+'General.LogError(ex); throw ex;\n'+
		   e11+'}\n'+e11+'catch (Exception ex)\n'+e11+'{\n'+e14+'General.LogError(ex); throw ex;\n'+
		   e11+'}\n'+e8+'}\n';


	return inicio + parametros + campos+fin;
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