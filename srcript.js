$(document).ready(function() {
    // Verificar la compatibilidad de IndexedDB en el navegador
    if (!window.indexedDB) {
      console.log("Tu navegador no soporta IndexedDB.");
      return;
    }
  
    var db;
    var request = window.indexedDB.open("tablaDB", 1);
  
    request.onerror = function(event) {
      console.log("Error al abrir la base de datos: " + event.target.errorCode);
    };
  
    request.onupgradeneeded = function(event) {
      db = event.target.result;
      var selectedType = getTypeFromUser(); // Obtén el tipo seleccionado por el usuario de alguna manera
      var objectStore = db.createObjectStore(selectedType, { keyPath: "id", autoIncrement: true });
      objectStore.createIndex("name", "name", { unique: false });
      objectStore.createIndex("type", "type", { unique: false });
      objectStore.createIndex("desc", "desc", { unique: false });
    };
    
  
    request.onsuccess = function(event) {
      db = event.target.result;
      // Restaurar los datos guardados en IndexedDB
      var transaction = db.transaction(["tabla"], "readonly");
      var objectStore = transaction.objectStore("tabla");
      var request = objectStore.openCursor();
  
      request.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          var count = cursor.value.id;
          var name = cursor.value.name;
          var type = cursor.value.type;
          var desc = cursor.value.desc;
          var newRow = '<tr class="child"><td>' + count + '</td><td>' + name + '</td class="change"><td>' + type + '</td class="change"><td>' + desc + '</td></tr>';
      
          // Agregar la fila a la tabla correspondiente según el tipo
          var tableId = getTableIdByType(type); // Obtén el id de la tabla según el tipo seleccionado
          $('#' + tableId + ' tbody').append(newRow);
      
          cursor.continue();
        }
      };
      function getTableIdByType(type) {
        var tableIdMap = {
          'Front-end': 'myTable1',
          'Back-end': 'myTable2'
        };
      
        return tableIdMap[type] || 'myTable'; // Si no se encuentra un mapeo, se utiliza 'myTable' como valor predeterminado
      }
      
 

  
      transaction.oncomplete = function() {
        console.log("Datos restaurados desde IndexedDB.");
      };
    };
  
    $('#save').on('click', function() {
      var name = $('#name').val();
      var type = $('#type').val();
      var desc = $('#desc').val();
    
      if (name.trim() !== "" && type.trim() !== "" && desc.trim() !== "") {
        var transaction = db.transaction(["tabla"], "readwrite");
        var objectStore = transaction.objectStore("tabla");
        var request = objectStore.add({ name: name, type: type, desc: desc });
    
        request.onsuccess = function(event) {
          var count = event.target.result;
          var newRow = '<tr class="child"><td>' + count + '</td><td>' + name + '</td><td>' + type + '</td class="change"><td>' + desc + '</td></tr>';
          
          // Agregar la fila a la tabla correspondiente según el tipo
          if (type === 'Front-end') {
            $('#myTable1 tbody').append(newRow);
          } else if (type === 'Back-end') {
            $('#myTable2 tbody').append(newRow);
          }
          
          console.log("Datos guardados en IndexedDB.");
        };
    
        transaction.oncomplete = function() {
          console.log("Transacción completada.");
          // Limpiar los campos del formulario después de guardar
          $('#name').val('');
          $('#type').val('');
          $('#desc').val('');
        };
      }
    });
    
  });
  document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe
  
    // Obtiene el valor seleccionado del formulario select
    var selectedOption = document.querySelector('.form-select').value;
  
    // Redirige al usuario al archivo HTML correspondiente
    if (selectedOption === '0') {
      window.location.href = 'coordinador.html';
    } else if (selectedOption === '1') {
      window.location.href = 'front.html';
    } else if (selectedOption === '2') {
      window.location.href = 'back.html';
    } else if (selectedOption === '3') {
      window.location.href = 'seguridad.html';
      
      
    }
  });  
  const saveBtn = document.getElementById('save');
  const msj = document.getElementById('msj');
  
  saveBtn.addEventListener('click', function() {
    msj.classList.remove('hide');
    setTimeout(function() {
      window.location.href = 'ingreso.html';
    }, 1000); 
  });
  





