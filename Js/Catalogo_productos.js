	var productos = [];
	var reciente = [];

	function validar(){
		//funcion que valida datos que no queden vacíos en 
		if(document.getElementById("idCodigo").value == ""){
			alert("Hace falta ingresar el código del producto!");
			return false;
		}

		if(document.getElementById("idNombre").value == ""){
			alert("Hace falta ingresar el nombre del producto!");
			return false;
		}

		if(document.getElementById("idPrecio").value == ""){
			alert("Hace falta ingresar el Precio del producto!");
			return false;
		}

		if (document.getElementById("idImagen").value == "") {
			alert("Hace falta ingresar el Precio del producto!");
			return false;
		}

	}

	function getFile(){

		//Obtiene la imagen y la convierte en un string para poder acceder a su direccion
		var resultado="";
		var file = document.querySelector('input[type=file]').files[0];
		var reader = new FileReader();

		reader.addEventListener("load", function(){
			resultado = reader.result;
			sessionStorage.setItem("url", resultado);
		},false);

		if (file){
			reader.readAsDataURL(file);
		}

	}

	function llenarArreglo(){

		
		var codigo = document.getElementById("idCodigo").value;
		var nombre = document.getElementById("idNombre").value;
		var precio = document.getElementById("idPrecio").value;
		var imagen = sessionStorage.getItem("url");// se obtiene la direccion de la imagen en un session storage 

		var codigoExiste = false;

		// Se agrega el arreglo de datos de un producto al local storage
		if(localStorage.getItem("registro") != null){
			productos = JSON.parse(localStorage.getItem("registro"));

			for(var i=0; i<productos.length; i++){

				if (productos[i].codigo == codigo) {
					codigoExiste = true;
					alert("El codigo que se ingresó ya existe!");
				}

			}
		}

		if(codigoExiste == false){

			var prod = new objproducto(codigo, nombre, precio, imagen);
			reciente.push(prod);
			productos.push(prod);
			localStorage.clear();
			localStorage.setItem("registro", JSON.stringify(productos));
		}
		
	}

	function objproducto(codigo, nombre, precio, imagen){
		this.codigo = codigo,
		this.nombre = nombre,
		this.precio = precio,
		this.imagen = imagen
	}

	function actualizarTabla(){

	
		var scriptTabla="";

		// Se actualiza la tabla para escribir en el html por medio de Apis; document e InnerHtml.
		for(var index=0; index<reciente.length; index++){

			scriptTabla+="<tr>";
			scriptTabla+="<td>"+reciente[index].codigo+"</td>";
			scriptTabla+="<td>"+reciente[index].nombre+"</td>";
			scriptTabla+="<td>Q "+reciente[index].precio+"</td>";
			scriptTabla+="<td><img src=\""+reciente[index].imagen+"\" width=\"75px\"></td>";
			scriptTabla+="</tr>";

		}

		document.getElementById("idTableBody").innerHTML = scriptTabla;

	}

	function limpiar(){
		document.getElementById("idCodigo").value = "";
		document.getElementById("idNombre").value = "";
		document.getElementById("idPrecio").value = "";
		document.getElementById("idImagen").value = "";
	}

	function mostrarProductos(){

		var guardados = [];
		guardados = JSON.parse(localStorage.getItem("registro"));// se convierte a un string lo que esta ingresado en el local storage y poder mostrarlo en un html

		var scriptTabla;

		for(var index=0; index<guardados.length; index++){

			scriptTabla+="<tr>";
			scriptTabla+="<td>"+guardados[index].codigo+"</td>";
			scriptTabla+="<td>"+guardados[index].nombre+"<br><br><label for=\""+guardados[index].codigo+"\">Cantidad: </label> <input type=\"number\" id=\""+"c"+guardados[index].codigo+"\"></td>";
			scriptTabla+="<td>Q "+guardados[index].precio+"<br><br><input type=\"button\" value=\"Agregar al carrito\" id=\""+guardados[index].codigo+"\" onclick=\"agregarCarrito(this.id)\"></td>";
			scriptTabla+="<td><img src=\""+guardados[index].imagen+"\" width=\"75px\"></td>";
			scriptTabla+="</tr>";
		}

		document.getElementById("idTableBody2").innerHTML = scriptTabla;

	}

	function objpedido(codigo, nombre, precio, imagen, cantidad){
		this.codigo=codigo,
		this.nombre=nombre,
		this.precio=precio,
		this.imagen=imagen,
		this.cantidad=cantidad
	}

	function agregarCarrito(id){

		debugger;

		var buscarProductos = [];
		var auxiliar = [];
		var getProducto = [];

		var codigo;
		var nombre;
		var precio;
		var imagen;
		var cantidad;

		buscarProductos = JSON.parse(localStorage.getItem("registro"));

		for(var i=0; i<buscarProductos.length; i++){

			if(buscarProductos[i].codigo == id){
				codigo = buscarProductos[i].codigo;
				nombre = buscarProductos[i].nombre;
				precio = buscarProductos[i].precio;
				imagen = buscarProductos[i].imagen;
				cantidad = document.getElementById("c"+id).value;
			}

		}

		if(cantidad != "" && cantidad > 0){

			if(JSON.parse(sessionStorage.getItem("regPedido"))!=null){

				var actualizar = false;

				auxiliar = JSON.parse(sessionStorage.getItem("regPedido"));

				for(var y=0; y<auxiliar.length; y++){
					if(auxiliar[y].codigo == codigo){
						actualizar = true;
						break;
					}
				}

				if(actualizar == true){
					for(var z=0; z<auxiliar.length; z++){
						if(auxiliar[z].codigo != codigo){
							getProducto.push(auxiliar[z]);
						}
					}

					var ped = new objpedido(codigo, nombre, precio, imagen, cantidad);

					getProducto.push(ped);

					sessionStorage.clear();
					sessionStorage.setItem("regPedido", JSON.stringify(getProducto));
				}else{

					getProducto = auxiliar;

					var ped = new objpedido(codigo, nombre, precio, imagen, cantidad);

					getProducto.push(ped);

					sessionStorage.clear();
					sessionStorage.setItem("regPedido", JSON.stringify(getProducto));

				}

			}else{
				var ped = new objpedido(codigo, nombre, precio, imagen, cantidad);

				getProducto.push(ped);

				sessionStorage.clear();
				sessionStorage.setItem("regPedido", JSON.stringify(getProducto));
			}

		}else{

			alert("No se a ingresado una Cantidad");

		}

	}

	function revisarPedido(){
		var carrito = [];
		var total = 0;
		carrito = JSON.parse(sessionStorage.getItem("regPedido"));

		var scriptTabla;

		for(var index=0; index<carrito.length; index++){

			scriptTabla+="<tr>";
			scriptTabla+="<td>"+carrito[index].codigo+"</td>";
			scriptTabla+="<td>"+carrito[index].nombre+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src=\""+carrito[index].imagen+"\" width=\"75px\"></td>"
			scriptTabla+="<td>"+carrito[index].cantidad+"<br><br><label for=\""+carrito[index].codigo+"\">Cantidad: </label> <input type=\"number\" id=\""+"c"+carrito[index].codigo+"\" onchange=\"actualizarCantidad(this.id)\">&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"button\" value=\"Descartar\" id=\""+carrito[index].codigo+"\" onclick=\"quitarCarrito(this.id)\"></td>";
			scriptTabla+="<td>Q "+carrito[index].precio+"</td>";
			scriptTabla+="<td>Q "+carrito[index].cantidad*carrito[index].precio+"</td>";
			scriptTabla+="</tr>";
			total+=carrito[index].cantidad*carrito[index].precio;
		}

		document.getElementById("idTableBody3").innerHTML = scriptTabla;
		document.getElementById("total").innerHTML = "Total de su compra:&nbsp;&nbsp;&nbsp;&nbsp;Q "+total;
	}

	function actualizarCantidad(id){
		var nuevoid = id.substring(1);
		
		agregarCarrito(nuevoid);

		revisarPedido();
	}

	function quitarCarrito(id){

		var pedidoActual = [];
		var nuevoPedido = [];

		pedidoActual = JSON.parse(sessionStorage.getItem("regPedido"));

		for(var y=0; y<pedidoActual.length; y++){
			if(pedidoActual[y].codigo != id){
				nuevoPedido.push(pedidoActual[y]);
			}
		}

		sessionStorage.clear();
		sessionStorage.setItem("regPedido", JSON.stringify(nuevoPedido));

		revisarPedido();

	}

	function validarCompra(){

		var total = document.getElementById("total");
		var contenido = total.innerHTML;
	
		if(contenido.charAt(contenido.length-1) == 0 && contenido.charAt(contenido.length-2)==" "){
			alert("No hay ningun producto en el carrito de compra!");
			return false;
		}
	
		if(document.getElementById("idNombre").value == ""){
			alert("Debe ingresar su nombre completo!");
			return false;
		}
	
		if(document.getElementById("idDireccion").value == ""){
			alert("Debe ingresar una direccion de entrega!");
			return false;
		}
	
	}
	
	function comprar(){
	
		if(validarCompra()==false){
			return false;
		}
	
		document.getElementById("idNit").value="";
		document.getElementById("idNombre").value="";
		document.getElementById("idDireccion").value="";
		sessionStorage.clear();
		alert("Su pedido se registro correctamente!\n Muchas gracias por su compra!");
	
	}


	function agregarProducto(){

		if(validar()==false){
			return false;
		}

		llenarArreglo();

		actualizarTabla();

		limpiar();

	}

