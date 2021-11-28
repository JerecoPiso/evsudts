
var settings =  Vue.createApp({
    delimiters: ['[', ']'],
    data(){
      return{
         password: '',
         password2: '',
         hint: '',
         dept: '',
         newusername: '',
         role: '',
         // for displaying dp
         photo: '',
         // for updating dp
         dp: '',
         newPhoto: '',
         toDisplayUsername: '',
 
         // for disabling enabling inputs
         passwordDisable: true,
         hintDisable: true,
         deptDisable: true,
         showPass: true,
         showRetypePass: true,
         departments: []
         
 
      }
    },
    mounted(){
         this.getUserInfo()
         this.getDepartments()
         // swal("Successfully approved all pending documents", 'Click the OK to continue', "success");
    }, 
    methods:{
     updateDept(){
           if(this.dept != ""){
             let data = new FormData()
             data.append("dept", this.dept)
             axios.post("/user/updatedept",data,{
                     headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
             }).then(function(response){
                 // alert(response.data)
                 if(response.data == "Success"){
                   settings.deptDisable =true
                   swal("Department updated successfully", 'Click the OK to continue', "success");
                 }else{
                   swal({icon: 'error',title: 'Oops...',text: response.data,})
                 }
                 
             }).catch(function(err){
               console.log(err)
             })
           }else{
             swal({icon: 'error',title: 'Oops...',text: "Hint can't be empty!",})
           }
       },
       updateHint(){
           if(this.hint != ""){
             let data = new FormData()
             data.append("hint", this.hint)
             axios.post("/user/updatehint",data,{
                     headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
             }).then(function(response){
                 // alert(response.data)
                 if(response.data == "Success"){
                   settings.hintDisable =true
                   swal('Hint updated successfully', 'Click the OK to continue', "success");
                 }else{
                   swal({icon: 'error',title: 'Oops...',text: response.data,})
                 }
                 
             }).catch(function(err){
               console.log(err)
             })
           }else{
             swal({icon: 'error',title: 'Oops...',text: "Hint can't be empty!",})
           }
       },
       updatePassword(){
             if(this.$refs.password.value == ""){
               swal({icon: 'error',title: 'Oops...',text: "Password is required!",})
             }else if(this.$refs.password.value.length < 8){
               swal({icon: 'error',title: 'Oops...',text: "Password must contain at least 8 characters!",})
             }else if(this.$refs.password.value != this.$refs.password2.value){
               swal({icon: 'error',title: 'Oops...',text: "Password didn't matched!",})
             }else{  
                   let data = new FormData()
                   data.append("password", this.$refs.password.value)
                   data.append("password2", this.$refs.password2.value)
                   axios.post("/user/updatepassword",data, {
                     headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
                   }).then(function(response){
                     if(response.data == "Success"){
                         settings.$refs.password2.type = "password"
                         settings.$refs.password.type = "password"
                         settings.$refs.password2.value = ""
                         settings.$refs.password.value = ""
                         swal("Password updated successfully", 'Click the OK to continue', "success");
                  
                     }else{
                         swal({icon: 'error',title: 'Oops...',text: response.data,})
                     }
                   }).catch(function(err){
                     console.log(err)
                   })
             }
       },
       handleDp(){
         settings.dp  = this.$refs.newdp.files[0]
         console.log(settings.dp.name)
       },
       updateDp(){
           if(settings.dp != ""){
               let data = new FormData()
               data.append("photo", this.dp)
               data.append("docname", this.dp.name)
               axios.post("/user/updatedp",data, {
                     headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
                   }).then(function(response){
                     if(response.data == "Success"){
                      $("#updateDp").modal("hide")
                       swal("Profile updated successfully", 'Click the OK to continue', "success");
                       //
                       settings.getUserInfo()
                       searchDoc.getUserInfo()
                       this.$refs.newdp.value = ''
                    }else{
                       swal({icon: 'error',title: 'Oops...',text: response.data,})
                    }
                   
                   }).catch(function(err){
                       console.log(err)
                   })
           }else{
                   swal({
                       icon: 'error',
                       title: 'Oops...',
                       text: "Please select a file",
                   })
           }
       },  
       updateUsername(){
           if(this.newusername != ""){
 
               let data = new FormData()
               data.append("username", this.newusername)
               axios.post("/user/updateusername",data, {
 
                 headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
                    
                 }).then(function(response){
                    if(response.data == "Success"){
                      $("#updateUname").modal("hide")
                       swal("Username updated successfully", 'Click the OK to continue', "success");
                       settings.getUserInfo()
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
                     text: "Username can't be empty!",
               })
           }
       },
       getUserInfo(){
         axios.get("/user/getuserinfo").then(function(response){
           // alert(response.data.photo)
           settings.dept = response.data.department
           settings.toDisplayUsername = response.data.username
           settings.newusername = response.data.username
           settings.role = response.data.role
           settings.photo = response.data.photo
           settings.hint = response.data.hint
           // alert(response.data.username)
         }).catch(function(err){
           console.log(err)
         })
       },
       getDepartments: function(){
               axios.get("/administrator/getdept").then(function(response){
                
                   settings.departments = response.data
                 
             
               })
         },
       showRetypePassword(){
         if(this.$refs.password2.type == "password"){
             this.$refs.password2.type = "text"
             this.showRetypePass = false
         }else{
             this.$refs.password2.type = "password"
             this.showRetypePass = true
         }
       },
       showPassword(){
         // alert(this.$refs.password.type)
         if(this.$refs.password.type == "password"){
             this.$refs.password.type = "text"
             this.showPass = false
         }else{
             this.$refs.password.type = "password"
             this.showPass = true
         }
       }
    }
 }).mount("#settings")
 