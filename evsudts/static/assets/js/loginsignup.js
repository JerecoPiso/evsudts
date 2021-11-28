
    var login = Vue.createApp({
        delimiters: ['[', ']'],
       data(){
           return{
            
                error: '',
                username: '',
                password: '',
                role: '',
                recAccInfo: {username: '',password: '',pass2: '', hint: ''}
           }
       },
       mounted: function(){
          document.getElementById('login-form').style.display = 'block'
       },
       methods: {
  
                changePass(){
                    let data = new FormData()
                    if((this.recAccInfo.password && this.recAccInfo.pass2) != ""){
                            if(this.recAccInfo.password == this.recAccInfo.pass2){
                                data.append("password", this.recAccInfo.password)
                                data.append("pass2", this.recAccInfo.pass2)
                                data.append("username", this.recAccInfo.username)
                                data.append("hint", this.recAccInfo.hint)
                               
                                axios.post("/changepass",data,{headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value }}).then(function(response){
                                    if(response.data == "Success"){
                                        login.showNewPass("hide")
                                        login.recAccInfo = {}
                                        swal('Password changed succesfully', 'You can now login', "success");
                                    }else{
                                        swal({
                                            icon: 'error',
                                            title: 'Oops...',
                                            text: response.data,
                                        })
                                    }
                                }).catch(function(err){
                                    console.log(response.data)
                                })
                            }else{
                                swal({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: "Password didn't matched!",
                                })
                            }

            
                    }else{
                        swal({
                            icon: 'error',
                            title: 'Oops...',
                            text: "All field is required!",
                        })
                    }

                },
                checkAccount(){
                    let data = new FormData()
                    if((this.recAccInfo.username && this.recAccInfo.hint) != ""){
                       
                            data.append("username", this.recAccInfo.username)
                            data.append("hint", this.recAccInfo.hint)
                            axios.post("/checkaccount",data,{headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value }}).then(function(response){
                                if(response.data == "Success"){
                                    login.showNewPass("show")
                                    login.showRecoverAccount("hide")
                                }else{
                                    swal({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: response.data,
                                    })
                                }
                            }).catch(function(err){
                                console.log(response.data)
                            })
            
                    }else{
                        swal({
                            icon: 'error',
                            title: 'Oops...',
                            text: "All field is required!",
                        })
                    }

                },
                userLogin: function() {
                    var user_role = ''
                    if(this.role){
                        user_role = "Admin"
                    }else{
                        user_role = "User"
                    }
                    // alert(user_role)
                  
                    let data = new FormData()
                   
                    data.append('username', this.username)
                    data.append('password', this.password)
                    data.append('role', user_role)
           
                    axios.post('/login', data,  {headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value }}).then(function(response){
                       
                        if(response.data == "True"){
                            if(login.role){
                                window.location.href='/administrator'
                                // alert("ljahsdkjahskdjh")
                            }else{
                                window.location.href='/user'
                                // alert("sdjsdj")
                            }
                            
                        }else{
                            
                            // login.error = response.data
                            swal({
                                icon: 'error',
                                title: 'Oops...',
                                text: response.data,
                            })
                        }
                        
                      
                    })
                },
                showRecoverAccount: function(event){
                    var modal =  document.getElementById('modal')
                    if(event == 'show'){
                        modal.style.display = 'block'
                    }else{
                        modal.style.display = 'none'
                    }              
                },
                showNewPass: function(event){
                    var modal =  document.getElementById('newpass')
                    if(event == 'show'){
                        modal.style.display = 'block'
                    }else{
                        modal.style.display = 'none'
                    }              
                },
                remove: function(){
                    // document.getElementsByClassName('error')[0].style.display = "none"
                    login.error = ''
                },
                show: function () {
                    showQrCodeScanner()
                }
       }
    }).mount("#login-form")
    var signup = Vue.createApp({
       data(){
           return{
            
                signupInfo: {username: '', password: '', password2: '', hint: '', dept: ''},
                signupError: {unameErr: '', passErr: '', hintErr: '', deptErr: ''},
                showLogin: true,
                stringsOnly: /^[a-zA-Z ]+$/,
                responseInfo: '',
                responseClass: '',
                error: '',
                departments: []
           }
       },
       delimiters: ['[', ']'],
       mounted: function(){
          document.getElementById('signup-form').style.display = 'block'
         
          this.getDepartments()
       },
       methods: {
            getDepartments(){
                axios.get("/administrator/getdept").then(function(response){
                    // alert(response.data)
                    signup.departments = response.data
                    
                })
            },
            remove: function(){
                signup.responseClass = ''
            },
            signup: function(){
                    uname = this.signupInfo.username
                    pass = this.signupInfo.password
                    pass2 = this.signupInfo.password2
                    hint = this.signupInfo.hint
                    dept = this.signupInfo.dept
                    // alert(dept)
                    if(uname == ""){
                  
                        this.signupError.unameErr = "This field is required"
                        setTimeout(function(){
                            signup.signupError.unameErr = ''
                          
                        }, 3000)
                       
                    }else if(!uname.match(this.stringsOnly)){
                        this.signupError.unameErr = "Username must contain letters  only"
                        setTimeout(function(){
                            signup.signupError.unameErr = ''
                        }, 3000)
                    }else if(pass == ""){
                        this.signupError.passErr = "This field is required"
                        setTimeout(function(){
                            signup.signupError.passErr = ''
                        }, 3000)


                    }else if(pass.length < 8 ){  
                        this.signupError.passErr = "Password must contain at least 8 characters!"
                        setTimeout(function(){
                            signup.signupError.passErr = ''
                        }, 3000)
                    }else if(dept == ''){
                        
                        this.signupError.deptErr = "Department must not be empty"
                        setTimeout(function(){
                            signup.signupError.deptErr = ''
                        }, 3000)
                    }else if(hint == "" ){
                        this.signupError.hintErr = "Hint must not be empty"
                        setTimeout(function(){
                            signup.signupError.hintErr = ''
                        }, 3000)
                    }else{
                        if(pass == pass2){
                           let data = new FormData()
                           data.append('username', uname)
                           data.append('password', pass)
                           data.append('password2', pass2)
                           data.append('hint', hint)
                           data.append('role', 'User')
                           data.append('dept', dept)
                           
                           axios.post('/register', data,  {headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value }}).then(function(response){
                               console.log(response.data.responseMsg)
                                if(response.data.responseMsg === 'Success'){
                                    // alert(response.data.qrcodename)
                                    swal('Signed up successfully', 'Clicked the OK to continue', "success");
                                    // signup.responseClass = 'success'
                                    // signup.responseInfo = 'Signed up successfully'
                                    signup.signupInfo = {}
                                }else{
                                    // signup.responseClass = 'error'
                                    // signup.responseInfo = response.data.responseMsg
                                    swal({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: response.data.responseMsg,
                                    })
                                }
                           })
                        }else{
                            swal({
                                icon: 'error',
                                title: 'Oops...',
                                text: "Password didn'tmatched!",
                            })
                            // signup.responseClass = 'error'
                            // signup.responseInfo = ""
                        }
                    }
            }
           
           
       }
    }).mount("#signup-form")
