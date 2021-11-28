
var doctype = Vue.createApp({
        delimiters: ['[', ']'],
         data(){
             return{
             
                 newType: '',
                 newNameType: '',
                 typeId: '',
                 types: [],
                 searchval: '',
                 limitToShow: [],
                 toShowCtr: ''
             }
   
         },
         mounted: function () {  
             setInterval(time,1000)
           
             this.getType()
        
         },
         methods:{
             addType: function() {
                
                 if(this.newType !=  ''){
                     let data = new FormData()
                     data.append("type", this.newType)
                    
                     axios.post("/administrator/addtype", data,  {headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value}}).then(function(response){
                        
                      if(response.data == "Success"){
                          doctype.getType()
                          doctype.newType = ''
                          $("#addType").modal("hide")
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
                 
                 }else{
                        swal({
                              icon: 'error',
                              title: 'Oops...',
                              text: "Document name should not be empty",
                          })
                    
                 }
            
             },
             deleteType: function(){
                 
              //    alert(this.typeId)
                 let data = new FormData()
                 data.append("id", doctype.typeId)
                 axios.post("/administrator/deletetype", data, {headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value}}).then(function(response){
                      if(response.data == "Success"){
                          doctype.getType()
                          $("#deleteType").modal("hide")
                          swal(response.data, 'Click the OK to continue', "success");
                      
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
             getType: function(){
              //    this.toShowCtr = ''
                 this.limitToShow = []
                 this.types = []
                 axios.get("/administrator/gettype").then(function(response){
                  if(response.data.length > 0){
                      var length = response.data.length
                    if(length >= 10){
                    var ctr = length/10;
                    
                    for(var i = 1; i <= Math.floor(ctr); i++){

                      doctype.limitToShow.push(10*i)

                        }
                        if(Math.floor(ctr)*10 != length){
                          doctype.limitToShow.push(length)
                          
                        }
                        doctype.toShowCtr = 10
                        }else{
                          doctype.limitToShow.push(length)
                          doctype.toShowCtr = length
                        }
                      
                        doctype.types = response.data
                   }
                         
                 }).catch(function(err){
                     console.log(err)
                 })
             },
             searchType: function(){
              //    this.toShowCtr = ''
                 this.limitToShow = []
                 this.types = []
                 let data = new FormData()
                 data.append("search", this.searchval)
                 axios.post("/administrator/searchtype",data, {headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value}}).then(function(response){
                  if(response.data.length > 0){
                      var length = response.data.length
                    if(length >= 10){
                    var ctr = length/10;
                    
                    for(var i = 1; i <= Math.floor(ctr); i++){

                      doctype.limitToShow.push(10*i)

                        }
                        if(Math.floor(ctr)*10 != length){
                          doctype.limitToShow.push(length)
                          
                        }
                        doctype.toShowCtr = 10
                        }else{
                          doctype.limitToShow.push(length)
                          doctype.toShowCtr = length
                        }
                      
                        doctype.types = response.data
                   }
                         
                 }).catch(function(err){
                     console.log(err)
                 })
             },
             updateType: function(){
              //    department.departments = []
                 let data = new FormData()
                 if(this.newNameType != ""){
                     data.append("id", this.typeId)
                     data.append("type", this.newNameType)
                     axios.post("/administrator/updatetype", data , {headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value}}).then(function(response){
                      if(response.data == "Success"){
                       
                          doctype.getType()
                          $("#updateType").modal("hide")
                          swal(response.data, 'Click the OK to continue', "success");
                          this.newNameType = ''
                      
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
                        text: "Department name should not be empty",
                    })
                 
                 }
                
             },
            
         }
     
     }).mount('#doctype')
