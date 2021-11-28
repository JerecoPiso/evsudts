
var bin = Vue.createApp({ 
    delimiters: ['[', ']'],
    data(){
      return{
            removedDocs: [],
            docId: '',
            limitToShow: [],
            docsToShowCtr: '',
            filterSearch: ''
  
      }
    },
    mounted: function(){
      setInterval(time, 1000)	
        this.getRemovedDocs()
    },
    methods:{
      searchRemovedDocs: function(){
            this.removedDocs = []
            let data = new FormData()
            this.limitToShow = []
            data.append("search", this.filterSearch)
              axios.post("/user/searchremoveddocs", data , {
                          headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
                        
                    }).then(function(response){
  
                     if(response.data.length > 0){
                      var doc_length = response.data.length
                        if(doc_length >= 10){
                        var ctr = doc_length/10;
                        
                        for(var i = 1; i <= Math.floor(ctr); i++){
  
                          bin.limitToShow.push(10*i)
  
                            }
                            if(Math.floor(ctr)*10 != doc_length){
                              bin.limitToShow.push(doc_length)
                              
                            }
                               bin.docsToShowCtr = 10
                            }else{
                              bin.limitToShow.push(doc_length)
                              bin.docsToShowCtr = doc_length
                            }
                          
                      bin.removedDocs = response.data
                  }
                   
             
              }).catch(function(err){
                console.log(err)
              })
          },
          getRemovedDocs: function(){
            this.removedDocs = []
            this.limitToShow = []
            axios.get("/user/getremoveddocs").then(function(response){
                // bin.removedDocs = response.data
                // alert(response.data)
                if(response.data.length > 0){
                      var doc_length = response.data.length
                        if(doc_length >= 10){
                        var ctr = doc_length/10;
                        
                        for(var i = 1; i <= Math.floor(ctr); i++){
  
                          bin.limitToShow.push(10*i)
  
                            }
                            if(Math.floor(ctr)*10 != doc_length){
                              bin.limitToShow.push(doc_length)
                              
                            }
                               bin.docsToShowCtr = 10
                            }else{
                              bin.limitToShow.push(doc_length)
                              bin.docsToShowCtr = doc_length
                            }
                          
                      bin.removedDocs = response.data
                  }
                // alert(response.data)
            }).catch(function(err){
              console.log(err)
            })
  
            
          },
          deleteDocumentPermanently: function(){
            
              let data = new FormData()
              data.append("id", this.docId)
              axios.post("/user/deletedocpermanently", data,  {
              headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
  
              } ).then(function(response){
                $("#deleteDocModal").modal("hide")
                  bin.getRemovedDocs()
                  swal(response.data, 'Click the OK to continue', "success");
                  this.docId = []
              }).catch(function(err){
                console.log(err)
              })
  
          },
          getDocName(doc){
             var dot = doc.lastIndexOf("_")
             return doc.slice(0, dot)
          },
          unRemovedDoc: function(){
           
              let data = new FormData()
              data.append("id", this.docId)
              axios.post("/user/unremoveddoc", data,  {
              headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
  
              } ).then(function(response){
                 $("#unRemovedDoc").modal("hide")
                 bin.getRemovedDocs()
                  swal(response.data, 'Click the OK to continue', "success");
                  // this.docId = []
              }).catch(function(err){
                console.log(err)
              })
          }
    }
  }).mount("#recyclebin")