var docs = Vue.createApp({
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
         //  var u_score = this.newFilename.lastIndexOf("_")
         //  alert(this.newFilename.slice(0, u_score))
         //  this.newFilename = this.newFilename.slice(0, u_score)
           // alert(this.newFilenameId)
           if(this.newFilename == ""){

           }else if(this.newFilenameId == ""){

           }else{
             var u_score = this.newFilename.lastIndexOf("_")
         //  alert(this.newFilename.slice(0, u_score))
              let data = new FormData()
              data.append("id", this.newFilenameId)
              data.append("docname", this.newFilename)
              axios.post("/user/renamedoc",data, {
                      headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
                }).then(function(response){
                 if(response.data == "Success"){
                    $("#rename").modal("hide")
                     swal(response.data, 'Click the OK to continue', "success");
                     docs.getDocs()
                     
                     docs.newFilenameId = ''
                     docs.newFilename = ''
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
                       docs.getUnapprovedSharedDocs()
                       docs.getReceivedDoc()
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
           // alert(docname)
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
                     docs.getDocs()
                     $("#updateDoc").modal("hide")
                     doc.forUpdateDocInfo = {}
                   }else{
                     swal({
                           icon: 'error',
                           title: 'Oops...',
                           text: response.data,
                     })
                   }
                   // alert(response.data)
                }).catch(function(err){
                   console.log(err)
                })
           }else{
               alert("Error")
           }
       },
       cancelShare(index, id){
           // alert(id)
          
           if(id != ""){
               let data = new FormData()
               data.append("id", id)
               axios.post("/user/cancelshareddoc", data, {
                      headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
                }).then(function(response){

                  if(response.data == "Success"){
                     swal(response.data, 'Click the OK to continue', "success");
                     docs.pendingDocs.splice(index, 1)
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
                 docs.doctypes = response.data
           
             })
       },
       getDepartments: function(){
             axios.get("/administrator/getdept").then(function(response){
           
                 docs.departments = response.data
           
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
                       docs.getUnapprovedSharedDocs()
                       docs.getReceivedDoc()
                       // docs.getPendingSharedDocs()
                       
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
         // alert(this.toDeleteReceivedDocId)
         let data = new FormData()
           
           if(this.toDeleteReceivedDocId != ""){
             data.append('id', this.toDeleteReceivedDocId)
         
               axios.post("/user/deletereceiveddoc", data, {
                       headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
                     
                 }).then(function(response){
                     $("#deleteReceivedDocModal").modal('hide');
                     if(response.data == "Success"){
                       docs.getReceivedDoc()
                       swal(response.data, 'Click the OK to continue', "success");
                   
                     }else{
                       swal({
                         icon: 'error',
                         title: 'Oops...',
                         text: 'Something went wrong!',
                       })
                     }

                         docs.getDocs()
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
             // data.append("receiver_name", receiver_name)
             // data.append("docid", this.shareDocInfo.docid)
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
                   docs.getUnapprovedSharedDocs()
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
             docs.share()
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
                     docs.shareDocInfo = {}
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
             // alert(response.data)
            
             var doc_length = response.data.length
             if(doc_length >= 10){
                    var ctr = doc_length/10;
                    
                    for(var i = 1; i <= Math.floor(ctr); i++){

                        docs.limitToShow.push(10*i)
                
                    
                    }
                    if(Math.floor(ctr)*10 != doc_length){
                    docs.limitToShow.push(doc_length)
                    
                    }
                   docs.docsToShowCtr = 10
             }else{
               docs.limitToShow.push(doc_length)
               docs.docsToShowCtr = doc_length
             }
           
             docs.documents = response.data
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

                         docs.limitToShowReceived.push(10*i)

                         }
                         if(Math.floor(ctr)*10 != doc_length){
                           docs.limitToShowReceived.push(doc_length)
                           
                         }
                               docs.receivedToShowCtr = 10
                         }else{
                           docs.limitToShowReceived.push(doc_length)
                           docs.receivedToShowCtr = doc_length
                         }
                       
                   docs.receivedDocs = response.data
               }
                
           }).catch(function(err){
             console.log(err)
           })
       },
       getPendingSharedDocs: function(){
         this.pendingDocs = []
           axios.get("/user/getpendingshareddocs").then(function(response){
             // alert(response.data)
             docs.pendingDocs = response.data
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

                         docs.limitToShowUnapproved.push(10*i)

                         }
                         if(Math.floor(ctr)*10 != doc_length){
                           docs.limitToShowUnapproved.push(doc_length)
                           
                         }
                               docs.unapprovedToShowCtr = 10
                         }else{
                           docs.limitToShowUnapproved.push(doc_length)
                           docs.unapprovedToShowCtr = doc_length
                         }
                       
                   docs.shareddocs = response.data
               }
          
           }).catch(function(err){
             console.log(err)
           })
       },
       getUsers: function(){
           axios.get("/user/getusers").then(function(response){
             // alert(response.data)
             docs.users = response.data
          
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

                         docs.limitToShowUnapproved.push(10*i)

                         }
                         if(Math.floor(ctr)*10 != doc_length){
                           docs.limitToShowUnapproved.push(doc_length)
                           
                         }
                               docs.unapprovedToShowCtr = 10
                         }else{
                           docs.limitToShowUnapproved.push(doc_length)
                           docs.unapprovedToShowCtr = doc_length
                         }
                       
                   docs.shareddocs = response.data
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

                         docs.limitToShow.push(10*i)

                         }
                         if(Math.floor(ctr)*10 != doc_length){
                           docs.limitToShow.push(doc_length)
                           
                         }
                               docs.docsToShowCtr = 10
                         }else{
                           docs.limitToShow.push(doc_length)
                           docs.docsToShowCtr = doc_length
                         }
                       
                   docs.documents = response.data
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

                         docs.limitToShowReceived.push(10*i)

                         }
                         if(Math.floor(ctr)*10 != doc_length){
                           docs.limitToShowReceived.push(doc_length)
                           
                         }
                               docs.receivedToShowCtr = 10
                         }else{
                           docs.limitToShowReceived.push(doc_length)
                           docs.receivedToShowCtr = doc_length
                         }
                       
                   docs.receivedDocs = response.data
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

                         docs.getDocs()
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
         //  alert(this.fileToSend)
         // alert(this.filesToUpload.name)
         //  this.totalToUploadFiles = this.filesToUpload.length
       },
       uploadDocument: function () {
             let data = new FormData()
            
             if((this.filesToUpload && docs.docInfo.desc && docs.docInfo.type && docs.docInfo.dept) != ""){
               data.append('file', this.filesToUpload)
               data.append('desc', docs.docInfo.desc)
               data.append('type', docs.docInfo.type)
               data.append('dept', docs.docInfo.dept)
               axios.post('/user/uploaddoc', data,
                     {
                         headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
                       
                     }
                       ).then(function(response){
                         if(response.data.message == "Success"){
                           console.log(response.data)
                           $("#myModal").modal('hide');

         
                         
                           swal(response.data.message, 'Clicked the OK to continue', "success");
                         
                           
                           docs.docResponseInfo.traceid = response.data.traceid
                           docs.docResponseInfo.qrcode = response.data.qrname
                           docs.docResponseInfo.dept = response.data.dept
                           docs.docResponseInfo.type = response.data.type
                           docs.docResponseInfo.date = response.data.date
                           docs.docResponseInfo.desc = response.data.desc
                           docs.docResponseInfo.status = response.data.status
                           docs.docResponseInfo.docname = response.data.docname

                           document.getElementById("file").value = ''
                           docs.docInfo.type = ''
                           docs.docInfo.dept = ''
                           docs.docInfo.desc = ''
                           
                          
                             $("#showDocInfo").modal('show');
                          
                           
                           
                     
                         }else{
                               swal({
                                   icon: 'error',
                                   title: 'Oops...',
                                   text: response.data.message,
                               })
                         }
           
                           docs.getDocs()
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
            
             if((this.fileToSend && docs.sendDocInfo.comment && docs.sendDocInfo.type && docs.sendDocInfo.dept) != ""){
               data.append('file', this.fileToSend)
               data.append('comment', docs.sendDocInfo.comment)
               data.append('type', docs.sendDocInfo.type)
               data.append('dept', docs.sendDocInfo.dept)
               data.append('receiver_id', docs.sendDocInfo.receiver_id)
               // alert(docs.sendDocInfo.receiver_id)
               axios.post('/user/senddoc', data,
                     {
                         headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
                       
                     }
                       ).then(function(response){
                         if(response.data == "Success"){
                           console.log(response.data)
                           $("#sendDoc").modal('hide');

         
                         
                           swal("Send successfully", 'Clicked the OK to continue', "success");
                         

                           document.getElementById("filetosend").value = ''
                           docs.sendDocInfo.type = ''
                           docs.sendDocInfo.dept = ''
                           docs.sendDocInfo.comment = ''
                           docs.sendDocInfo.receiver_id = ''
                           
                          
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
 }).mount('#docs')