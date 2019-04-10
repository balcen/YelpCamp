var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest",
        image: "http://cupcake.nilssonlee.se/wp-content/uploads/2019/03/IMG_2692.jpg",
        description: "Short ribs pork pig ham hock beef ribs pork belly shoulder biltong tri-tip landjaeger turkey sirloin spare ribs. Drumstick spare ribs pork loin chuck meatloaf, porchetta beef ribs burgdoggen short loin buffalo bacon boudin andouille. Tongue turducken andouille ham hock jerky, pork chop capicola picanha landjaeger fatback pork belly. Tri-tip turducken drumstick alcatra shoulder tail. T-bone buffalo strip steak tongue flank. Porchetta tongue flank leberkas beef ribs filet mignon strip steak t-bone rump sirloin ball tip kielbasa chuck chicken cupim. Chuck biltong short loin shoulder picanha boudin swine."
    },
    {
        name: "Desert Mesa",
        image: "https://cdn.pixabay.com/photo/2015/03/26/10/29/camping-691424__340.jpg",
        description: "Short ribs pork pig ham hock beef ribs pork belly shoulder biltong tri-tip landjaeger turkey sirloin spare ribs. Drumstick spare ribs pork loin chuck meatloaf, porchetta beef ribs burgdoggen short loin buffalo bacon boudin andouille. Tongue turducken andouille ham hock jerky, pork chop capicola picanha landjaeger fatback pork belly. Tri-tip turducken drumstick alcatra shoulder tail. T-bone buffalo strip steak tongue flank. Porchetta tongue flank leberkas beef ribs filet mignon strip steak t-bone rump sirloin ball tip kielbasa chuck chicken cupim. Chuck biltong short loin shoulder picanha boudin swine."
    },
    {
        name: "Canyon Floor",
        image: "https://cdn.pixabay.com/photo/2016/11/21/16/03/campfire-1846142__340.jpg",
        description: "Short ribs pork pig ham hock beef ribs pork belly shoulder biltong tri-tip landjaeger turkey sirloin spare ribs. Drumstick spare ribs pork loin chuck meatloaf, porchetta beef ribs burgdoggen short loin buffalo bacon boudin andouille. Tongue turducken andouille ham hock jerky, pork chop capicola picanha landjaeger fatback pork belly. Tri-tip turducken drumstick alcatra shoulder tail. T-bone buffalo strip steak tongue flank. Porchetta tongue flank leberkas beef ribs filet mignon strip steak t-bone rump sirloin ball tip kielbasa chuck chicken cupim. Chuck biltong short loin shoulder picanha boudin swine."
    }
]

    
function seedDB(){
    // Remove all campgrounds
    Campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        // add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, data){
                if(err){
                    console.log(err);
                }else{
                    console.log("added a campground");
                    // create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was ineternet",
                            author: "Homer"
                        }, function(err, comm){
                            if(err){
                                console.log(err);
                            }else{
                                data.comments.push(comm);
                                data.save();
                                console.log("Create new comment!");
                            }
                        }
                    );
                }
            });
        });
    });
}


module.exports = seedDB;