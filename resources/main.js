const form = document.getElementById("formulario");

form.addEventListener("submit", function(event){
    event.preventDefault(); //ya no envia la info de los inputs al servidor
    let transactionFormData = new FormData(form);
    let transactionObject = getTransactionObject(transactionFormData); //objeto con los datos de la transaction para el LocalStorage
    saveTransaction(transactionObject);
    insertRowTable(transactionObject); //inserta una fila en la tabla con los valores de los inputs
    form.reset(); //vacia todos los campos del formulario
});

document.addEventListener("DOMContentLoaded", function(event){      //se activa una vez se cargue el HTML y antes de los recursos (CSS y todo eso)
    let transactionObjArray = JSON.parse(localStorage.getItem("transactionData"));
    transactionObjArray.forEach(function(element){
        insertRowTable(element)
    });
    drawCategories();
});

function drawCategories(){
    let allCategories = ["Alquiler", "Comida", "Diversión", "Transporte"]

    for(let i=0; i < allCategories.length; i++){
        insertCategory(allCategories[i]);
    }

}

function insertCategory(categoryName){
    const selectElement = document.getElementById("transactionCategory");
    let htmlToInsert = `<option value="${categoryName}">${categoryName}</option>`;
    selectElement.insertAdjacentHTML("beforeend", htmlToInsert);    //inserta codigo html al final del elemento seleccionado
}

function getTransactionId(){
    let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1"; //cojo el ultimo id o el -1
    let newTransactionId = parseInt(lastTransactionId) + 1; //le sumo 1
    localStorage.setItem("lastTransactionId", newTransactionId.toString());
    return newTransactionId;
}

function getTransactionObject(transactionFormData){
    let transactionType = transactionFormData.get("transactionType")
    let transactionAmount = transactionFormData.get("transactionAmount")
    let transactionDescription = transactionFormData.get("transactionDescription")
    let transactionCategory = transactionFormData.get("transactionCategory")
    let transactionId = getTransactionId();
    
    return {"transactionType": transactionType, 
        "transactionAmount": transactionAmount,
        "transactionDescription": transactionDescription,
        "transactionCategory": transactionCategory,
        "transactionId" : transactionId
    }

}

function insertRowTable(transactionObject){
    let transactions = ["transactionType", "transactionAmount", "transactionDescription", "transactionCategory"];
    let transactionTableRef = document.getElementById("transactionTable");
    let newTransactionRowRef = transactionTableRef.insertRow(-1);
    newTransactionRowRef.setAttribute("data-transaction-id", transactionObject["transactionId"]);

    for(let i=0; i < transactions.length; i++){
        let newTypeCellRef = newTransactionRowRef.insertCell(i);
        newTypeCellRef.classList.add("itemTabla");
        newTypeCellRef.textContent = transactionObject[transactions[i]];
    }

    let newDeleteCell = newTransactionRowRef.insertCell(4); //creo la celda y le añado la clase itemTabla
    newDeleteCell.classList.add("itemTabla");
    let botonEliminar = document.createElement("button");   //creo el boton con su texto
    botonEliminar.textContent = "Eliminar";
    newDeleteCell.appendChild(botonEliminar);           //añado el boton a la celda

    botonEliminar.addEventListener("click", function(event){    //añado la funcion para eliminar al fila
        let deletedRow = event.target.parentNode.parentNode; //referencia a la fila que queremos eliminar
        let deletedRowId = deletedRow.getAttribute("data-transaction-id");
        deleteTransaction(deletedRowId)
        
        deletedRow.remove();    //elimina la fila del boton Eliminar que se presione, en el HTML


    });
}

function deleteTransaction(transactionId){
    let transactionObjArray = JSON.parse(localStorage.getItem("transactionData"));
    //transactionObjArray.filter((element) => element.transactionId !== transactionId) //crear un nuevo array sin el elemento con el indice buscado
                                                                                        //es ineficicente

    //buscamos el indice del elemento que queremos eliminar
    let transactionIndexInArray = transactionObjArray.findIndex(element => element.transactionId == transactionId);
    transactionObjArray.splice(transactionIndexInArray, 1) //elimina el elemento que está en ese indice

    //lo guardo
    let transactionArrayJSON = JSON.stringify(transactionObjArray);
    localStorage.setItem("transactionData", transactionArrayJSON);
}

function saveTransaction(transactionObject){
    //cojo el array de transacciones anterior o creo uno vacio si no existe
    let myTransactionArray = JSON.parse(localStorage.getItem("transactionData")) || [];

    //le añado el nuevo dato
    myTransactionArray.push(transactionObject);

    //lo guardo
    let transactionArrayJSON = JSON.stringify(myTransactionArray);
    localStorage.setItem("transactionData", transactionArrayJSON);
}