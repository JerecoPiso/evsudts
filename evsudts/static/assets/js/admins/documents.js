
var docs = Vue.createApp({
    delimiters: ['[', ']'],
    data(){
        return{
            docInfo: {id: '', desc: '', type: '', dept: ''},
          
            forUpdateDocInfo: {id: '', docname: '', dept: '', type: '', desc: ''},
            docResponseInfo: {comment: '', traceid: '', docname: '', qrcode: '', dept: '', type: '', date: '', desc: '', status: '', sender: ''},
            fileToUpload: '',
            limitApproved: [],
            limitPending: [],
            limitShared: [],
            toShowApproved: '',
            toShowPending: '',
            toShowShared: '',

            departments: [],
            approvedDocs: [],
            pendingDocs: [],
            sharedDocs: [],
            
            toDeleteDocId: '',
            filterApprovedDocs: '',
            filterPendingDocs: '',
            filterSharedDocs: '',
            doctypes: [],
            newFilename: '',
            newFilenameId: '',
            toRejectDocId: '',
            toDeleteReceivedDocId: ''
        }
    },
    mounted(){
        this.getApprovedDocs()
        this.getPendingDocs()
        this.getSharedDocs()
        this.getDoctypes()
        setInterval(time,1000)
        getDepartments()
       
    },
    methods: {

      downloadDoc(docname){
            window.location.href="/user/download/"+docname
            
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
                        docs.getSharedDocs()
                        swal(response.data, 'Click the OK to continue', "success");
                        docs.toDeleteReceivedDocId = ""
                      }else{
                        swal({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Something went wrong!',
                        })
                      }

                          
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
        rejectPendingDoc: function(){
      
          let data = new FormData()
          data.append("id", this.toRejectDocId)
          axios.post("/administrator/rejectpendingdoc", data,  {
          headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  

          } ).then(function(response){
              if(response.data == "Success"){
                $("#rejectDoc").modal("hide")
                docs.getPendingDocs()
                swal(response.data, 'Click the OK to continue', "success");
                this.toRejectDocId = ''
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
                      swal(response.data, 'Click the OK to continue', "success");
                      docs.getApprovedDocs()
                      $("#rename").modal("hide")
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
        getDoctypes: function(){
              axios.get("/administrator/getdoctypes").then(function(response){
                  
                  docs.doctypes = response.data
            
              })
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
                      docs.getApprovedDocs()
                      $("#updateDoc").modal("hide")
                      docs.forUpdateDocInfo = {}
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
                    text: "All fields must be filled up!",
              })
            }
        },
        deleteTemporarilyDoc(){
            // alert(this.toDeleteDocId)
            let data = new FormData()
        
        if(this.toDeleteDocId != ""){
          data.append('id', this.toDeleteDocId)
      
            axios.post("/user/deletefile", data, {
                    headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
                  
              }).then(function(response){
                  $("#deleteDoc").modal('hide');
                  if(response.data == "Success"){
                    swal(response.data, 'Click the OK to continue', "success");
                 
                  }else{
                    swal({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Something went wrong!',
                    })
                  }

                      docs.getApprovedDocs()
                      docs.getPendingDocs()
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
           this.fileToUpload = this.$refs.file.files[0]
        
        },
        uploadDocument: function () {
              let data = new FormData()
          
              if((docs.docInfo.desc && docs.docInfo.type && docs.docInfo.dept) != ""){
                data.append('file', this.fileToUpload)
                data.append('desc', docs.docInfo.desc)
                data.append('type', docs.docInfo.type)
                data.append('dept', docs.docInfo.dept)
                axios.post('/user/uploaddoc', data,
                      {
                          headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
                        
                      }
                        ).then(function(response){
                          if(response.data.message == "Success"){
                            // console.log(response.data)
                            $("#myModal").modal('hide');

          
                          
                            swal(response.data.message, 'Clicked the OK to continue', "success");
                          
                            
                            docs.docResponseInfo.traceid = response.data.traceid
                            docs.docResponseInfo.qrcode = response.data.qrname
                            docs.docResponseInfo.dept = response.data.dept
                            docs.docResponseInfo.type = response.data.type
                            docs.docResponseInfo.date = response.data.date
                            docs.docResponseInfo.desc = response.data.desc
                            docs.docResponseInfo.status = response.data.status

                            document.getElementById("file").value = ''
                            docs.docInfo.type = ''
                            docs.docInfo.dept = ''
                            docs.docInfo.desc = ''
                            
                           
                              $("#addDoc").modal('hide');
                           
                            
                            
                      
                          }else{
                                swal({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: response.data.message,
                                })
                          }
            
                            docs.getApprovedDocs()
                            docs.getPendingDocs()
                })
              }else{
               
                    swal({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'All fields must be filled up!',
                    })
              }
              
          },
        approvedDoc(id){
            let data = new FormData()
            data.append("id", id)

                axios.post("/administrator/approveddoc", data,  {headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value}}).then(function(response){
                          
                    if(response.data == "Success"){
                            docs.getPendingDocs()
                            docs.getApprovedDocs()
                            swal(response.data, 'Click the OK to continue', "success");
                        
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
        approvedAllPendingDocs(){
        
                axios.get("/administrator/approvedallpendingdoc").then(function(response){
                          
                    if(response.data == "Success"){
                            docs.getPendingDocs()
                            docs.getApprovedDocs()
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
        getDocName(doc){
           var dot = doc.lastIndexOf("_")
           return doc.slice(0, dot)
        },
        getSharedDocs(){
            this.limitShared = []
            this.sharedDocs = []
            axios.get("/administrator/getshareddocs").then(function(response){
            
                       if(response.data.length > 0){
                            var length = response.data.length
                            if(length >= 10){
                            var ctr = length/10;
                            
                            for(var i = 1; i <= Math.floor(ctr); i++){

                                docs.limitShared.push(10*i)

                                }
                                if(Math.floor(ctr)*10 != length){
                                    docs.limitShared.push(length)
                                    
                                }
                                docs.toShowShared = 10
                                }else{
                                    docs.limitShared.push(length)
                                    docs.toShowShared = length
                                }
                                
                                docs.sharedDocs = response.data
                         }
                   }).catch(function(err){
                       console.log(err)
                   })
        },
        getApprovedDocs(){
            this.limitApproved = []
            this.approvedDocs = []
            axios.get("/administrator/getapproveddocs").then(function(response){
                    //    users.usersList = response.data
                    // alert("sdf")
                       if(response.data.length > 0){
                            var length = response.data.length
                            if(length >= 10){
                            var ctr = length/10;
                            
                            for(var i = 1; i <= Math.floor(ctr); i++){

                                docs.limitApproved.push(10*i)

                                }
                                if(Math.floor(ctr)*10 != length){
                                    docs.limitApproved.push(length)
                                    
                                }
                                docs.toShowApproved = 10
                                }else{
                                    docs.limitApproved.push(length)
                                    docs.toShowApproved = length
                                }
                                
                                docs.approvedDocs = response.data
                         }
                   }).catch(function(err){
                       console.log(err)
                   })
        },
        searchApprovedDocs(){
            this.limitApproved = []
            this.approvedDocs = []
            let data = new FormData()
            // alert(this.filterApprovedDocs)
            data.append("search", this.filterApprovedDocs)
            axios.post("/administrator/searchapproved", data ,{headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value}} ).then(function(response){
                    //    users.usersList = response.data
                    // alert("sdf")
                       if(response.data.length > 0){
                            var length = response.data.length
                            if(length >= 10){
                            var ctr = length/10;
                            
                            for(var i = 1; i <= Math.floor(ctr); i++){

                                docs.limitApproved.push(10*i)

                                }
                                if(Math.floor(ctr)*10 != length){
                                    docs.limitApproved.push(length)
                                    
                                }
                                docs.toShowApproved = 10
                                }else{
                                    docs.limitApproved.push(length)
                                    docs.toShowApproved = length
                                }
                                
                                docs.approvedDocs = response.data
                         }
                   }).catch(function(err){
                       console.log(err)
                   })
        },
        searchPendingDocs(){
            this.limitPending = []
            this.pendingDocs = []
            let data = new FormData()
            // alert(this.filterApprovedDocs)
            data.append("search", this.filterPendingDocs)
            axios.post("/administrator/searchpending", data ,{headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value}} ).then(function(response){
                    //    users.usersList = response.data
                    // alert("sdf")
                       if(response.data.length > 0){
                            var length = response.data.length
                            if(length >= 10){
                            var ctr = length/10;
                            
                            for(var i = 1; i <= Math.floor(ctr); i++){

                                docs.limitPending.push(10*i)

                                }
                                if(Math.floor(ctr)*10 != length){
                                    docs.limitPending.push(length)
                                    
                                }
                                docs.toShowPending = 10
                                }else{
                                    docs.limitPending.push(length)
                                    docs.toShowPending = length
                                }
                                
                                docs.pendingDocs = response.data
                         }
                   }).catch(function(err){
                       console.log(err)
                   })
        },
        searchSharedDocs(){
            this.limitShared = []
            this.sharedDocs = []
            let data = new FormData()
            // alert(this.filterApprovedDocs)
            data.append("search", this.filterSharedDocs)
            axios.post("/administrator/searchshared", data ,{headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value}} ).then(function(response){
                    //    users.usersList = response.data
                    // alert("sdf")
                       if(response.data.length > 0){
                            var length = response.data.length
                            if(length >= 10){
                            var ctr = length/10;
                            
                            for(var i = 1; i <= Math.floor(ctr); i++){

                                docs.limitShared.push(10*i)

                                }
                                if(Math.floor(ctr)*10 != length){
                                    docs.limitShared.push(length)
                                    
                                }
                                docs.toShowShared = 10
                                }else{
                                    docs.limitShared.push(length)
                                    docs.toShowShared = length
                                }
                                
                                docs.sharedDocs = response.data
                         }
                   }).catch(function(err){
                       console.log(err)
                   })
        },
        getPendingDocs(){
            this.limitPending = []
            this.pendingDocs = []
            axios.get("/administrator/getpendingdocs").then(function(response){
                    //    users.usersList = response.data
                    // alert(response.data)
                       if(response.data.length > 0){
                            var length = response.data.length
                            if(length >= 10){
                            var ctr = length/10;
                            
                            for(var i = 1; i <= Math.floor(ctr); i++){

                                docs.limitPending.push(10*i)

                                }
                                if(Math.floor(ctr)*10 != length){
                                    docs.limitPending.push(length)
                                    
                                }
                                docs.toShowPending = 10
                                }else{
                                    docs.limitPending.push(length)
                                    docs.toShowPending = length
                                }
                                
                                docs.pendingDocs = response.data
                                
                         }
                   }).catch(function(err){
                   
                    console.log(err)
                   })
        },
    }
}).mount("#docs")