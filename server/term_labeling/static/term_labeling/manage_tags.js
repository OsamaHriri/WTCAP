
/*
this method initializes the manage tag page.
 */


window.onload = getHeaders();
let tagParent = "";
let depth = 0;
let ul1;
let ul2;


function addNewRoot(text){
       return $.ajax({
        type: "GET",
        url: "add_root/",
        data: {'term': text},
        dataType: "json",
    });

    }

function add_new_tag(text){
       return $.ajax({
        type: "GET",
        url: "add_tag/",
        data: {'term': text,'parent':tagParent},
        dataType: "json",
    });
    }

function getHeaders(){
    $.ajax({
        type: "GET",
        url: "get_roots/",
        dataType: "json",
        success: function (data) {
            roots = data.roots;
            roots.forEach(build_il_headers)
            return ;
        }
    });



}

function getParent(text){

    return $.ajax({
        type: "GET",
        url: "get_parent/",
        data: {'term': text},
        dataType: "json",
    });
}

function getBrothers(text ,parent){

    return $.ajax({
        type: "GET",
        url: "get_brothers/",
        data: {'term': text ,'parent' : parent},
        dataType: "json",
    });
}

function submit_clicked(){
    text = document.getElementById("newTag").value
    if(text==="")
      window.alert("The field is empty ,Please insert a tag before clicking");
    else{
       if(tagParent === ""){
        addNewRoot(text).done(function(d){
        console.log("hey")
        if(d.Tag === false)
           window.alert("The tag already exist");
        else {
        emptyTree();
        getHeaders();
        }
        });
       } else {
            add_new_tag(text).done(function(d){
            if(d.Tag === false)
            window.alert("The tag already exist");
            else if (d.parent === false)
            window.alert("The parent doesnt exist");
            else {
            temp = document.getElementById("c").innerText.split(/\r?\n/)[0]
            emptyTree();
            item_clicked(temp);
            }

           });
       }

    }
    document.getElementById("newTag").value = "";
}




function item_clicked1(obj,event){
    event.stopPropagation()
    const elem = $(obj);
    const text = elem[0].innerText.split(/\r?\n/)[0]
    if(event.target != obj)
       return
    depth = depth -1 ;
    emptyTree()
    if (depth === 1)
      flag = false
    item_clicked(text);
}

function item_clicked2(obj,event){
    event.stopPropagation()
    const elem = $(obj);
    const text = elem[0].innerText.split(/\r?\n/)[0]
    if(event.target != obj)
       return
    emptyTree()
    if( depth === 1)
       flag = true
    item_clicked(text);
}

function item_clicked3(obj,event){
    event.stopPropagation()
    const elem = $(obj);
    const text = elem[0].innerText;
    if(event.target != obj)
       return
    depth = depth + 1;
    emptyTree()
    if(depth === 1)
        flag = false
    item_clicked(text);
}

function item_clicked(text) {
    console.log()
    tagParent = text
    var ul = document.querySelector('.tree');
    getParent(text).done( function(data){
        var parent = data.parent;
        if (parent.length === 0 && flag === true) {
           getHeaders();
           depth =0
           tagParent=""
           flag = false;
           return;
          }
        var current = document.createElement("il");
        if(parent.length> 0){
            var pNode=document.createElement("il");
            pNode.appendChild(document.createTextNode(parent[0].parent.name));
            pNode.setAttribute('onclick', "item_clicked1(this,event)");
            pNode.setAttribute('class', "parent");
            ul.appendChild(pNode);
            ul1 = document.createElement('ul');
            pNode.appendChild(ul1)
            ul1.appendChild(current)
         }
        current.appendChild(document.createTextNode(text));
        current.setAttribute('onclick', "item_clicked2(this,event)");
        current.setAttribute('class', "node");
        current.setAttribute('id', "c");
        current.setAttribute("style", "color: green");
        if(parent.length == 0)
            ul.appendChild(current);
        else{
           getBrothers(text,parent[0].parent.name).done ( function (data){
            d = data.brothers
            d.forEach(build_il_brothers)
           });


        }
        ul2 = document.createElement('ul');
        current.appendChild(ul2)

       $.ajax({
            type: "GET",
            url: "get_children/",
            data: {'term': text},
            dataType: "json",
            success: function (data) {
                const children = data.children;
                children.forEach(build_il)
                return ;
            }
       });

     });
   }



function build_il(item , index ){
       //var ul = document.querySelector('.tree');
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(item.child.name));
        li.setAttribute('onclick', "item_clicked3(this,event)");
        li.setAttribute('class', "child");
        li.setAttribute("style", "color: black");
        ul2.appendChild(li);
}

function build_il_brothers(item , index ){
       //var ul = document.querySelector('.tree');
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(item.brother.name));
        li.setAttribute('onclick', "item_clicked2(this,event)");
        li.setAttribute('class', "node");
        li.setAttribute("style", "color: black");
        ul1.appendChild(li);
}


function build_il_headers(item , index ){
        var ul = document.querySelector('.tree');
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(item.root.name));
        li.setAttribute('onclick', "item_clicked3(this,event)");
        li.setAttribute('class', "child");
        ul.appendChild(li);
}



function emptyTree(){
        var ul = document.querySelector('.tree');
        var listLength = ul.children.length;
        for (i = 0; i < listLength; i++) {
           ul.removeChild(ul.children[0]);
         }
        if (typeof ul1 != 'undefined') {
           listLength = ul1.children.length;
           for (i = 0; i < listLength; i++) {
             ul1.removeChild(ul1.children[0]);
            }
        }
        if (typeof ul2 != 'undefined') {
           listLength = ul2.children.length;
           for (i = 0; i < listLength; i++) {
              ul2.removeChild(ul2.children[0]);
           }
        }}
