var index = Vue.createApp({
    delimiters: ['[', ']'],
    data(){
        return{
            recentActivities: [],
            notifications: [],
            notifId: ''
        }
    },
    mounted: function(){
       this.getNotifications()
       this.getRecentActivities()
       setTimeout(time,1000)
    },
    methods:{
       deleteNotification: function(){
        
          let data = new FormData()
          data.append("id", this.notifId)
          axios.post("/user/deletenotification", data,  {
          headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },  

          } ).then(function(response){
              $("#deleteNotif").modal("hide")
          
              swal(response.data, 'Click the OK to continue', "success");
              this.notifId = []
              index.getNotifications()
          }).catch(function(err){
            console.log(err)
          })
        },
        getRecentActivities: function(){
            axios.get("/user/getrecentactivities").then(function(response){
                //  alert(response.data)
                index.recentActivities = response.data
                }).catch(function(err){
                    console.log(err)
            })
        },
        getNotifications: function(){
            axios.get("/user/getnotifications").then(function(response){
                //  alert(response.data)
                index.notifications = response.data
            }).catch(function(err){
                console.log(err)
            })
        }
    }
}).mount("#index")