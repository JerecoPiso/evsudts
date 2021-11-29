
var users = Vue.createApp({
    delimiters: ['[', ']'],
    data(){
        return{
            usersList: [],
            addUserAdmin: false,
            limitToShow: [],
            toShowCtr: '',
            departments: [],
            signupInfo: {username: '', password: '', password2: '', hint: '', dept: '', role: ''},
            signupInfoForEditting: {username: '', hint: '', dept: '', role: ''},
            viewpassword: true,
            viewpassword2: true,
            userId: '',
            stringsOnly: /^[a-zA-Z ]+$/,
            searchval: ''
        }
    },
    mounted: function(){    
            this.getDept()
            this.getUsers()
            setInterval(time,1000)
         //    getDepartments()
    },
    methods: {
        deleteUser(){
             if(this.userId != ""){
                 let data = new FormData()
                 data.append("id", this.userId)
                 axios.post('/administrator/deleteuser', data,  {headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value }}).then(function(response){
                         console.log(response.data.responseMsg)
                             if(response.data === 'Success'){
                                
                                 swal('User deleted successfully', 'Clicked the OK to continue', "success");
                                
                                 users.getUsers()
                                 $("#deleteUser").modal("hide")
                                 this.userId = ''
                                 
                             }else{
                                 swal({
                                     icon: 'error',
                                     title: 'Oops...',
                                     text:  response.data
                                 })
                             }
                 })
             }else{
                 swal({
                     icon: 'error',
                     title: 'Oops...',
                     text:  "ID can't bt empty!"
                 })
             }   

        },
         viewPass(){
             // alert(this.$refs.pass.type)
             if(this.$refs.pass.type == "password"){
                 this.viewpassword = false
                 this.$refs.pass.type = "text"
             }else{
                 this.viewpassword = true
                 this.$refs.pass.type = "password"
             }
         },
         viewPass2(){
             // alert(this.$refs.pass.type)
             if(this.$refs.pass2.type == "password"){
                 this.viewpassword2 = false
                 this.$refs.pass2.type = "text"
             }else{
                 this.viewpassword2 = true
                 this.$refs.pass2.type = "password"
             }
         },
         update: function(){
             uname = this.signupInfoForEditting.username

             hint = this.signupInfoForEditting.hint
             dept = this.signupInfoForEditting.dept
             role = this.signupInfoForEditting.role
             
             if(uname == ""){
                 // swal(response.data.message, 'Clicked the OK to continue', "success");
                     swal({
                         icon: 'error',
                         title: 'Oops...',
                         text: "Username must not be empty",
                     })
               
                
             }else if(!uname.match(this.stringsOnly)){
                 swal({
                         icon: 'error',
                         title: 'Oops...',
                         text: "Username must contain letters  only",
                 })
             
             }else if(hint == "" ){
                
                 swal({
                         icon: 'error',
                         title: 'Oops...',
                         text:  "Hint must not be empty",
                 })
             }else if(dept == ''){
               
                 swal({
                         icon: 'error',
                         title: 'Oops...',
                         text:  "Department must not be empty",
                 })
             }else if(role == ""){
                 swal({
                         icon: 'error',
                         title: 'Oops...',
                         text:  "Role must not be empty",
                 })
             }else{
               
                    let data = new FormData()
                    data.append('username', uname)
                    data.append('hint', hint)
                    data.append('role', role)
                    data.append('dept', dept)
                    data.append('id', this.userId)
                    
                    axios.post('/administrator/updateuser', data,  {headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value }}).then(function(response){
                     //    console.log(response.data.responseMsg)
                         if(response.data === 'Success'){
                             // alert(response.data.qrcodename)
                             swal('Updated successfully', 'Clicked the OK to continue', "success");
                             // signup.responseClass = 'success'
                             // signup.responseInfo = 'Signed up successfully'
                             users.getUsers()
                             users.signupInfoForEditting = {}
                             this.userId = ''
                             $("#editUser").modal("hide")
                         }else{
                             swal({
                                 icon: 'error',
                                 title: 'Oops...',
                                 text:  response.data
                             })
                         }
                    })
               
             }
        },
         signup: function(){
             uname = this.signupInfo.username
             pass = this.signupInfo.password
             pass2 = this.signupInfo.password2
             hint = this.signupInfo.hint
             dept = this.signupInfo.dept
             role = this.signupInfo.role
             
             if(uname == ""){
                 // swal(response.data.message, 'Clicked the OK to continue', "success");
                     swal({
                         icon: 'error',
                         title: 'Oops...',
                         text: "Username must not be empty",
                     })
               
                
             }else if(!uname.match(this.stringsOnly)){
                 swal({
                         icon: 'error',
                         title: 'Oops...',
                         text: "Username must contain letters  only",
                 })
             }else if(pass == ""){
                
                 swal({
                         icon: 'error',
                         title: 'Oops...',
                         text: "Password is empty!",
                 })

             }else if(pass.length < 8 ){  
                 
                 swal({
                         icon: 'error',
                         title: 'Oops...',
                         text: "Password must contain at least 8 characters!",
                 })
             }else if(hint == "" ){
                
                 swal({
                         icon: 'error',
                         title: 'Oops...',
                         text:  "Hint must not be empty",
                 })
             }else if(dept == ''){
               
                 swal({
                         icon: 'error',
                         title: 'Oops...',
                         text:  "Department must not be empty",
                 })
             }else if(role == ""){
                 swal({
                         icon: 'error',
                         title: 'Oops...',
                         text:  "Role must not be empty",
                 })
             }else{
                 if(pass == pass2){
                    let data = new FormData()
                    data.append('username', uname)
                    data.append('password', pass)
                    data.append('password2', pass2)
                    data.append('hint', hint)
                    data.append('role', role)
                    data.append('dept', dept)
                    
                    axios.post('/register', data,  {headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value }}).then(function(response){
                        console.log(response.data.responseMsg)
                         if(response.data.responseMsg === 'Success'){
                             // alert(response.data.qrcodename)
                             swal('Signed up successfully', 'Clicked the OK to continue', "success");
                             // signup.responseClass = 'success'
                             // signup.responseInfo = 'Signed up successfully'
                             users.getUsers()
                             users.signupInfo = {}
                             $("#addUser").modal("hide")
                         }else{
                             swal({
                                 icon: 'error',
                                 title: 'Oops...',
                                 text:  response.data.responseMsg
                             })
                         }
                    })
                 }else{
                   
                     swal({
                         icon: 'error',
                         title: 'Oops...',
                         text:  "Password didn't matched!"
                     })
                 }
             }
        },
        getDept(){
             axios.get("/administrator/getdept").then(function(response){
               
                 users.departments = response.data
             
             
             })
        },
        getUsers: function(){
            this.usersList = []
            this.limitToShow = []
            axios.get("/administrator/getusers").then(function(response){
          
                if(response.data.length > 0){
                     var length = response.data.length
                     if(length >= 10){
                     var ctr = length/10;
                     
                     for(var i = 1; i <= Math.floor(ctr); i++){

                         users.limitToShow.push(10*i)

                         }
                         if(Math.floor(ctr)*10 != length){
                             users.limitToShow.push(length)
                             
                         }
                         users.toShowCtr = 10
                         }else{
                             users.limitToShow.push(length)
                             users.toShowCtr = length
                         }
                         
                         users.usersList = response.data
                  }
            }).catch(function(err){
                alert("df")
            })
        },
        searchUser: function(){
            this.usersList = []
            this.limitToShow = []
            let data = new FormData()
            data.append("search", this.searchval)
            axios.post("/administrator/searchuser",data, {
                       headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  
           
             }).then(function(response){
             //    users.usersList = response.data
             // alert("sdf")
                if(response.data.length > 0){
                     var length = response.data.length
                     if(length >= 10){
                     var ctr = length/10;
                     
                     for(var i = 1; i <= Math.floor(ctr); i++){

                         users.limitToShow.push(10*i)

                         }
                         if(Math.floor(ctr)*10 != length){
                             users.limitToShow.push(length)
                             
                         }
                         users.toShowCtr = 10
                         }else{
                             users.limitToShow.push(length)
                             users.toShowCtr = length
                         }
                         
                         users.usersList = response.data
                  }
            }).catch(function(err){
           
            })
        }
    }
}).mount("#users")
