/* accesoDatos.js */
function fr_GenerarAccesoDatos(){
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
		console.log("XXXXXXXXX 11111")
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
	var inicio = "";
	inicio = e8+'public List<EN_'+nombreTabla+'> Consultar_'+nombreTabla+'(EN_'+nombreTabla+' oENT)\n'+
			 e8+'{\n'+
			 e11+'OracleDataReader dr = null;\n'+
			 e11+'try\n'+
			 e11+'{\n\n'+
			 e14+'OracleCommand cmdOracle = new OracleCommand();\n'+
			 e14+'cmdOracle.CommandType = CommandType.StoredProcedure;\n'+
			 e14+'cmdOracle.CommandText = "'+esquema+'.'+esquema+'_K_'+nombreTabla+'.Consultar_'+nombreTabla+'";\n\n'+
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

function fr_ConstruirAddUpdate(myArray){
	var inicio = "";
	inicio = e8+'public int Add_Update_'+nombreTabla+'(EN_'+nombreTabla+' oENT)\n'+
			 e8+'{\n'+
			 e11+'int result = 0;\n'+
			 e11+'try\n'+
			 e11+'{\n'+
			 e14+'using (OracleCommand cmdOracle = new OracleCommand())\n'+
             e14+'{\n'+
			 e18+'cmdOracle.CommandType = CommandType.StoredProcedure;\n'+
			 e18+'cmdOracle.CommandText = "'+esquema+'.'+esquema+'_K_'+nombreTabla+'.Add_Update_'+nombreTabla+'";\n\n'+
			 e18+'OracleParameter prmOracle;\n';

	var parametros = "";
	// Recorriendo el Array
	$.each(myArray, function(index, val) {
		
		 var parametro = "p_"+val[1]+PrimeraMayus(val[0]);
		 var nombre = val[0].toUpperCase();


		 if(val[3]=='N'){ // Consideramos los campos que no son de Auditoria  
			 switch(val[1]){ // Tipo de dato c,n,d
			 	case 'c':
			 		var par = e18+'prmOracle = new OracleParameter("'+parametro+'", OracleType.VarChar);\n'+
			 				  e18+'prmOracle.Value = Formateo_Texto(oENT.'+nombre+');\n'+
			 				  e18+'cmdOracle.Parameters.Add(prmOracle);';

			 		parametros = (parametros=='')? par :parametros+'\n\n'+par;
			 		break;
			 	case 'n':
			 		var par = e18+'prmOracle = new OracleParameter("'+parametro+'", OracleType.Number);\n'+
			 				  e18+'prmOracle.Value = Formateo_Numero(oENT.'+nombre+');\n'+
			 				  e18+'cmdOracle.Parameters.Add(prmOracle);';

			 		parametros = (parametros=='')? par :parametros+'\n\n'+par;
			 		break;
			 	case 'd':
			 		var par = e18+'prmOracle = new OracleParameter("'+parametro+'", OracleType.DateTime);\n'+
			 				  e18+'prmOracle.Value = Formateo_Fecha(oENT.'+nombre+');\n'+
			 				  e18+'cmdOracle.Parameters.Add(prmOracle);';

			 		parametros = (parametros=='')? par :parametros+'\n\n'+par;
			 		break;	
			 }
		 }	 
	});	
	
	parametros += '\n\n'+
				e18+'prmOracle = new OracleParameter("p_nRetorno", OracleType.Number);\n'+
                e18+'prmOracle.Direction = System.Data.ParameterDirection.Output;\n'+
                e18+'cmdOracle.Parameters.Add(prmOracle);\n\n'+
                e18+'prmOracle = new OracleParameter("p_cMensaje", OracleType.VarChar, 4000);\n'+
                e18+'prmOracle.Direction = System.Data.ParameterDirection.Output;\n'+
                e18+'cmdOracle.Parameters.Add(prmOracle);\n\n'+
                e18+'base.ExecuteNoneQuery(cmdOracle);\n\n';

	
	var respuesta = "";
	respuesta += e18+'if (!Convert.IsDBNull(cmdOracle.Parameters["p_nRetorno"]))\n'+
              e18+'{\n'+
              e22+'result = int.Parse(cmdOracle.Parameters["p_nRetorno"].Value.ToString());\n'+
              e22+'if (result < 0)\n'+
              e26+'throw new Exception(cmdOracle.Parameters["p_cMensaje"].Value.ToString());\n'+
              e18+'}\n'+
              e14+'}\n'+
              e14+'return result;\n';

    var fin = "";
	fin += e11+'}\n'+e11+'catch (OracleException ex)\n'+e11+'{\n'+e14+'General.LogError(ex); throw ex;\n'+
		   e11+'}\n'+e11+'catch (Exception ex)\n'+e11+'{\n'+e14+'General.LogError(ex); throw ex;\n'+
		   e11+'}\n'+e8+'}\n';


	return inicio + parametros + respuesta+fin;
}