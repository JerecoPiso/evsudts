    var day = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    function time(){
        let date = new Date()
        let d = date.getDay()
        var datenow = month[date.getMonth()]+"-"+date.getDate().toString()+"-"+date.getFullYear().toString() + " (" + day[d] + ")"
        if(date.getHours() >= 12){
            var timenow = (date.getHours()-12) +":"+ date.getMinutes().toString() +":"+date.getSeconds().toString()+" PM"
        }else{
            var timenow = date.getHours() +":"+ date.getMinutes().toString() +":"+date.getSeconds().toString()+" AM"
        }
        document.getElementById("date").innerHTML = datenow
        document.getElementById("time").innerHTML = timenow
    }
    var searchDoc = Vue.createApp({
        delimiters: ['[', ']'],
        data(){
            return{
                searchvalue: '',
                photo: '',
                username: ''
            }
        },
        mounted(){
            this.getUserInfo()
            setInterval(time,1000)
        },
        methods:{
            getDocName(doc){
                var dot = doc.lastIndexOf("_")
                return doc.slice(0, dot)
             },
             getUserInfo(){
                axios.get("/user/getuserinfo").then(function(response){
              
                  searchDoc.photo = response.data.photo
                  searchDoc.username = response.data.username
     
           
                  // alert(response.data.username)
                }).catch(function(err){
                  console.log(err)
                })
              },
            search(){
                let data = new FormData()
                data.append("traceid", this.searchvalue)
                axios.post("/search", data, {headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value }}).then(function(response){
                
                    if(response.data.retmsg != "None"){
                        $("#searchres").text(searchDoc.searchvalue)
                        $("#docname").text(searchDoc.getDocName(response.data.docname))
                        $("#traceid").text(response.data.traceid)
                        $("#uploaded").text(response.data.uploaded)
                        $("#holder").html(response.data.holder)
                        $("#type").text(response.data.type)
                        $("#depart").text(response.data.department)
                        $("#status").text(response.data.status)
                        $("#qr").attr('src', "/media/qrcodes/"+response.data.qr)
                        $("#searchResult").modal("show")
                        $("#download-doc").val(response.data.docname)

                    }else{
                        swal({
                            icon: 'error',
                            title: 'Oops...',
                            text: "No result found for Trace #:"+searchDoc.searchvalue,
                        })
                    }
                }).catch(function(err){
                    console.log(err)
                })
            }
        }
    }).mount("#header")
    function getDepartments(){
        axios.get("/administrator/getdept").then(function(response){
            docs.departments =response.data
        })
    }

    const showNavbar = (toggleId, navId, bodyId, headerId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId),
    bodypd = document.getElementById(bodyId),
    headerpd = document.getElementById(headerId)
    
    // Validate that all variables exist
    if(toggle && nav && bodypd && headerpd){
    toggle.addEventListener('click', ()=>{
    // show navbar
    nav.classList.toggle('showModal')
    // change icon
    toggle.classList.toggle('bx-x')
    // add padding to body
    bodypd.classList.toggle('body-pd')
    // add padding to header
    headerpd.classList.toggle('body-pd')
    })
    }
    }
    
    showNavbar('header-toggle','nav-bar','body-pd','header')
    
    /*===== LINK ACTIVE =====*/
    const linkColor = document.querySelectorAll('.nav_link')
    
    function colorLink(){
    if(linkColor){
    linkColor.forEach(l=> l.classList.remove('active'))
    this.classList.add('active')
    }
    }
    linkColor.forEach(l=> l.addEventListener('click', colorLink))
    
    // Your code to run since DOM is loaded and ready
    document.onreadystatechange = function() {
	
        if (document.readyState !== "complete") {
            document.querySelector(
              "body").style.display = "none";
            document.querySelector(
              ".spinner1").style.display = "block";
        
        } else {
            document.querySelector(
              ".spinner1").style.display = "none";
            document.querySelector(
              "body").style.display = "block";
        }
      };
      $(document).ready(function(){
        $("#download-doc").click(function(){
          window.location.href="/user/download/"+$(this).val()
          
        })

        $(".top-name").click(function(){
            window.location.href="/"+$(this).data('role')+"/"+"settings"
          })
  })
