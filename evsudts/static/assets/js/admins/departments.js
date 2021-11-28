var department = Vue.createApp({
    delimiters: ['[', ']'],
     data(){
         return{
             searchval: '',
             newDept: '',
             newNameDept: '',
             deptId: '',
             departments: [],
             responseMsg: '',
             limitToShow: [],
             toShowCtr: ''
         }

     },
     mounted: function () {  
         setInterval(time,1000)
       
         this.getDept()
    
     },
     methods:{
         addDept: function() {
           
             if(this.newDept !=  ''){
                 let data = new FormData()
                 data.append("dept", this.newDept)
                
                 axios.post("/administrator/adddept", data,  {headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value}}).then(function(response){
                    
                  if(response.data == "Success"){
                      department.getDept()
                      department.newDept = ''
                      $("#addDept").modal("hide")
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
                 alert("Department name should not be empty")
             }
        
         },
         deleteDept: function(){
             
             // alert(department.deptId)
             let data = new FormData()
             data.append("id", department.deptId)
             axios.post("/administrator/deletedept", data, {headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value}}).then(function(response){
                  if(response.data == "Success"){
                      department.getDept()
                      $("#deleteDept").modal("hide")
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
         getDept: function(){

             this.limitToShow = []
             this.departments = []
             axios.get("/administrator/getdept").then(function(response){
              if(response.data.length > 0){
                  var length = response.data.length
                if(length >= 10){
                var ctr = length/10;
                
                for(var i = 1; i <= Math.floor(ctr); i++){

                  department.limitToShow.push(10*i)

                    }
                    if(Math.floor(ctr)*10 != length){
                      department.limitToShow.push(length)
                      
                    }
                    department.toShowCtr = 10
                    }else{
                      department.limitToShow.push(length)
                      department.toShowCtr = length
                    }
                  
                  department.departments = response.data
               }
                     
             }).catch(function(err){
                 console.log(err)
             })
         },
         searchDept: function(){
          //    this.toShowCtr = ''
             this.limitToShow = []
             this.departments = []
             let data = new FormData()
             data.append("search", this.searchval)
             axios.post("/administrator/searchdept",data,  {headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value}}).then(function(response){
              if(response.data.length > 0){
                  var length = response.data.length
                if(length >= 10){
                var ctr = length/10;
                
                for(var i = 1; i <= Math.floor(ctr); i++){

                  department.limitToShow.push(10*i)

                    }
                    if(Math.floor(ctr)*10 != length){
                      department.limitToShow.push(length)
                      
                    }
                    department.toShowCtr = 10
                    }else{
                      department.limitToShow.push(length)
                      department.toShowCtr = length
                    }
                  
                  department.departments = response.data
               }
                     
             }).catch(function(err){
                 console.log(err)
             })
         },
         updateDept: function(){
          //    department.departments = []
             let data = new FormData()
             if(this.newNameDept != ""){
                 data.append("id", this.deptId)
                 data.append("dept", this.newNameDept)
                 axios.post("/administrator/updatedept", data , {headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value}}).then(function(response){
                  if(response.data == "Success"){
                      department.getDept()
                      $("#updateDept").modal("hide")
                      swal(response.data, 'Click the OK to continue', "success");
                      this.newNameDept = ''
                  
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
                 alert("Department name should not be empty")
             }
            
         },
        
     }
 
 }).mount('#departments')