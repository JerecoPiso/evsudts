var mydocs = Vue.createApp({
    delimiters: ['[', ']'],
     data(){
         return{
           docInfo: {id: '', desc: '', type: '', dept: ''},
           sendDocInfo: {receiver_id: '', comment: '', type: '', dept: ''},
           docResponseInfo: {comment: '', traceid: '', docname: '', qrcode: '', dept: '', type: '', date: '', desc: '', status: '', sender: ''},
           forUpdateDocInfo: {id: '', docname: '', dept: '', type: '', desc: ''},
           shareDocInfo: {docid: '', receiver_id: '', comment: '', receiver_name: ''},
           receivedDocs: [],
           shareddocs: [],
           totalFiles: '',
           pendingDocs: [],
           filesToUpload: '',
           fileToSend: '',
           users: [],
           documents: [],
           toDeleteFile: '',
           limitToShow: [],
           limitToShowReceived: [],
           limitToShowUnapproved: [],
           docsToShowCtr: 0,
           receivedToShowCtr: 0,
           unapprovedToShowCtr: 0,
           filter: '',
           filterReceived: '',
           filterUnapprovedSharedDocs: '',
           toDeleteReceivedDocId: '',
           departments: [],
           toRejectDocId: '',
           doctypes: [],
           newFilename: '',
           newFilenameId: ''
          
         }

     },
     mounted: function () {
       setInterval(time, 1000)	
       // time()
         this.getDocs()
         this.getUsers()
         this.getUnapprovedSharedDocs()
         this.getReceivedDoc()
         // this.getPendingSharedDocs()
         this.getDepartments()
         this.getDoctypes()
     },
     methods:{
       rename(){
           if(this.newFilename == ""){

           }else if(this.newFilenameId == ""){

           }else{
             var u_score = this.newFilename.lastIndexOf("_")
      
              let data = new FormData()
              data.append("id", this.newFilenameId)
              data.append("docname", this.newFilename)
              axios.post("/user/renamedoc",data, {
                      headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
                }).then(function(response){
                 if(response.data == "Success"){
                    $("#rename").modal("hide")
                     swal(response.data, 'Click the OK to continue', "success");
                     mydocs.getDocs()
                     
                     mydocs.newFilenameId = ''
                     mydocs.newFilename = ''
                   }else{
                     swal({
                           icon: 'error',
                           title: 'Oops...',
                           text: response.data,
                     })
                   }
                }).catch(function(err){
                   console.log(err)
                })
           }
       },
       approvedAllPendingDocs(){
       
           axios.get("/user/approvedallpendingdoc").then(function(response){
                     
               if(response.data == "Success"){
                       mydocs.getUnapprovedSharedDocs()
                       mydocs.getReceivedDoc()
                       swal("Successfully approved all pending documents", 'Click the OK to continue', "success");
                   
               }else{
                       swal({
                           icon: 'error',
                           title: 'Oops...',
                           text: response.data,
                       })
               }
                 
           }).catch(function(err){

           })
       },
       downloadDoc(docname){
           window.location.href="/user/download/"+docname
         
       },
       updateDocument(){
           id = this.forUpdateDocInfo.id
           desc = this.forUpdateDocInfo.desc
           type = this.forUpdateDocInfo.type
           dept = this.forUpdateDocInfo.dept
           if((id && desc && type && dept) != ""){
               let data = new FormData()
               data.append("id", id)
               data.append("desc", desc)
               data.append("type", type)
               data.append("dept", dept)
               axios.post("/user/updatedocinfo", data,{
                      headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
                }).then(function(response){
                   if(response.data == "Success"){
                     swal(response.data, 'Click the OK to continue', "success");
                     mydocs.getDocs()
                     $("#updateDoc").modal("hide")
                     mydocs.forUpdateDocInfo = {}
                   }else{
                     swal({
                           icon: 'error',
                           title: 'Oops...',
                           text: response.data,
                     })
                   }
                
                }).catch(function(err){
                   console.log(err)
                })
           }else{
             swal({
                           icon: 'error',
                           title: 'Oops...',
                           text: 'All fields must be filled up!',
                     })
           }
       },
       cancelShare(index, id){
         
           if(id != ""){
               let data = new FormData()
               data.append("id", id)
               axios.post("/user/cancelshareddoc", data, {
                      headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
                }).then(function(response){

                  if(response.data == "Success"){
                     swal(response.data, 'Click the OK to continue', "success");
                     mydocs.pendingDocs.splice(index, 1)
                  }else{
                     swal({
                           icon: 'error',
                           title: 'Oops...',
                           text: response.data,
                     })
                  }

                }).catch(function(err){
                  console.log(err)
                })
           }else{
                   swal({
                         icon: 'error',
                         title: 'Oops...',
                         text: "Id can't be empty!",
                   })
           }
       },
       getDoctypes: function(){
             axios.get("/administrator/getdoctypes").then(function(response){
                 // alert(response.data)
                 mydocs.doctypes = response.data
           
             })
       },
       getDepartments: function(){
             axios.get("/administrator/getdept").then(function(response){
           
               mydocs.departments = response.data
           
             })
       },
       approvedDoc: function(id){

     
         let data = new FormData()
         data.append('id', id)
         axios.post("/user/approveddoc", data, {
           headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  

           }).then(function(response){
                   if(response.data == "Success"){
                       swal(response.data, 'Click the OK to continue', "success");
                       mydocs.getUnapprovedSharedDocs()
                       mydocs.getReceivedDoc()
                     
                   }else{
                     swal({
                         icon: 'error',
                         title: 'Oops...',
                         text: response.data,
                       })
                   }
           }).catch(function(err){
                   console.log(err)
               })

       },
       deleteReceivedDoc: function(){
        
         let data = new FormData()
           
           if(this.toDeleteReceivedDocId != ""){
             data.append('id', this.toDeleteReceivedDocId)
         
               axios.post("/user/deletereceiveddoc", data, {
                       headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
                     
                 }).then(function(response){
                     $("#deleteReceivedDocModal").modal('hide');
                     if(response.data == "Success"){
                       mydocs.getReceivedDoc()
                       swal(response.data, 'Click the OK to continue', "success");
                   
                     }else{
                       swal({
                         icon: 'error',
                         title: 'Oops...',
                         text: 'Something went wrong!',
                       })
                     }

                     mydocs.getDocs()
                 }).catch(function(err){
                     console.log(err)
                 })
           }else{
                 swal({
                         icon: 'error',
                         title: 'Oops...',
                         text: "ID can't be empty",
                     })
           }
       },
       rejectDoc: function(){
           alert(this.toRejectDocId)
           let data = new FormData()
             data.append("id", this.toRejectDocId)
        
             axios.post("/user/rejectdoc", data, {

                     headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
                     
                 }).then(function(response){
                   if(response.data == "Success"){
                     $("#rejectDoc").modal("hide")
                     swal(response.data, 'Click the OK to continue', "success");
                   }else{
                     swal({
                         icon: 'error',
                         title: 'Oops...',
                         text: response.data,
                       })
                   }
                   mydocs.getUnapprovedSharedDocs()
                 }).catch(function(err){
                   console.log(err)
                 })


       },
       show(){
         $("#comments").modal("show")
       },
       checkComment(){
           if(this.shareDocInfo.comment != ""){
             $("#comments").modal("hide")
             mydocs.share()
           }else{
             swal({
                 icon: 'error',
                 title: 'Oops...',
                 text: "Comment is required!",
             })
           }
       },
       share: function(){
         if(confirm('Are you sure want to share this document to '+this.shareDocInfo.receiver_name.toUpperCase()+"?") == true){
         
             let data = new FormData()
             data.append("receiver_id",  this.shareDocInfo.receiver_id)
             data.append("receiver_name",  this.shareDocInfo.receiver_name)
             data.append("docid", this.shareDocInfo.docid)
             data.append("comment", this.shareDocInfo.comment)
           
             axios.post("/user/sharefile", data, {

                     headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
                     
                 }).then(function(response){
                   if(response.data == "Success"){
                     $("#shareDoc").modal("hide")
                     swal(response.data, 'Click the OK to continue', "success");
                     mydocs.shareDocInfo = {}
                   }else{
                     swal({
                         icon: 'error',
                         title: 'Oops...',
                         text: response.data,
                       })
                   }
                   
                 }).catch(function(err){
                   console.log(err)
                 })

         }

       },
       getDocName(doc){
          var dot = doc.lastIndexOf("_")
          return doc.slice(0, dot)
       },
       getDocs: function(){
         this.limitToShow = []
         
           axios.get("/user/getdocs").then(function(response){
             
             var doc_length = response.data.length
             if(doc_length >= 10){
             var ctr = doc_length/10;
             
             for(var i = 1; i <= Math.floor(ctr); i++){

               mydocs.limitToShow.push(10*i)
           
               
             }
             if(Math.floor(ctr)*10 != doc_length){
               mydocs.limitToShow.push(doc_length)
               
             }
               mydocs.docsToShowCtr = 10
             }else{
               mydocs.limitToShow.push(doc_length)
               mydocs.docsToShowCtr = doc_length
             }
           
             mydocs.documents = response.data
           }).catch(function(err){
             console.log(err)
           })
       },
       getReceivedDoc: function(){
          this.limitToShowReceived = []
          this.receivedDocs = []
           axios.get("/user/getreceiveddoc").then(function(response){
             // alert(response.data)
             // docs.receivedDocs = response.data
             if(response.data.length > 0){
                   var doc_length = response.data.length
                     if(doc_length >= 10){
                     var ctr = doc_length/10;
                     
                     for(var i = 1; i <= Math.floor(ctr); i++){

                       mydocs.limitToShowReceived.push(10*i)

                         }
                         if(Math.floor(ctr)*10 != doc_length){
                           mydocs.limitToShowReceived.push(doc_length)
                           
                         }
                         mydocs.receivedToShowCtr = 10
                         }else{
                           mydocs.limitToShowReceived.push(doc_length)
                           mydocs.receivedToShowCtr = doc_length
                         }
                       
                           mydocs.receivedDocs = response.data
               }
                
           }).catch(function(err){
             console.log(err)
           })
       },
       getPendingSharedDocs: function(){
         this.pendingDocs = []
           axios.get("/user/getpendingshareddocs").then(function(response){
             // alert(response.data)
             mydocs.pendingDocs = response.data
             $("#pendingDocs").modal("show")
           }).catch(function(err){
             console.log(err)
           })
       },
       getUnapprovedSharedDocs: function(){
           this.limitToShowUnapproved = []
           this.shareddocs = []
           axios.get("/user/getunapprovedshareddocs").then(function(response){
             // alert(response.data)
             // docs.shareddocs = response.data
             if(response.data.length > 0){
                   var doc_length = response.data.length
                     if(doc_length >= 10){
                     var ctr = doc_length/10;
                     
                     for(var i = 1; i <= Math.floor(ctr); i++){

                       mydocs.limitToShowUnapproved.push(10*i)

                         }
                         if(Math.floor(ctr)*10 != doc_length){
                           mydocs.limitToShowUnapproved.push(doc_length)
                           
                         }
                          mydocs.unapprovedToShowCtr = 10
                         }else{
                           mydocs.limitToShowUnapproved.push(doc_length)
                           mydocs.unapprovedToShowCtr = doc_length
                         }
                       
                         mydocs.shareddocs = response.data
               }
          
           }).catch(function(err){
             console.log(err)
           })
       },
       getUsers: function(){
           axios.get("/user/getusers").then(function(response){
             // alert(response.data)
             mydocs.users = response.data
          
           }).catch(function(err){
             console.log(err)
           })
       },
       searchunapprovedshareddocs: function(){
         this.shareddocs = []
         let data = new FormData()
         this.limitToShowUnapproved = []
         data.append("search", this.filterUnapprovedSharedDocs)
           axios.post("/user/searchunapprovedshareddocs", data , {
                       headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
                     
                 }).then(function(response){

                  if(response.data.length > 0){
                   var doc_length = response.data.length
                     if(doc_length >= 10){
                     var ctr = doc_length/10;
                     
                     for(var i = 1; i <= Math.floor(ctr); i++){

                       mydocs.limitToShowUnapproved.push(10*i)

                         }
                         if(Math.floor(ctr)*10 != doc_length){
                           mydocs.limitToShowUnapproved.push(doc_length)
                           
                         }
                         mydocs.unapprovedToShowCtr = 10
                         }else{
                           mydocs.limitToShowUnapproved.push(doc_length)
                           mydocs.unapprovedToShowCtr = doc_length
                         }
                       
                         mydocs.shareddocs = response.data
               }
                
          
           }).catch(function(err){
             console.log(err)
           })
       },
       searchDocs: function(){
         this.documents = []
         let data = new FormData()
         this.limitToShow = []
         data.append("search", this.filter)
           axios.post("/user/searchdocs", data , {
                       headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
                     
                 }).then(function(response){

                  if(response.data.length > 0){
                   var doc_length = response.data.length
                     if(doc_length >= 10){
                     var ctr = doc_length/10;
                     
                     for(var i = 1; i <= Math.floor(ctr); i++){

                       mydocs.limitToShow.push(10*i)

                         }
                         if(Math.floor(ctr)*10 != doc_length){
                           mydocs.limitToShow.push(doc_length)
                           
                         }
                         mydocs.docsToShowCtr = 10
                         }else{
                           mydocs.limitToShow.push(doc_length)
                           mydocs.docsToShowCtr = doc_length
                         }
                       
                         mydocs.documents = response.data
               }
                
          
           }).catch(function(err){
             console.log(err)
           })
       },
       searchReceived: function(){
         this.receivedDocs = []
         let data = new FormData()
         this.limitToShowReceived = []
         data.append("search", this.filterReceived)
           axios.post("/user/searchreceived", data , {
                       headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
                     
                 }).then(function(response){

                  if(response.data.length > 0){
                   var doc_length = response.data.length
                     if(doc_length >= 10){
                     var ctr = doc_length/10;
                     
                     for(var i = 1; i <= Math.floor(ctr); i++){

                       mydocs.limitToShowReceived.push(10*i)

                         }
                         if(Math.floor(ctr)*10 != doc_length){
                           mydocs.limitToShowReceived.push(doc_length)
                           
                         }
                         mydocs.receivedToShowCtr = 10
                         }else{
                           mydocs.limitToShowReceived.push(doc_length)
                           mydocs.receivedToShowCtr = doc_length
                         }
                       
                         mydocs.receivedDocs = response.data
               }
                
          
           }).catch(function(err){
             console.log(err)
           })
       },
       deleteDocument: function () {
          
           let data = new FormData()
           // alert(this.docInfo.id)
           if(this.docInfo.id != ""){
             data.append('id', this.docInfo.id)
         
               axios.post("/user/deletefile", data, {
                       headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
                     
                 }).then(function(response){
                     $("#deleteDocModal").modal('hide');
                     if(response.data == "Success"){
                       swal(response.data, 'Click the OK to continue', "success");
                    
                     }else{
                       swal({
                         icon: 'error',
                         title: 'Oops...',
                         text: 'Something went wrong!',
                       })
                     }

                     mydocs.getDocs()
                 }).catch(function(err){
                     console.log(err)
                 })
           }else{
                 swal({
                         icon: 'error',
                         title: 'Oops...',
                         text: "ID can't be empty",
                     })
           }
      
       },
    
       handleFileUpload: function () {
          this.filesToUpload = this.$refs.file.files[0]
         // alert(this.filesToUpload.name)
         //  this.totalToUploadFiles = this.filesToUpload.length
       },
       handleFileSend: function () {
          this.fileToSend = this.$refs.filetosend.files[0]
         // alert(this.filesToUpload.name)
         //  this.totalToUploadFiles = this.filesToUpload.length
       },
       uploadDocument: function () {
             let data = new FormData()
            
             if((this.filesToUpload && mydocs.docInfo.desc && mydocs.docInfo.type && mydocs.docInfo.dept) != ""){
               data.append('file', this.filesToUpload)
               data.append('desc', mydocs.docInfo.desc)
               data.append('type', mydocs.docInfo.type)
               data.append('dept', mydocs.docInfo.dept)
               axios.post('/user/uploaddoc', data,
                     {
                         headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
                       
                     }
                       ).then(function(response){
                         if(response.data.message == "Success"){
                          //  console.log(response.data)
                           $("#myModal").modal('hide');

         
                         
                           swal(response.data.message, 'Clicked the OK to continue', "success");
                         
                           
                           mydocs.docResponseInfo.traceid = response.data.traceid
                           mydocs.docResponseInfo.qrcode = response.data.qrname
                           mydocs.docResponseInfo.dept = response.data.dept
                           mydocs.docResponseInfo.type = response.data.type
                           mydocs.docResponseInfo.date = response.data.date
                           mydocs.docResponseInfo.desc = response.data.desc
                           mydocs.docResponseInfo.status = response.data.status
                           mydocs.docResponseInfo.docname = response.data.docname

                           document.getElementById("file").value = ''
                           mydocs.docInfo.type = ''
                           mydocs.docInfo.dept = ''
                           mydocs.docInfo.desc = ''
                           
                          
                             $("#showDocInfo").modal('show');
                          
                           
                           
                     
                         }else{
                               swal({
                                   icon: 'error',
                                   title: 'Oops...',
                                   text: response.data.message,
                               })
                         }
           
                         mydocs.getDocs()
               })
             }else{
                   swal({
                     icon: 'error',
                     title: 'Oops...',
                     text: 'All fields must be filled up!',
                   })
             }
             
         },
         sendDocument: function () {
             let data = new FormData()
            
             if((this.fileToSend && mydocs.sendDocInfo.comment && mydocs.sendDocInfo.type && mydocs.sendDocInfo.dept) != ""){
               data.append('file', this.fileToSend)
               data.append('comment', mydocs.sendDocInfo.comment)
               data.append('type', mydocs.sendDocInfo.type)
               data.append('dept', mydocs.sendDocInfo.dept)
               data.append('receiver_id', mydocs.sendDocInfo.receiver_id)
               // alert(docs.sendDocInfo.receiver_id)
               axios.post('/user/senddoc', data,
                     {
                         headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
                       
                     }
                       ).then(function(response){
                         if(response.data == "Success"){
                          //  console.log(response.data)
                           $("#sendDoc").modal('hide');

         
                         
                           swal("Send successfully", 'Clicked the OK to continue', "success");
                         

                           document.getElementById("filetosend").value = ''
                           mydocs.sendDocInfo.type = ''
                           mydocs.sendDocInfo.dept = ''
                           mydocs.sendDocInfo.comment = ''
                           mydocs.sendDocInfo.receiver_id = ''
                           
                          
                             // $("#sendDoc").modal('hide');
                          
                           
                           
                     
                         }else{
                               swal({
                                   icon: 'error',
                                   title: 'Oops...',
                                   text: response.data,
                               })
                         }
           
                           // docs.g()
               })
             }else{
                   swal({
                     icon: 'error',
                     title: 'Oops...',
                     text: 'All fields must be filled up!',
                   })
             }
             
         },

      
     }
 }).mount('#mydocs')