const express=require('express');
const mongoose=require('mongoose')
const bodyParser=require('body-parser');
const _=require('lodash');
const { createWriteStream } = require('fs');
const app=express();
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB",{useNewUrlParser:true});
const itemsSchema={
    name:String
};
const Item=mongoose.model("Item",itemsSchema);
const item1=new Item({
    name:"welcomeeeeee!"
});
const item2=new Item({
    name:"hit +"
});
const item3=new Item({
    name:"kaam karo"
});
const defaultItems=[item1,item2,item3];



var items=["a","hh","hhcg"];

app.use(bodyParser.urlencoded({extended:true}));
//check path of css file public/styles.css , no slash used in href
app.use(express.static("public"));
app.set("view engine","ejs");
app.get("/",function(req,res){
    
    var today=new Date();
    var options={weekday:"long",day:"numeric",month:"long"};
    var day=today.toLocaleDateString("en-US",options);
    console.log(day);
    findd();
    async function findd(){
        const x=await Item.find({});
        if(x.length===0){
            Item.insertMany(defaultItems
                //     if(err){
                //         console.log(err);
                //     }else{
                //         console.log("success in inserting");
                //     }
                // }
                );

                //redirect will again execute get once item inserted in database once inserted length will not be zero it it wil go to else and render the page
                res.redirect("/");

        }else{
            res.render("list",{date:day,add:x});

        }
        
        
        
        
        
        // console.log(x)
    }
    // (async () => {
    //     const itemsnew=(await findd())
        
    
    // });
    
    

});
const listSchema={
    name:String,
    items:[itemsSchema]
};
const List=mongoose.model("List",listSchema);

app.get("/:customListName",function(req,res){
    const customListName=_.capitalize(req.params.customListName);
    
    findd1()
    async function findd1(){
        const foundList=await List.findOne({name:customListName});
        console.log(foundList);
        if(!foundList){
            const list=new List({
                name:customListName,
                items:defaultItems
            });
            list.save();
            res.redirect("/"+customListName);
        }else{
            console.log("exis");
            res.render("list",{date:foundList.name,add:foundList.items});;
        }
    }
    
})
app.post("/",function(req,res){
    var itemName=req.body.newitem;
    const listName=req.body.list;
    var today=new Date();
    var options={weekday:"long",day:"numeric",month:"long"};
    var day=today.toLocaleDateString("en-US",options);
    const item=new Item({
        name:itemName
    });
    if(listName===day){
        item.save();
        res.redirect("/");

    }else{
        findd2()
        async function findd2(){
            const foundList1=await List.findOne({name:listName});
            foundList1.items.push(item);
            foundList1.save();
            res.redirect("/"+listName);

    }}

    

});

//use of how to delete array element in document and save ,also use of inputtype hidden in HTML FORM

app.post("/delete",function(req,res){

    const checkedItemId=req.body.checkbox;
    const listName=req.body.listName;
    var today=new Date();
    var options={weekday:"long",day:"numeric",month:"long"};
    var day=today.toLocaleDateString("en-US",options);
    if(listName==day){
        async function run() {
        
      
            // Delete the document by its _id
            await Item.deleteOne({ _id:checkedItemId });
          
            
          }
          
        run();
        
        res.redirect("/");

    }else{
        findandu()
        async function findandu(){
            await List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}})
            res.redirect("/"+listName);
        }
    }
    
    

});
app.listen(5500,function(){
    console.log("thanks");
});