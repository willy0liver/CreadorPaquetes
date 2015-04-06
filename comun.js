/* comun.js */
function fr_GenerarComun(){
	var myArray = [];
	var EN_Comun = "";

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
		EN_Comun = fr_ConstruirComun(myArray);
	});
	callbacks.add(function(){
		$('#taResultado').val(EN_Comun)
	});
	callbacks.fire( "Ejecutar" );
}


function fr_ConstruirComun(myArray){
	var comun = "";
	comun += "using System;\n"+
		"using System.Collections.Generic;\n"+
		"using System.Runtime.Serialization;\n\n"+
		"namespace MAPFRE.RPW.Entity\n"+
		"{\n"+
		"    [DataContract]\n"+
		"    [Serializable]\n"+
		"    public class EN_Comun\n"+
		"    {\n"+
		"        #region Variables Privadas\n"+
		"        private string cUsuCrea;\n"+
		"        private string cUsuModi;\n"+
		"        private DateTime dFecCrea;\n"+
		"        private DateTime dFecModi;\n"+
		"        private string cEstadoCod;\n"+
		"        private string cEstadoDes;\n"+
		"        private int nNumPagina;\n"+
		"        private int nTamanoPagina;\n"+
		"        private int nCantidadReg;\n"+
		"        private int nRowNum;\n"+
		"        private int nAccion;\n"+
		"        private int nCod_Cia;\n"+
		"        #endregion\n"+
		"        #region Propiedades Publicas\n"+		        
		"        [DataMember]\n"+
		"        public string UsuCrea { get { return cUsuCrea; } set { cUsuCrea = value; } }\n"+
		"        [DataMember]\n"+
		"        public string UsuModi { get { return cUsuModi; } set { cUsuModi = value; } }\n"+
		"        [DataMember]\n"+
		"        public DateTime FecCrea { get { return dFecCrea; } set { dFecCrea = value; } }\n"+
		"        [DataMember]\n"+
		"        public DateTime FecModi { get { return dFecModi; } set { dFecModi = value; } }\n"+
		"        [DataMember]\n"+
		"        public string EstadoCod { get { return cEstadoCod; } set { cEstadoCod = value; } }\n"+
		"        [DataMember]\n"+
		"        public string EstadoDes { get { return cEstadoDes; } set { cEstadoDes = value; } }\n"+
		"        [DataMember]\n"+
		"        public int NumPagina { get { return nNumPagina; } set { nNumPagina = value; } }\n"+
		"        [DataMember]\n"+
		"        public int TamanoPagina { get { return nTamanoPagina; } set { nTamanoPagina = value; } }\n"+
		"        [DataMember]\n"+
		"        public int CantidadReg { get { return nCantidadReg; } set { nCantidadReg = value; } }\n"+
		"        [DataMember]\n"+
		"        public int RowNum { get { return nRowNum; } set { nRowNum = value; } }\n"+
		"        [DataMember]\n"+
		"        public int Accion { get { return nAccion; } set { nAccion = value; } }\n"+
		"        [DataMember]\n"+
		"        public int Cod_Cia { get { return nCod_Cia; } set { nCod_Cia = value; } }\n"+
		"        #endregion\n"+
		"    }\n"+
		"}";
	return comun;
}