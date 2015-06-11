$(function()
{
	var nomServicios = [
							{
								servicio 	: 	"Trae Mensajes", 
								urlServicio	: 	"/getAllData", 
								metodo		: 	"GET"
							}, 
							{
								servicio 	: 	"Crear Mensajes", 
								urlServicio	: 	"/create",
								metodo		: 	"POST"
							},
							
							{
								servicio 	: 	"Me Gusta", 
								urlServicio	: 	"/updateLike", 
								metodo		: 	"GET"
							}];
	var listadoDatos = [];
	var idUser = 0;
	var elementos = ["nombre", "mensaje"];
	//Consumo de servicios...
	var consumeServicios = function(tipo, val)
	{
		var servicio = {
						url 	: nomServicios[tipo - 1].urlServicio, 
						metodo	: nomServicios[tipo - 1].metodo, 
						datos 	: ""
					};
		if(tipo === 3)
		{
			servicio.url += "/" + val;
		}
		else
		{
			servicio.datos = val !== "" ? JSON.stringify(val) : "";
		}
		$.ajax(
		{
			url 		: servicio.url,
			type 		: servicio.metodo, 
			data 		: servicio.datos, 
			dataType 	: "json",
			contentType: "application/json; charset=utf-8"
		}).done(function(data)
		{
			//Todos los datos...
			if(tipo === 1)
			{
				listadoDatos = [];
				for(var i = 0; i < data.length; i++)
				{
					//console.log(data[i]);
					listadoDatos.push(new datoData(data[i]));
				}
				imprimeDatos();
			}
			else
			{
				if(tipo === 2)
				{
					if(data.status)
					{
						limpiarCampos();
					}				
				}
				if(tipo !== 5)
				{
					consumeServicios(1, "");
				}
				else
				{
					if(data.status)
					{
						$("#nombre").val(data.datos.identifi);
						$("#mensaje").val(data.datos.nombre);
					}
				}
			}
		});
	};
	consumeServicios(1, "");	
	
	//Constructor datos...
	function datoData(datos)
	{
		this.nombre = datos.nommbre;
		this.mensaje = datos.mensajje;
		//Para devolver los datos del usuario a ser impresos...
		this.imprime = function()
		{
			return [
						this.nombre, 
						this.mensaje 
					];
		}
	}

	//Imprimer usuarios en pantalla...
	var imprimeDatos = function imprimeDatos()
	{
		var txt = "<table class = 'table-fill' border = '1'>";
		for(var i = 0; i < listadoDatos.length; i++)
		{
			txt += "<tr>";
			var datosPersona = listadoDatos[i].imprime();
			for(var c = 0; c < datosPersona.length; c++)
			{
				if(c=0)
				{
				txt += "<tr><td><center>"+(datosPersona[c])+"</center></td></tr>";	

				}
				if(c=1)
				{
				txt += "<tr><td><center>"+(datosPersona[c])+"</center></td></tr>";	
				
			}			
		}
			//Editar...

		}
		txt += "</tbody></table>";
		$("#cuadro").html(txt);
		//Poner las acciones de editar y eliminar...
		for(var i = 0; i < listadoDatos.length; i++)
		{
			//Editar...
			$("#e_" + i).click(function(event)
			{
				var indice = event.target.id.split("_")[1];
				idUser = listadoDatos[indice].identificacion;
				consumeServicios(5, idUser);
			});

			//Eliminar...
			$("#d_" + i).click(function(event)
			{
				var ind = event.target.id.split("_")[1];
				if(confirm("¿Está segur@ de realizar está acción?"))
				{
					consumeServicios(4, listadoDatos[ind].identificacion);
				}
			});
		}
	}

	//Limpia los campos del formulario...
	var limpiarCampos = function()
	{
		idUser = 0; //No se está editando nada...
		for(var i = 0; i < elementos.length; i++)
		{
			$("#" + elementos[i]).val("");
		}
	}

	//Acciones sobre el botón guardar...
	$("#boton").click(function(event)
	{
		var correcto = true;
		var valores = [];
		for(var i = 0; i < elementos.length; i++)
		{
			if($("#" + elementos[i]).val() === "")
			{
				alert("Digite todos los campos");
				$("#" + elementos[i]).focus();
				correcto = false;
				break;
			}
			else
			{
				valores[i] = $("#" + elementos[i]).val();
			}
		}
		//Si correcto es verdadero...
		if(correcto)
		{
			console.log("Valor de id usuario es: " + idUser);
			var nuevoDato = {
								nommbre 	: 	valores[0], 
								mensajje 	: 	valores[1] 
							};				
			consumeServicios(idUser === 0 ? 2 : 3, nuevoDato);
		}
	});
});