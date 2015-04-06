function PrimeraMayus(string){ 
	return string.charAt(0).toUpperCase() + string.slice(1); 
} 

function hoy(){
	var d = new Date();
	var month = d.getMonth()+1;
	var day = d.getDate();
	var output = 
	    ((''+day).length<2 ? '0' : '') + day + '/' +
	    ((''+month).length<2 ? '0' : '') + month + '/' +	    
	    d.getFullYear() ;
	return output
}

function fr_SetearTitulo(){
	var texto = $("#cbOpcion option:selected").attr('texto');
	$('#taResultado').val('')
	$('#tituloH1').text("*** "+texto+" ***")
}

function fr_redimensionarDivContenido(){
	var tam = $('#dinamico').height()+300;
	$('#contenido').height(tam)
}