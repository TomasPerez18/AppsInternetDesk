
var miusuario = "Tomas";

//Configuracion para Firebase
//database 1
// Your web app's Firebase configuration
/*var firebaseConfig = {
    apiKey: "AIzaSyAOjJh5tLTxrrSMMcmzg10hQLHAPJInAjk",
    authDomain: "chatapp-2a11f.firebaseapp.com",
    databaseURL: "https://chatapp-2a11f.firebaseio.com",
    projectId: "chatapp-2a11f",
    storageBucket: "chatapp-2a11f.appspot.com",
    messagingSenderId: "157134947168",
    appId: "1:157134947168:web:3304e879a09e45931a5405",
    measurementId: "G-PCW5869LNL"
};*/

//base de datos hugo alberto
var firebaseConfig = {
    apiKey: "AIzaSyBQxF15lOBk4qejuvnw9h-4yLe48Xe20NE",
    authDomain: "chatapp-98d00.firebaseapp.com",
    databaseURL: "https://chatapp-98d00.firebaseio.com",
    projectId: "chatapp-98d00",
    storageBucket: "chatapp-98d00.appspot.com",
    messagingSenderId: "1017162347060",
    appId: "1:1017162347060:web:472317d8d5adac4e491061",
    measurementId: "G-0GYGF64HTC"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore();
//db.settings ({ timestampsInSnapshots: true });
//fin configuracion firebase

//crea un row con la informacion del chat
function renderChat(doc,nchats){
    //crea los elementos
    let divrow = document.createElement('div');
    let divicon = document.createElement('div');
    let img = document.createElement('img');
    let divcontent = document.createElement('div');
    let divtoprow = document.createElement('div');
    let divchatname = document.createElement('div');
    let divtimedate = document.createElement('div');
    let divbottomrow = document.createElement('div');
    let divcontactname = document.createElement('div');
    let divstatus = document.createElement('div');

    //atributos
    divrow.setAttribute('class', "row");
    divrow.setAttribute('data-id', doc.id);
    
    if(doc.data().from==miusuario){
        divrow.setAttribute('data-contact', doc.data().to);
    }
    else{
        divrow.setAttribute('data-contact', doc.data().from);
    }
    
    divicon.setAttribute('class', "icon");
    img.setAttribute('src',"images/btnstatus.png");
    img.setAttribute('alt', "Avatar");
    img.setAttribute('height', "30px");
    img.setAttribute('width', "30px");
    divcontent.setAttribute('class', "content");
    divtoprow.setAttribute('class', "top-row");
    divchatname.setAttribute('class', "chatname");
    divtimedate.setAttribute('class', "timedata");
    divbottomrow.setAttribute('class', "bottom-row");
    divcontactname.setAttribute('class', "contactname");
    divstatus.setAttribute('class',"status");

    //ejecucion de elementos
    divrow.appendChild(divicon);
    divicon.appendChild(img);
    divrow.appendChild(divcontent);
    divcontent.appendChild(divtoprow);
    divcontent.appendChild(divbottomrow);
    divtoprow.appendChild(divchatname)
    divtoprow.appendChild(divtimedate);
    divbottomrow.appendChild(divcontactname)
    divbottomrow.appendChild(divstatus);

    //informacion de firebase
    if(doc.data().from==miusuario){
        divchatname.textContent = doc.data().to;
    }
    else{
        divchatname.textContent = doc.data().from;
    }
    divtimedate.textContent = doc.data().timestamp.toDate().toLocaleString();
    divcontactname.textContent = doc.data().message.slice(0,25);
    divstatus.textContent = nchats;
    
    //agregar filas
    divrow.onclick = function(){
        clickchat(divrow.dataset.contact,doc);
    };
    document.querySelector('.tabchats').appendChild(divrow);
}

//obtener chat
db.collection('chat').orderBy('timestamp','desc').get().then((snapshot) => {
    var arrayConversaciones = {};
   
    snapshot.docs.forEach(doc => {
      
        if(doc.data().from==miusuario || doc.data().to==miusuario){
            if(doc.data().from!=miusuario){
                if(arrayConversaciones[doc.data().from]==undefined){
                    arrayConversaciones[doc.data().from]=[];
                    arrayConversaciones[doc.data().from].push(doc);
                }
                else{
                    arrayConversaciones[doc.data().from].push(doc);
                }
            }
            else if(doc.data().to!=miusuario){
                if(arrayConversaciones[doc.data().to]==undefined){
                    arrayConversaciones[doc.data().to]=[];
                    arrayConversaciones[doc.data().to].push(doc);
                }
                else{
                    arrayConversaciones[doc.data().to].push(doc);
                }
            }
        }
    });
  
    Object.entries(arrayConversaciones).forEach(([key, value]) => {
        //console.log(value[value.length-1]);
        renderChat(value[0],value.length);   
    });
    
});

document.addEventListener('DOMContentLoaded', function(){
    //añade el evento onclick a los botones de las diferentes pantallas
    document.querySelectorAll('#bottom-line').forEach(function (div){
        div.onclick = function(){
            var tabestados = document.querySelectorAll('#bottom-line');
            for (var i = 0; i<tabestados.length; i++){
                tabestados[i].style.borderBottom = '3px solid green';
            }
            div.style.borderBottom = '3px solid white';

            var tabs = document.querySelectorAll('#tabs');
            for (var i = 0; i<tabestados.length; i++){
                tabs[i].style.display = 'none';
                if(tabs[i].dataset.view == div.dataset.view){
                    tabs[i].style.display = 'block';
                }
            }
        };
    });

    //header scroll
    var lastScrollTop = 0;
    window.onscroll = function (){    
        var header;
        header =  document.querySelector('.header');
        var menu;
        menu =  document.querySelector('.menu');
        var st = window.pageYOffset || document.documentElement.scrollTop; 
       if (st > lastScrollTop){
          // downscroll code
          header.style.position = '';
          header.style.top = null;
          menu.style.top = 0;
       } else {
          // upscroll code
          header.style.position = 'sticky';
          header.style.top = 0;
          menu.style.top = "40px";
       }
       lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    };

    document.querySelectorAll('#appname').forEach(function (div){
        div.onclick = function(){
            duplicate();
        };
    });

    document.querySelectorAll('.send').forEach(function (div){
        div.onclick = function(){
            enviarmensaje(0);
        };
    });

    
});

//insertar y actualziar  en FIREBASE
function enviarmensaje(id){
    let fechahoy = new Date();
    let msg = document.getElementsByName("mensaje")[0].value;


    let btnsend = "";
    btnsend = document.querySelector('.send');

    if(id==0){//insertar nuevo registro
        // Add a new document in collection "cities"
        db.collection("chat").doc().set({
            from: miusuario,
            to: btnsend.getAttribute("data-contact"),
            timestamp: fechahoy,
            message: msg
        })
        .then(function() {
            console.log("Document successfully written!");
            //document.querySelector('.rowc').appendChild(divrow3);
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    }
    else{//actualizar registro
        //alert("update");
        db.collection("chat").doc(id).set({
            from: miusuario,
            to: btnsend.getAttribute("data-contact"),
            message: msg,
            timestamp: fechahoy
        })
        .then(function() {
            console.log("Document successfully written!");
            document.querySelectorAll('.send').forEach(function (div){
                div.onclick = function(){
                    enviarmensaje(0);
                };
            });
            var divrowelimando = document.getElementById("mensaje"+id);
            divrowelimando.style.display="none";
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    }
    db.collection("chat").where("timestamp", "==", fechahoy).get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            divrow3 = renderMensajeE(doc);
            document.querySelector('.rowc').appendChild(divrow3);
            var mensaje = document.getElementById('mensaje');
            mensaje.value = "";
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

//funcion para duplicar el registro con datos
function duplicate(){
    //se obtiene el elemento row que se encuentra dentro de tabchats
    var row = document.querySelector('.tabchats').innerHTML;
    //concatena la informacion de row, duplicando el renglon
    document.querySelector('.tabchats').innerHTML += row;

    //proceso para duplicar el elemento row de las llamadas
    var rowllamada = document.querySelector('.tabllamadas').innerHTML;
    document.querySelector('.tabllamadas').innerHTML += rowllamada;
};

//funcion para cuando se selecciona un chat
function clickchat(contact,documento){
    console.log(contact);
    console.log(documento.data().from);
    
    //simulacion de transicion entre pantallas
    var header =  document.querySelector('.header');
    var menu =  document.querySelector('.menu');
    var chats =  document.querySelector('.chats');
    var estados =  document.querySelector('.estados');
    var llamadas =  document.querySelector('.llamadas');
    var rows = document.querySelectorAll('.row');
    for (var i = 0; i<rows.length; i++){
        rows[i].style.display = 'none';
    }

    //oculta la pantalla principal
    header.style.display = 'none';
    menu.style.display = 'none';
    chats.style.display = 'none';
    estados.style.display = 'none';
    llamadas.style.display = 'none';

    var headerc =  document.querySelector('.headerc');
    var conversacion =  document.querySelector('.conversacion');
    var inputtext =  document.querySelector('.inputtext');

    //muestra la pantalla de la conversacion
    headerc.style.display = 'flex';
    conversacion.style.display = 'block';
    inputtext.style.display = 'flex';

    obtenerConversacion(contact);
    let nombrechat = "";
    let btnsend = "";
    btnsend = document.querySelector('.send');
    btnsend.setAttribute('data-contact', contact);

    nombrechat = document.querySelector('.contacto');
    nombrechat.textContent = contact;
}

//obtiene los chats con un contacto en especifico
function obtenerConversacion(contacto){
    var chats;
    var fecha="";
    
    //obtiene una captura de la coleccion chat
    db.collection('chat').orderBy('timestamp').get().then((snapshot) => {
        //console.log(snapshot.docs);
        //recorre los documentos de la coleccion
        snapshot.docs.forEach(doc => {
            //console.log(fecha+" "+doc.data().timestamp.toDate().toLocaleString());
            let day=doc.data().timestamp.toDate().getDate();
            let month=doc.data().timestamp.toDate().getMonth();
            let year=doc.data().timestamp.toDate().getFullYear();
            var fechadoc=day+" - "+month+" - "+year;

            //mensaje de contacto hacia mi
            if(doc.data().from==contacto && doc.data().to==miusuario){
                //valida cambio en la fecha
                if(fecha != fechadoc){  
                    fecha=fechadoc;
                    document.querySelector('.rowc').appendChild(renderFecha(fecha));
                }
                //crea el div con el mensaje
                document.querySelector('.rowc').appendChild(renderMensajeR(doc));
            }
            //mensaje de mi hacia concacto
            else if(doc.data().from==miusuario && doc.data().to==contacto){
                //valida cambio en la fecha
                if(fecha != fechadoc){  
                    fecha=fechadoc;
                    document.querySelector('.rowc').appendChild(renderFecha(fecha));
                }
                //crea el div con el mensaje
                document.querySelector('.rowc').appendChild(renderMensajeE(doc));
            }
        });
    });
}

function renderFecha(fecha){
    let divrow1 = document.createElement('div');
    let divfecha = document.createElement('div');
    
    divrow1.setAttribute('class', "row1");
    divfecha.setAttribute('class', "fecha");

    divrow1.appendChild(divfecha);

    divfecha.textContent = fecha;

    return divrow1;
}

function renderMensajeR(doc){
    let divrow2 = document.createElement('div');
    let divmensajeremitente = document.createElement('div');
    let divmensaje = document.createElement('div');
    let divhora = document.createElement('div');

    divrow2.setAttribute('class', "row2");
    divmensajeremitente.setAttribute('class', "mensajeremitente");
    divmensaje.setAttribute('class', "mensaje");
    divhora.setAttribute('class', "hora");

    divrow2.appendChild(divmensajeremitente);
    divmensajeremitente.appendChild(divmensaje);
    divmensajeremitente.appendChild(divhora);

    divmensaje.textContent = doc.data().message;
    divhora.textContent = doc.data().timestamp.toDate().getHours()+" : "+doc.data().timestamp.toDate().getMinutes();

    /*divmensajeremitente.onclick = function(){
        deletemensaje(divrow2, doc.id);
    };*/

    return divrow2;
}

function renderMensajeE(doc){
    let divrow3 = document.createElement('div');
    let divmensajeemisor = document.createElement('div');
    let divmensaje = document.createElement('div');
    let divhora = document.createElement('div');
    let iconoeditar = document.createElement('i');
    let iconoeliminar = document.createElement('i');

    divrow3.setAttribute('class', "row3");
    divmensajeemisor.setAttribute('class', "mensajeemisor");
    divrow3.setAttribute('id', "mensaje"+doc.id);
    divmensaje.setAttribute('class', "mensaje");
    divhora.setAttribute('class', "hora");
    iconoeditar.setAttribute('class', "glyphicon glyphicon-pencil");
    iconoeditar.setAttribute('id', "editarmensaje");
    iconoeliminar.setAttribute('class', "glyphicon glyphicon-trash");
    iconoeliminar.setAttribute('id', "editarmensaje");

    divrow3.appendChild(divmensajeemisor);
    divmensajeemisor.appendChild(divmensaje);
    divmensajeemisor.appendChild(divhora);
    divmensajeemisor.appendChild(iconoeditar);

    divmensaje.textContent = doc.data().message;
    divhora.textContent = doc.data().timestamp.toDate().getHours()+" : "+doc.data().timestamp.toDate().getMinutes();
    
    iconoeditar.onclick = function(){
        editarmensaje(doc.data().message, doc.id);
    }

    iconoeliminar.onclick = function(){
        deletemensaje(divrow3, doc.id);
    }

    divmensajeemisor.appendChild(iconoeditar);
    divmensajeemisor.appendChild(iconoeliminar);

    /*divmensajeemisor.onclick = function(){
        deletemensaje(divrow3, doc.id);
    };*/

    return divrow3;
}

function editarmensaje(mensaje, id){
    var inputMensaje = document.getElementById("mensaje");
    inputMensaje.value = mensaje;
    var send = document.getElementById("send");
    send.onclick = function(){
        enviarmensaje(id);
    };
}

function deletemensaje(div,id){
    //alert(id);
    if (confirm("¿Desea eliminar este mensaje?")) {
        console.log("Se inicio el proceso para eliminar el mensaje");
        div.style.display = "none";
        db.collection("chat").doc(id).delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    } else {
        console.log("Se cancelo el proceso para eliminar el mensaje");
    }
}
/*//funcion para regresar a la pantalla principal
function clickback(){
    
    //simulacion de transicion entre pantallas
    var header =  document.querySelector('.header');
    var menu =  document.querySelector('.menu');
    var chats =  document.querySelector('.chats');
    var estados =  document.querySelector('.estados');
    var llamadas =  document.querySelector('.llamadas');
    var rows = document.querySelectorAll('.row');
    for (var i = 0; i<rows.length; i++){
        rows[i].style.display = 'block';
    }

    //muestra la pantalla principal
    header.style.display = 'block';
    menu.style.display = 'block';
    chats.style.display = 'block';
    estados.style.display = 'block';
    llamadas.style.display = 'block';

    var headerc =  document.querySelector('.headerc');
    var conversacion =  document.querySelector('.conversacion');
    var inputtext =  document.querySelector('.inputtext');

    //oculta la pantalla de la conversacion
    headerc.style.display = 'none';
    conversacion.style.display = 'none';
    inputtext.style.display = 'none';
}*/